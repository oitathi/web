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
import TipoEmissaoEnum from '../../../helpers/tipoEmissaoEnum';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';

const config = require('config');

class ListaEstadoTipoEmissao extends Component {

    constructor(props) {
        super(props);

        this.state = {
            idEstado: '',
            dataHoraInicio: '',
            dataHoraFim: '',
            tipoEmissao: '',
            listaEstadoTipoEmissao: [],
            listaEstados: [],
            pageOfItems: [],
            alert: {
                visible: false,
                message: "FAZEMU-WEB",
                level: "warning"
            }
        }

        this.handleChangeIdEstado = this.handleChangeIdEstado.bind(this);
        this.handleChangeDataHoraInicio = this.handleChangeDataHoraInicio.bind(this);
        this.handleChangeDataHoraFim = this.handleChangeDataHoraFim.bind(this);
        this.handleChangeTipoEmissao = this.handleChangeTipoEmissao.bind(this);

        this.onChangePage = this.onChangePage.bind(this);
        this.onDismiss = this.onDismiss.bind(this);

        this.listarEstadoTipoEmissao = this.listarEstadoTipoEmissao.bind(this);
    }

    handleChangeIdEstado(event) { this.setState({ idEstado: event.target.value }) }
    handleChangeDataHoraInicio(event) { this.setState({ dataHoraInicio: event.target.value }) }
    handleChangeDataHoraFim(event) { this.setState({ dataHoraFim: event.target.value }) }
    handleChangeTipoEmissao(event) { this.setState({ tipoEmissao: event.target.value }) }

    componentDidMount() {
        const url = `${config.endpoint['fazemu-nfe']}/estadoTipoEmissao`;

        axiosAuth.get(url, getConfig())
            .then(response => {
                console.log(response.data);
                this.setState({
                    listaEstadoTipoEmissao: response.data,
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

    listarEstadoTipoEmissao = () => {

        let parametros = "";
        if (this.state.idEstado !== "") {
            const idEstado = "idEstado=" + this.state.idEstado;
            parametros = parametros + idEstado;
        }
        if (this.state.dataHoraInicio ? moment(this.state.dataHoraInicio).format() : "" !== "") {
            const dataHoraInicio = "&dataHoraInicio=" + (this.state.dataHoraInicio ? moment(this.state.dataHoraInicio).format() : "");
            parametros = parametros + dataHoraInicio;
        }
        if (this.state.dataHoraFim ? moment(this.state.dataHoraFim).format() : "" !== "") {
            const dataHoraFim = "&dataHoraFim=" + (this.state.dataHoraFim ? moment(this.state.dataHoraFim).format() : "");
            parametros = parametros + dataHoraFim;
        }
        if (this.state.tipoEmissao !== "") {
            const tipoEmissao = "&tipoEmissao=" + this.state.tipoEmissao;
            parametros = parametros + tipoEmissao;
        }

        const url = `${config.endpoint['fazemu-nfe']}/estadoTipoEmissao?${parametros}`;

        axiosAuth.get(url, getConfig())
            .then(response => {
                console.log(response.data)
                this.setState({
                    listaEstadoTipoEmissao: response.data,
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
        const { listaEstadoTipoEmissao } = this.state;

        return (
            <div>
                {this.renderAlert()}
                <div>
                    <h1>Estado Tipo Emissão</h1>
                </div>
                {this.renderSearchFields()}
                {this.renderRows(listaEstadoTipoEmissao)}
            </div>
        );
    }

    renderRows(listaEstadoTipoEmissao) {
        if (listaEstadoTipoEmissao !== undefined) {
            const pageOfItems = pathOr([], ['pageOfItems'], this.state);
            const rows = [];

            pageOfItems.map((este, key) => {
                rows.push(
                    <tr key={key}>
                        <td className="text-center">{EstadoEnum[este.idEstado]}</td>
                        <td className="text-center">{TipoEmissaoEnum[este.tipoEmissao]}</td>
                        <td className="text-center">{moment(este.dataInicio).format("DD/MM/YYYY HH:mm:ss")}</td>
                        <td className="text-center">{moment(este.dataFim).format("DD/MM/YYYY HH:mm:ss")}</td>
                        <td className="text-center">{este.justificativa}</td>
                        <td className="text-center">{este.usuario}</td>
                        <td className="text-center">{moment(este.dataHora).format("DD/MM/YYYY HH:mm:ss")}</td>
                        <td className="text-center">
                            <Link to={{
                                pathname: `/estadoTipoEmissao`,
                                estadoTipoEmissao: este,
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
                                <th className="text-center">Tipo Emissão</th>
                                <th className="text-center">Data Início</th>
                                <th className="text-center">Data Fim</th>
                                <th className="text-center">Justificativa</th>
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
                        <Pagination items={this.state.listaEstadoTipoEmissao} onChangePage={this.onChangePage} />
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
                    <Button color="primary" size="sm" onClick={this.listarEstadoTipoEmissao}>Consultar</Button>&nbsp;
                    <Link to="/estadoTipoEmissao"><Button color="success" size="sm">Criar</Button></Link>
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

export default ListaEstadoTipoEmissao