import React, { Component } from 'react';
import axiosAuth from '../../../helpers/axios-auth';
import { getConfig } from '../../../helpers/axios-config';
import {
    Alert,
    Button,
    Table
} from 'reactstrap';
import { pathOr } from 'ramda';
import Pagination from '../../Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';

const config = require('config');

class ListaCodigoRetornoAutorizador extends Component {

    constructor(props) {
        super(props);

        this.state = {
            codigoRetorno: '',
            listaCodigoRetorno: undefined,
            pageOfItems: [],
            alert: {
                visible: false,
                message: "FAZEMU-WEB",
                level: "warning"
            }
        }

        this.handleChangeCodigoRetorno = this.handleChangeCodigoRetorno.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.listarCodigoRetorno = this.listarCodigoRetorno.bind(this);
    }

    handleChangeCodigoRetorno(event) { this.setState({ codigoRetorno: event.target.value }) }

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

    listarCodigoRetorno = () => {
        const codigoRetorno = this.state.codigoRetorno;
        const url = `${config.endpoint['fazemu-nfe']}/codigoRetornoAutorizador/${codigoRetorno}`;

        axiosAuth.get(url, getConfig())
            .then(response => {
                console.log(response.data)
                this.setState({
                    listaCodigoRetorno: response.data,
                    alert: {
                        visible: false,
                        message: "FAZEMU-WEB",
                        level: "warning"
                    }
                })
            }).catch(error => {
                console.log(error);
                this.setState(
                    {
                        alert: {
                            visible: true,
                            message: error.response.data.message,
                            level: "warning"
                        }
                    }
                )
            });

    };

    render() {
        const pageOfItems = pathOr([], ['pageOfItems'], this.state)
        const rows = []

        pageOfItems.map((item, key) => {
            rows.push(
                <tr key={key}>
                    <th className="text-center">{item.id}</th>
                    <td className="text-center">{item.descricao}</td>
                    <td className="text-center">{item.situacaoAutorizadorTXT}</td>
                    <td className="text-center">
                        <Link to={{
                            pathname: `/codigoRetornoAutorizador`,
                            codigoRetornoAutorizador: item,
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
                    <h1>Código Retorno Autorizador</h1>
                </div>
                {this.renderSearchFields()}
                <div className="card-header">
                    <Table striped>
                        <thead>
                            <tr>
                                <th className="text-center">Código</th>
                                <th className="text-center">Descrição</th>
                                <th className="text-center">Situação</th>
                                <th className="text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </Table>

                    <div align="right">
                        <Pagination items={this.state.listaCodigoRetorno} onChangePage={this.onChangePage} />
                    </div>
                </div>
            </div>
        );
    }

    renderSearchFields() {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="form-group">
                        <div className="form">
                            <div className="form-row">
                                <div className="col-3">
                                    <div className="form-label">Código Retorno</div>
                                    <input type="number" className="form-control" placeholder="Código Retorno (CSTAT)" value={this.state.codigoRetorno} onChange={this.handleChangeCodigoRetorno}></input>
                                </div>
                                <small className="form-text text-muted"></small>
                            </div>
                        </div>
                    </div>
                    <Button color="primary" size="sm" onClick={this.listarCodigoRetorno}>Consultar</Button>&nbsp;
                    {/* <Link to="/codigoRetornoAutorizador"><Button color="success" size="sm">Criar</Button></Link> */}
                </div>
            </div>
        )
    }

    renderAlert() {
        return (
            <Alert color={this.state.alert.level} isOpen={this.state.alert.visible} toggle={this.onDismiss}>
                {this.state.alert.message}
            </Alert>
        )
    }

}

export default ListaCodigoRetornoAutorizador