import React, { Component } from 'react';
import axiosAuth from '../../../helpers/axios-auth';
import { getConfig } from '../../../helpers/axios-config';
import {
    Alert,
    Table
} from 'reactstrap';
import { pathOr } from 'ramda';
import Pagination from '../../Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';

const config = require('config');

class ListaParametrosInfra extends Component {

    constructor(props) {
        super(props);

        this.state = {
            listaParametros: [],
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
        const url = `${config.endpoint['fazemu-nfe']}/parametrosInfra`;

        axiosAuth.get(url, getConfig())
            .then(response => {
                console.log(response.data);
                this.setState({
                    listaParametros: response.data,
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
                    <th>{item.idParametro}</th>
                    <td>{item.descricao}</td>
                    <td className="text-center">{item.tipo}</td>
                    <td>{item.valor}</td>
                    <td className="text-center">
                        <Link to={{
                            pathname: `/parametrosInfra`,
                            parametro: item,
                            isNew: false
                        }}><FontAwesomeIcon icon={faPencilAlt} color="black" title="Editar" /></Link>
                    </td>
                </tr>
            )
        })

        return (
            <div>
                {this.renderAlert()}
                <div>
                    <h1>Parâmetros</h1>
                </div>
                
                <div className="card-header">
                    <Table striped>
                        <thead>
                            <tr>
                                <th className="text-center">#</th>
                                <th className="text-center">Descrição</th>
                                <th className="text-center">Tipo</th>
                                <th className="text-center">Valor</th>
                                <th className="text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </Table>

                    <div align="right">
                        <Pagination items={this.state.listaParametros} onChangePage={this.onChangePage} />
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

export default ListaParametrosInfra