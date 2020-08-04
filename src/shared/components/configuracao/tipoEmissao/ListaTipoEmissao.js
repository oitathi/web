import React, { Component } from 'react';
import axiosAuth from '../../../helpers/axios-auth';
import { getConfig } from '../../../helpers/axios-config';
import { getCookie } from '../../../helpers/cookie';
import { COOKIE_USER_ID } from '../../../helpers/parameters';
import {
    Alert,
    Table
} from 'reactstrap';
import { pathOr } from 'ramda';
import Pagination from '../../Pagination';
import SituacaoImpressoraEnum from '../../../helpers/situacaoImpressoraEnum';

const config = require('config');

class ListaTipoEmissao extends Component {

    constructor(props) {
        super(props);

        this.state = {
            listaTipoEmissao: undefined,
            pageOfItems: [],
            alert: {
                visible: false,
                message: "FAZEMU-WEB",
                level: "warning"
            }
        }

        this.onChangePage = this.onChangePage.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
    }

    componentDidMount() {
        const userId = getCookie(COOKIE_USER_ID);
        const url = `${config.endpoint['fazemu-nfe']}/tipoEmissao`;

        axiosAuth.get(url, getConfig())
            .then(response => {
                console.log(response.data);
                this.setState({
                    listaTipoEmissao: response.data,
                    alert: {
                        visible: false,
                        message: "FAZEMU-WEB",
                        level: "warning"
                    }
                })
            }).catch(error => {
                console.log("error b2wlogin", { error })
                return null;
            });
    }

    onChangePage(pageOfItems) {
        this.setState({ pageOfItems: pageOfItems });
    }

    onDismiss() {
        this.setState(
            {
                alert: {
                    visible: false
                }
            }
        );
    }

    render() {
        const pageOfItems = pathOr([], ['pageOfItems'], this.state)
        const rows = []

        pageOfItems.map((item, key) => {
            rows.push(
                <tr key={key}>
                    <th className="text-center">{item.id}</th>
                    <td className="text-center">{item.nome}</td>
                    <td className="text-center">{SituacaoImpressoraEnum[item.situacao]}</td>
                </tr>
            )
        })

        return (
            <div>
                {this.renderAlert()}
                <div>
                    <h1>Tipo Emissão</h1>
                </div>

                <div className="card-header">
                    <Table striped>
                        <thead>
                            <tr>
                                <th className="text-center">#</th>
                                <th className="text-center">Nome</th>
                                <th className="text-center">Situação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </Table>

                    <div align="right">
                        <Pagination items={this.state.listaTipoEmissao} onChangePage={this.onChangePage} />
                    </div>
                </div>
            </div>
        );
    }

    renderAlert() {
        return (
            <Alert color={this.state.alert.level} isOpen={this.state.alert.visible} toggle={this.onDismiss}>
                {this.state.alert.message}
            </Alert>
        )
    }

}

export default ListaTipoEmissao