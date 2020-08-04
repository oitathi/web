import React, { Component } from 'react';
import axiosAuth from '../../../helpers/axios-auth';
import { getConfig } from '../../../helpers/axios-config';
import { pathOr } from 'ramda';
import moment from 'moment';
import EstadoEnum from '../../../helpers/estadoEnum';
import TipoEmissaoEnum from '../../../helpers/tipoEmissaoEnum';
import { faBatteryThreeQuarters } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const config = require('config');

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tipoEmissaoAtivo: undefined,
            dataFimVigencia: undefined,
            fazemuStatus: undefined,
            fazemuNFeStatus: undefined,
            fazemuNFSeStatus: undefined,
            situacao: undefined,
            interval: ""
        };
    }

    componentDidMount() {

        this.getTipoEmissaoAtivo();
        this.getDataFimVigencia();
        this.getFazemuStatus();
        this.getFazemuNFeStatus();
        this.getFazemuNFSeStatus();
        const interval = setInterval(this.startSetInterval, 180000);
        this.setState({ interval: interval });
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    startSetInterval = () => {
        this.getTipoEmissaoAtivo();
        this.getDataFimVigencia();
        this.getFazemuStatus();
        this.getFazemuNFeStatus();
        this.getFazemuNFSeStatus();
    }

    render() {
        const { tipoEmissaoAtivo } = this.state;
        const { dataFimVigencia } = this.state;
        const { fazemuStatus } = this.state;
        const { fazemuNFeStatus } = this.state;
        const { fazemuNFSeStatus } = this.state;

        return (
            <div>
                <div className="card mt-1">
                    <div className="card-header">
                        <h4><FontAwesomeIcon icon={faBatteryThreeQuarters} /> Status do Servi&ccedil;o FAZEMU/SEFAZ </h4>
                    </div>
                    <div className="card-body p-1">
                        <div className="form-group">
                            <div className="form">
                                <div className="form-row">
                                    <div className="col-xs-6">
                                        {this.renderDataFimVigência(dataFimVigencia)}
                                    </div>
                                    <div className="col-xs-6">
                                        {this.renderTipoEmissaoAtivo(tipoEmissaoAtivo)}
                                    </div>
                                    <div className="col-xs-6">
                                        {this.renderFazemuStatus(fazemuStatus, fazemuNFeStatus, fazemuNFSeStatus)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderDataFimVigência(dataFimVigencia) {
        if (dataFimVigencia !== undefined &&
            dataFimVigencia.length > 0) {

            const dataFimVigencia = pathOr([], ['dataFimVigencia'], this.state)
            const fimVigencia = []

            dataFimVigencia.map((edig, key) => {
                fimVigencia.push(
                    <tr key={key}>
                        <td className="align-middle"><strong>{edig.idEmissorRaiz}</strong></td>
                        <td className="align-middle"><strong>{moment(edig.dataVigenciaInicio).format("DD/MM/YYYY HH:mm:ss")}</strong></td>
                        <td className="align-middle"><strong>{moment(edig.dataVigenciaFim).format("DD/MM/YYYY HH:mm:ss")}</strong></td>
                    </tr>
                )
            })

            return (
                <table className="table table-striped table-bordered table-sm mb-0" >
                    <thead>
                        <tr className="text-center">
                            <th colSpan="4" className="align-middle" className="bg-warning">Certificado Digital</th>
                        </tr>
                        <tr className="text-center">
                            <th className="align-middle">Emissor Raiz</th>
                            <th className="align-middle">Data/Hora Início</th>
                            <th className="align-middle">Data/Hora Fim</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fimVigencia}
                    </tbody>
                </table>
            )
        }
    }

    renderTipoEmissaoAtivo(tipoEmissaoAtivo) {
        if (tipoEmissaoAtivo !== undefined &&
            tipoEmissaoAtivo.length > 0) {

            const tipoEmissaoAtivo = pathOr([], ['tipoEmissaoAtivo'], this.state)
            const tipoEmissao = []

            tipoEmissaoAtivo.map((este, key) => {
                tipoEmissao.push(
                    <tr key={key}>
                        <td className="align-middle"><strong>{EstadoEnum[este.idEstado]}</strong></td>
                        <td className="align-middle"><strong>{TipoEmissaoEnum[este.tipoEmissao]}</strong></td>
                        <td className="align-middle"><strong>{moment(este.dataInicio).format("DD/MM/YYYY HH:mm:ss")}</strong></td>
                        <td className="align-middle"><strong>{moment(este.dataFim).format("DD/MM/YYYY HH:mm:ss")}</strong></td>
                    </tr>
                )
            })
            return (
                <table className="table table-striped table-bordered table-sm mb-0">
                    <thead>
                        <tr className="text-center">
                            <th colSpan="4" className="align-middle" className="bg-danger">Contingência EPEC/SVC</th>
                        </tr>
                        <tr className="text-center">
                            <th className="align-middle">Estado</th>
                            <th className="align-middle">Tipo Emissão</th>
                            <th className="align-middle">Data/Hora Início</th>
                            <th className="align-middle">Data/Hora Fim</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tipoEmissao}
                    </tbody>
                </table>
            )
        }
    }

    renderFazemuStatus(fazemuStatus, fazemuNFeStatus, fazemuNFSeStatus) {
        if (fazemuStatus !== undefined &&
            fazemuStatus !== "ON") {

            console.log("fazemuStatus", fazemuStatus);
            return (
                <table className="table table-striped table-bordered table-sm mb-0">
                    <thead>
                        <tr className="text-center">
                            <th colSpan="4" className="align-middle" className="bg-info">Status Fazemu</th>
                        </tr>
                        <tr className="text-center">
                            <th className="align-middle">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="align-middle"><strong>SISTEMA EM MANUTENÇÃO</strong></td>
                        </tr>
                    </tbody>
                </table>
            )
        }

        if (fazemuNFeStatus !== undefined &&
            fazemuNFeStatus !== "ON") {

            console.log("fazemuNFeStatus", fazemuNFeStatus);
            return (
                <table className="table table-striped table-bordered table-sm mb-0">
                    <thead>
                        <tr className="text-center">
                            <th colSpan="4" className="align-middle" className="bg-info">Status Fazemu-NFe</th>
                        </tr>
                        <tr className="text-center">
                            <th className="align-middle">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="align-middle"><strong>SISTEMA EM MANUTENÇÃO</strong></td>
                        </tr>
                    </tbody>
                </table>
            )
        }

        if (fazemuNFSeStatus !== undefined &&
            fazemuNFSeStatus !== "ON") {

            console.log("fazemuNFSeStatus", fazemuNFSeStatus);
            return (
                <table className="table table-striped table-bordered table-sm mb-0">
                    <thead>
                        <tr className="text-center">
                            <th colSpan="4" className="align-middle" className="bg-info">Status Fazemu-NFSe</th>
                        </tr>
                        <tr className="text-center">
                            <th className="align-middle">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="align-middle"><strong>SISTEMA EM MANUTENÇÃO</strong></td>
                        </tr>
                    </tbody>
                </table>
            )
        }
    }

    getDataFimVigencia = () => {
        const url = `${config.endpoint['fazemu-nfe']}/certificadoDigital/dataFimVigencia`;

        axiosAuth.get(url, getConfig())
            .then(response => {
                this.setState({ dataFimVigencia: response.data })
            }).catch(error => {
                console.log("error", { error })
                return null;
            });

    };

    getTipoEmissaoAtivo = () => {
        const url = `${config.endpoint['fazemu-nfe']}/estadoTipoEmissao/tipoEmissaoAtivo`;

        axiosAuth.get(url, getConfig())
            .then(response => {
                this.setState({ tipoEmissaoAtivo: response.data })
            }).catch(error => {
                console.log("error", { error })
                return null;
            });
    };

    getFazemuStatus = () => {
        const url = `${config.endpoint['rest-nfe']}/getKeyValue?key=FAZEMU_STATUS`;

        axiosAuth.get(url, getConfig())
            .then(response => {
                this.setState({ fazemuStatus: response.data })
            }).catch(error => {
                console.log("error", { error })
                return null;
            });
    };

    getFazemuNFeStatus = () => {
        const url = `${config.endpoint['rest-nfe']}/getKeyValue?key=FAZEMU_NFE_STATUS`;

        axiosAuth.get(url, getConfig())
            .then(response => {
                this.setState({ fazemuNFeStatus: response.data })
            }).catch(error => {
                console.log("error", { error })
                return null;
            });
    };

    getFazemuNFSeStatus = () => {
        const url = `${config.endpoint['rest-nfse']}/getKeyValue?key=FAZEMU_NFSE_STATUS`;

        axiosAuth.get(url, getConfig())
            .then(response => {
                this.setState({ fazemuNFSeStatus: response.data })
            }).catch(error => {
                console.log("error", { error })
                return null;
            });
    };

}

export default Dashboard;