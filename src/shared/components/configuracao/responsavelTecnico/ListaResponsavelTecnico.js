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
import SituacaoResponsavelTecnicoEnum from '../../../helpers/situacaoResponsavelTecnicoEnum';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';

const config = require('config');

class ListaResponsavelTecnico extends Component {

    constructor(props) {
        super(props);

        this.state = {
            idEmissor: '',
            situacao: '',
            responsaveis: undefined,
            pageOfItems: [],
            alert: {
                visible: false,
                message: "FAZEMU-WEB",
                level: "warning"
            }
        }

        this.handleChangeidEmissor = this.handleChangeidEmissor.bind(this);
        this.handleChangeSituacao = this.handleChangeSituacao.bind(this);

        this.onChangePage = this.onChangePage.bind(this);
        this.listarResponsaveis = this.listarResponsaveis.bind(this);
    }

    handleChangeidEmissor(event) { this.setState({ idEmissor: event.target.value }) }
    handleChangeSituacao(event) { this.setState({ situacao: event.target.value }) }

     componentDidMount() {
        this.listarResponsaveis();
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

    listarResponsaveis = () => {

        let parametros = "";
        if (this.state.idEmissor !== "") {
            const idEmissor = "idEmissor=" + this.state.idEmissor;
            parametros = parametros + idEmissor;
        }
        if (this.state.situacao !== "") {
            const situacao = "&situacao=" + this.state.situacao;
            parametros = parametros + situacao;
        }
        
        const url = `${config.endpoint['fazemu-nfe']}/responsavelTecnico?${parametros}`;
        axiosAuth.get(url, getConfig())
            .then(response => {
                console.log(response.data)
                this.setState({
                    responsaveis: response.data,
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
        const { responsaveis } = this.state;

        return (
            <div>
                {this.renderAlert()}
                <div>
                    <h1>Responsáveis Técnicos</h1>
                </div>
                {this.renderSearchFields()}
                {this.renderRows(responsaveis)}
            </div>
        );
    }

    renderRows(responsaveis) {
        if (responsaveis !== undefined) {


            const pageOfItems = pathOr([], ['pageOfItems'], this.state)
            const rows = []

            pageOfItems.map((resp, key) => {
                rows.push(
                    <tr key={key}>
                        <th className="text-center">{resp.idEmissorRaiz}</th>
                        <td className="text-center">{resp.cnpj}</td>
                        <td className="text-center">{resp.contato}</td>
                        <td className="text-center">{resp.email}</td>
                        <td className="text-center">{resp.telefone}</td>
                        <td className="text-center">{SituacaoResponsavelTecnicoEnum[resp.situacao]}</td>
                        <td className="text-center">
                            <Link to={{
                                pathname: `/responsavelTecnico`,
                                respTecnico: resp,
                                isNew: false
                            }}><FontAwesomeIcon icon={faPencilAlt} color="black" title="Editar" /></Link>
                        </td>
                    </tr>
                )
            })

            return (
                <div className="card-header">
                    <Table striped>
                        <thead>
                            <tr>
                                <th className="text-center">Emissor</th>
                                <th className="text-center">Cnpj</th>
                                <th className="text-center">Contato</th>
                                <th className="text-center">E-mail</th>
                                <th className="text-center">Telefone</th>
                                <th className="text-center">Situação</th>
                                <th className="text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </Table>
                    <div align="right">
                        <Pagination items={this.state.responsaveis} onChangePage={this.onChangePage} />
                    </div>
                </div>
            );
        }
    }

    renderSearchFields() {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="form-group">
                        <div className="form">
                            <div className="form-row">
                                <div className="col-2">
                                    <div className="form-label">Emissor</div>
                                    <input type="number" className="form-control" value={this.state.idEmissor} onChange={this.handleChangeidEmissor}></input>
                                </div>
                                <div className="col-1">
                                    <div className="form-label">Situação</div>
                                    <select className="form-control" value={this.state.situacao} onChange={this.handleChangeSituacao}>>
                                        <option value=''>Todos</option>
                                        <option value='A'>Ativo</option>
                                        <option value='C'>Cancelado</option>
                                    </select>
                                </div>
                                <small className="form-text text-muted"></small>
                            </div>
                        </div>
                    </div>
                    <Button color="primary" size="sm" onClick={this.listarResponsaveis}>Consultar</Button>&nbsp;
                    <Link to="/responsavelTecnico"><Button color="success" size="sm">Criar</Button></Link>
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

export default ListaResponsavelTecnico