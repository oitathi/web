import React, { Component } from 'react';
import axiosAuth from '../../../helpers/axios-auth'
import { getConfig } from '../../../helpers/axios-config';
import Loader from '../../../helpers/loader';

const config = require('config');

class MonitoriaLote extends Component {
    state = {
        loteStatus: undefined,
        interval: ""
    };

    componentDidMount() {
        this.getLoteStatus();
        const interval = setInterval(this.startSetInterval, 10000);
        this.setState({ interval: interval });
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    startSetInterval = () => {
        this.getLoteStatus();
    }

    render() {
        const { loteStatus } = this.state;
        return (
            <div>
                <div>
                    <h1>Monitoria Lotes</h1>
                </div>
                {this.renderRows(loteStatus)}
            </div>
        )

    }

    renderRows(loteStatus) {
        const rows = []
        if (loteStatus === undefined) {
            return (<Loader />)
        } else {
            const lotes = []
            for (let loteSituacao in loteStatus) {
                const value = loteStatus[loteSituacao];
                const lote = {
                    situacao: loteSituacao,
                    true: value.true,
                    false: value.false
                }
                lotes.push(lote);
            }

            lotes.map((lote, key) => {
                rows.push(
                    <tr key={key}>
                        <td>{lote.situacao}</td>
                        <td>{lote.true}</td>
                        <td>{lote.false}</td>
                    </tr>
                )
            })

            return (
                <div>
                    <div className="card mt-1">
                        <div className="card-header">
                            <h4>Status Lotes</h4>
                        </div>
                        <div className="card-body"></div>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <td>Situação</td>
                                    <td>-3 minutos</td>
                                    <td>+3 minutos</td>
                                </tr>
                            </thead>
                            <tbody>
                                {rows}
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        }
    }
    getLoteStatus = () => {
        const url = `${config.endpoint['fazemu-nfe']}/lote/status`;

        axiosAuth.get(url, getConfig())
            .then(response => {
                this.setState({ loteStatus: response.data })
            }).catch(error => {
                console.log("error", { error })
                return null;
            });

    };
}

export default MonitoriaLote;