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
import MunicipioEnum from '../../../helpers/municipioEnum';
import SimNaoEnum from '../../../helpers/simNaoEnum';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';

const config = require('config');

class ListaMunicipioConfiguracao extends Component {

    constructor(props) {
        super(props);

        this.state = {
            idMunicipio: '',
            listaMunicipioConfiguracao: [],
            listaMunicipios: [],
            pageOfItems: [],
            alert: {
                visible: false,
                message: "FAZEMU-WEB",
                level: "warning"
            }
        }

        this.handleChangeIdMunicipio = this.handleChangeIdMunicipio.bind(this);

        this.onChangePage = this.onChangePage.bind(this);
        this.onDismiss = this.onDismiss.bind(this);

        this.listarMunicipioConfiguracao = this.listarMunicipioConfiguracao.bind(this);
    }

    handleChangeIdMunicipio(event) { this.setState({ idMunicipio: event.target.value }) }

    componentDidMount() {
        const url = `${config.endpoint['fazemu-nfse']}/municipioConfiguracao`;

        axiosAuth.get(url, getConfig())
            .then(response => {
                console.log(response.data);
                this.setState({
                    listaMunicipioConfiguracao: response.data,
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

        const urlMunicipios = `${config.endpoint['fazemu-nfse']}/municipio/ativo`;
        axiosAuth.get(urlMunicipios, getConfig())
            .then(response => {
                console.log(response.data);
                this.setState({
                    listaMunicipios: response.data,
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

    listarMunicipioConfiguracao = () => {

        let parametros = "";
        const tipoDocumentoFiscal = "tipoDocumentoFiscal=NFSE";
        parametros = tipoDocumentoFiscal;

        if (this.state.idMunicipio !== "") {
            const idMunicipio = "&idMunicipio=" + this.state.idMunicipio;
            parametros = parametros + idMunicipio;
        }

        const url = `${config.endpoint['fazemu-nfse']}/municipioConfiguracao?${parametros}`;

        axiosAuth.get(url, getConfig())
            .then(response => {
                console.log(response.data)
                this.setState({
                    listaMunicipioConfiguracao: response.data,
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
        const { listaMunicipioConfiguracao } = this.state;

        return (
            <div>
                {this.renderAlert()}
                <div>
                    <h1>Municipio Configuração</h1>
                </div>
                {this.renderSearchFields()}
                {this.renderRows(listaMunicipioConfiguracao)}
            </div>
        );
    }

    renderRows(listaMunicipioConfiguracao) {
        if (listaMunicipioConfiguracao !== undefined) {
            const pageOfItems = pathOr([], ['pageOfItems'], this.state);
            const rows = [];

            pageOfItems.map((item, key) => {
                rows.push(
                    <tr key={key}>
                        <td className="text-center">{MunicipioEnum[item.idMunicipio]}</td>
                        <td className="text-center">{SimNaoEnum[item.inLote]}</td>
                        <td className="text-center">{SimNaoEnum[item.inAtivo]}</td>
                        <td className="text-center">{item.usuario}</td>
                        <td className="text-center">{moment(item.dataHora).format("DD/MM/YYYY HH:mm:ss")}</td>
                        <td className="text-center">
                            <Link to={{
                                pathname: `/municipioConfiguracao`,
                                MunicipioConfiguracao: item,
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
                                <th className="text-center">Municipio</th>
                                <th className="text-center">Utiliza Lote?</th>
                                <th className="text-center">Ativo?</th>
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
                        <Pagination items={this.state.listaMunicipioConfiguracao} onChangePage={this.onChangePage} />
                    </div>
                </div>
            );
        }
    }

    renderSearchFields() {
        const listaMunicipios = pathOr([], ['listaMunicipios'], this.state);

        let optionMunicipios = listaMunicipios.map((municipio, key) =>
            <option key={key} value={municipio.idMunicipio}>{municipio.nome}</option>
        );

        return (
            <div className="card">
                <div className="card-body">
                    <div className="form-group">
                        <div className="form">
                            <div className="form-row">
                                <div className="col-3">
                                    <div className="form-label">Municipio</div>
                                    <select className="form-control" value={this.state.idMunicipio} onChange={this.handleChangeIdMunicipio}>
                                        <option value='' defaultChecked>- Selecionar -</option>
                                        {optionMunicipios}
                                    </select>
                                </div>
                                <small className="form-text text-muted"></small>
                            </div>
                        </div>
                    </div>
                    <Button color="primary" size="sm" onClick={this.listarMunicipioConfiguracao}>Consultar</Button>&nbsp;
                    {/* <Link to="/MunicipioConfiguracao"><Button color="success" size="sm">Criar</Button></Link> */}
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
export default ListaMunicipioConfiguracao