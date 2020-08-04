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
import moment from 'moment';
import EstadoEnum from '../../../helpers/estadoEnum';
import SimNaoEnum from '../../../helpers/simNaoEnum';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';

const config = require('config');

class ListaEstadoConfiguracao extends Component {

    constructor(props) {
        super(props);

        this.state = {
            idEstado: '',
            listaEstadoConfiguracao: [],
            listaEstados: [],
            pageOfItems: [],
            alert: {
                visible: false,
                message: "FAZEMU-WEB",
                level: "warning"
            }
        }

        this.handleChangeIdEstado = this.handleChangeIdEstado.bind(this);

        this.onChangePage = this.onChangePage.bind(this);
        this.onDismiss = this.onDismiss.bind(this);

        this.listarEstadoConfiguracao = this.listarEstadoConfiguracao.bind(this);
    }

    handleChangeIdEstado(event) { this.setState({ idEstado: event.target.value }) }

    componentDidMount() {
        const url = `${config.endpoint['fazemu-nfe']}/estadoConfiguracao`;

        axiosAuth.get(url, getConfig())
            .then(response => {
                console.log(response.data);
                this.setState({
                    listaEstadoConfiguracao: response.data,
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

        const urlEstados = `${config.endpoint['fazemu-nfe']}/estado/ativo`;
        axiosAuth.get(urlEstados, getConfig())
            .then(response => {
                console.log(response.data);
                this.setState({
                    listaEstados: response.data,
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

    listarEstadoConfiguracao = () => {

        let parametros = "";
        const tipoDocumentoFiscal = "tipoDocumentoFiscal=" + "NFE";
        parametros = tipoDocumentoFiscal;

        if (this.state.idEstado !== "") {
            const idEstado = "&idEstado=" + this.state.idEstado;
            parametros = parametros + idEstado;
        }


        const url = `${config.endpoint['fazemu-nfe']}/estadoConfiguracao?${parametros}`;

        axiosAuth.get(url, getConfig())
            .then(response => {
                console.log(response.data)
                this.setState({
                    listaEstadoConfiguracao: response.data,
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
        const { listaEstadoConfiguracao } = this.state;

        return (
            <div>
                {this.renderAlert()}
                <div>
                    <h1>Estado Configuração</h1>
                </div>
                {this.renderSearchFields()}
                {this.renderRows(listaEstadoConfiguracao)}
            </div>
        );
    }

    renderRows(listaEstadoConfiguracao) {
        if (listaEstadoConfiguracao !== undefined) {
            const pageOfItems = pathOr([], ['pageOfItems'], this.state);
            const rows = [];

            pageOfItems.map((item, key) => {
                rows.push(
                    <tr key={key}>
                        <td className="text-center">{EstadoEnum[item.idEstado]}</td>
                        <td className="text-center">{SimNaoEnum[item.inEPECAutomatico]}</td>
                        <td className="text-center">{item.usuario}</td>
                        <td className="text-center">{moment(item.dataHora).format("DD/MM/YYYY HH:mm:ss")}</td>
                        <td className="text-center">
                            <Link to={{
                                pathname: `/estadoConfiguracao`,
                                estadoConfiguracao: item,
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
                                <th className="text-center">Estado</th>
                                <th className="text-center">Epec Automático</th>
                                <th className="text-center">Usuário</th>
                                <th className="text-center">Data/Hora</th>
                                <th className="text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </Table>
                    <div align="right">
                        <Pagination items={this.state.listaEstadoConfiguracao} onChangePage={this.onChangePage} />
                    </div>
                </div>
            );
        }
    }

    renderSearchFields() {
        const listaEstados = pathOr([], ['listaEstados'], this.state);

        let optionEstados = listaEstados.map((estado, key) =>
            <option key={key} value={estado.id}>{estado.nome}</option>
        );

        return (
            <div className="card">
                <div className="card-body">
                    <div className="form-group">
                        <div className="form">
                            <div className="form-row">
                                <div className="col-3">
                                    <div className="form-label">Estado</div>
                                    <select className="form-control" value={this.state.idEstado} onChange={this.handleChangeIdEstado}>
                                        <option value='' defaultChecked>- Selecionar -</option>
                                        {optionEstados}
                                    </select>
                                </div>
                                <small className="form-text text-muted"></small>
                            </div>
                        </div>
                    </div>
                    <Button color="primary" size="sm" onClick={this.listarEstadoConfiguracao}>Consultar</Button>&nbsp;
                    {/* <Link to="/estadoConfiguracao"><Button color="success" size="sm">Criar</Button></Link> */}
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

export default ListaEstadoConfiguracao