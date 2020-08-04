import React, { Component } from 'react';
import axiosAuth from '../../../helpers/axios-auth';
import { getConfig } from '../../../helpers/axios-config';
import {
    Button,
    Table
} from 'reactstrap';
import { pathOr } from 'ramda';
import DatePicker from 'react-datepicker';
import Pagination from '../../Pagination';
import moment from 'moment';
import MunicipioEnum from '../../../helpers/municipioEnum';
import SituacaoDocumentoEnum from '../../../helpers/situacaoDocumentoEnum';
import { Link } from 'react-router-dom';
import { faFileCode, faTimes, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loading from '../../../helpers/loading';

const config = require('config');

class DocumentoFiscal extends Component {

    constructor(props) {
        super(props)

        this.idEmissor = React.createRef();
        this.idDestinatario = React.createRef();
        this.idMunicipio = React.createRef();
        this.numeroDocumentoFiscal = React.createRef();
        this.numeroInicialDocumentoFiscal = React.createRef();
        this.numeroFinalDocumentoFiscal = React.createRef();
        this.serieDocumentoFiscal = React.createRef();
        this.numeroDocumentoFiscalExterno = React.createRef();
        this.chaveAcesso = React.createRef();
        this.tipoEmissao = React.createRef();
        this.situacaoDocumento = React.createRef();
        this.dataHoraRegistroInicio = React.createRef();
        this.dataHoraRegistroFim = React.createRef();
        this.quantidadeRegistros = React.createRef();

        this.state = {
            loading: false,
            eventos: undefined,
            pageOfItems: []
        }

        this.listarEvento = this.listarEvento.bind(this);

        this.onChangePage = this.onChangePage.bind(this);

        this.handleChangeDataHoraRegistroInicio = this.handleChangeDataHoraRegistroInicio.bind(this);
        this.handleChangeDataHoraRegistroFim = this.handleChangeDataHoraRegistroFim.bind(this);

    }

    handleChangeDataHoraRegistroInicio(date) { this.setState({ dataHoraRegistroInicio: date }) }
    handleChangeDataHoraRegistroFim(date) { this.setState({ dataHoraRegistroFim: date }) }

    onChangePage(pageOfItems) {
        this.setState({ pageOfItems: pageOfItems });
    }

    listarEvento = () => {

        let parametros = "";
        const tipoDocumentoFiscal = "tipoDocumentoFiscal=" + "NFSE";
        parametros = tipoDocumentoFiscal;

        if (this.idEmissor.current.value !== "") {
            const idEmissor = "&idEmissor=" + this.idEmissor.current.value;
            parametros = parametros + idEmissor;
        }

        if (this.idDestinatario.current.value !== "") {
            const idDestinatario = "&idDestinatario=" + this.idDestinatario.current.value;
            parametros = parametros + idDestinatario;
        }

        if (this.idMunicipio.current.value !== "") {
            const idMunicipio = "&idMunicipio=" + this.idMunicipio.current.value;
            parametros = parametros + idMunicipio;
        }

        if (this.numeroDocumentoFiscal.current.value !== "") {
            const numeroDocumentoFiscal = "&numeroDocumentoFiscal=" + this.numeroDocumentoFiscal.current.value;
            parametros = parametros + numeroDocumentoFiscal;
        }

        if (this.numeroInicialDocumentoFiscal.current.value !== "") {
            const numeroInicialDocumentoFiscal = "&numeroInicialDocumentoFiscal=" + this.numeroInicialDocumentoFiscal.current.value;
            parametros = parametros + numeroInicialDocumentoFiscal;
        }

        if (this.numeroFinalDocumentoFiscal.current.value !== "") {
            const numeroFinalDocumentoFiscal = "&numeroFinalDocumentoFiscal=" + this.numeroFinalDocumentoFiscal.current.value;
            parametros = parametros + numeroFinalDocumentoFiscal;
        }

        if (this.serieDocumentoFiscal.current.value !== "") {
            const serieDocumentoFiscal = "&serieDocumentoFiscal=" + this.serieDocumentoFiscal.current.value;
            parametros = parametros + serieDocumentoFiscal;
        }

        if (this.numeroDocumentoFiscalExterno.current.value !== "") {
            const numeroDocumentoFiscalExterno = "&numeroDocumentoFiscalExterno=" + this.numeroDocumentoFiscalExterno.current.value;
            parametros = parametros + numeroDocumentoFiscalExterno;
        }

        if (this.chaveAcesso.current.value !== "") {
            const chaveAcesso = "&chaveAcesso=" + this.chaveAcesso.current.value;
            parametros = parametros + chaveAcesso;
        }

        if (this.situacaoDocumento.current.value !== "") {
            const situacaoDocumento = "&situacaoDocumento=" + this.situacaoDocumento.current.value;
            parametros = parametros + situacaoDocumento;
        }

        if (this.state.dataHoraRegistroInicio ? moment(this.state.dataHoraRegistroInicio).format() : "" !== "") {
            const dataHoraRegistroInicio = "&dataHoraRegistroInicio=" + (this.state.dataHoraRegistroInicio ? moment(this.state.dataHoraRegistroInicio).format('YYYY-MM-DDTHH:mm') : "");
            parametros = parametros + dataHoraRegistroInicio;
        }

        if (this.state.dataHoraRegistroFim ? moment(this.state.dataHoraRegistroFim).format() : "" !== "") {
            const dataHoraRegistroFim = "&dataHoraRegistroFim=" + (this.state.dataHoraRegistroFim ? moment(this.state.dataHoraRegistroFim).format('YYYY-MM-DDTHH:mm') : "");
            parametros = parametros + dataHoraRegistroFim;
        }
        if (this.quantidadeRegistros.current.value !== "") {
            const quantidadeRegistros = "&quantidadeRegistros=" + this.quantidadeRegistros.current.value;
            parametros = parametros + quantidadeRegistros;
        }

        const url = `${config.endpoint['fazemu-nfse']}/documentoFiscal?${parametros}`;
        console.log(url);

        this.setState({ loading: true })
        axiosAuth.get(url, getConfig())
            .then(response => {
                console.log(response.data)
                this.setState({
                    eventos: response.data
                })
            }).catch(error => {
                console.log(error);
                return null
            }).then(() => {
                this.setState({ loading: false })
            });

    };

    render() {
        const { eventos } = this.state;

        return (
            <div>
                <div>
                    <h1>NFSe</h1>
                </div>
                {this.renderSearchFields()}
                {this.renderRows(eventos)}
                {this.state.loading && <Loading />}
            </div>
        )
    }

    renderRows(eventos) {
        if (eventos !== undefined) {

            const pageOfItems = pathOr([], ['pageOfItems'], this.state)
            const rows = []

            pageOfItems.map((docu, key) => {
                rows.push(
                    <tr key={key}>
                        <th className="text-center">{docu.id}</th>
                        <td className="text-center">{docu.idEmissor}</td>
                        <td className="text-center">{docu.idDestinatario}</td>
                        <td className="text-center">{MunicipioEnum[docu.idMunicipio]}</td>
                        <td className="text-center">{docu.numeroDocumentoFiscal}</td>
                        <td className="text-center">{docu.serieDocumentoFiscal}</td>
                        <td className="text-center">{docu.numeroDocumentoFiscalExterno}</td>
                        <td className="text-center">{docu.chaveAcessoEnviada}</td>
                        <td className="text-center">{SituacaoDocumentoEnum[docu.situacaoDocumento]}</td>
                        <td className="text-center">{docu.dataHoraReg}</td>
                        <td className="text-center">
                            {this.renderButtonXML(docu.situacaoDocumento, docu.chaveAcesso)}
                        </td>
                        <td className="text-center">
                            <Link to={{ pathname: `/NFSe`, documentoFiscal: docu }}>
                                <FontAwesomeIcon icon={faFileAlt} />
                            </Link>
                        </td>
                        <td className="text-center">{docu.quantidadeRegistros}</td>
                    </tr>
                )
            })

            return (
                <div className="card-header">
                    <Table striped>
                        <thead>
                            <tr>
                                <th className="text-center">#</th>
                                <th className="text-center">Emitente</th>
                                <th className="text-center">Tomador</th>
                                <th className="text-center">Município</th>
                                <th className="text-center">Número</th>
                                <th className="text-center">Série</th>
                                <th className="text-center">Número Doc. Ext.</th>
                                <th className="text-center">Chave Acesso</th>
                                <th className="text-center">Situação Doc.</th>
                                <th className="text-center">Data/Hora Reg.</th>
                                <th className="text-center">XML</th>
                                <th className="text-center">NFSe</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </Table>
                    <div align="right">
                        <Pagination items={this.state.eventos} onChangePage={this.onChangePage} />
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
                                    <div className="form-label">Emitente</div>
                                    <input className="form-control" type="number" min="0" ref={this.idEmissor} />
                                </div>
                                <div className="col-2">
                                    <div className="form-label">Tomador</div>
                                    <input className="form-control" type="number" min="0" ref={this.idDestinatario} />
                                </div>
                                <div className="col-3">
                                    <div className="form-label">Chave Acesso</div>
                                    <input className="form-control" type="text" min="0" ref={this.chaveAcesso} />
                                </div>
                                <div className="col-2">
                                    <div className="form-label">Município</div>
                                    <select className="form-control" ref={this.idMunicipio}>
                                        <option value=''>Todos</option>
                                        <option value='1'>Osasco</option>
                                        <option value='2'>Itapevi</option>
                                        <option value='3'>Rio de Janeiro</option>
                                        <option value='4'>São Paulo</option>
                                        <option value='5'>Recife</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-1">
                                    <div className="form-label">RPS/Doc. Ext.</div>
                                    <input className="form-control" type="number" min="0" ref={this.numeroDocumentoFiscalExterno} />
                                </div>
                                <div className="col-1">
                                    <div className="form-label">Número</div>
                                    <input className="form-control" type="number" min="0" ref={this.numeroDocumentoFiscal} />
                                </div>
                                <div className="col-1">
                                    <div className="form-label">Número Inicial</div>
                                    <input className="form-control" type="number" min="0" ref={this.numeroInicialDocumentoFiscal} />
                                </div>
                                <div className="col-1">
                                    <div className="form-label">Número Final</div>
                                    <input className="form-control" type="number" min="0" ref={this.numeroFinalDocumentoFiscal} />
                                </div>
                                <div className="col-1">
                                    <div className="form-label">Série</div>
                                    <input className="form-control" type="text" ref={this.serieDocumentoFiscal} />
                                </div>
                                <div className="col-1">
                                    <div className="form-label">Situação Doc.</div>
                                    <select className="form-control" ref={this.situacaoDocumento}>
                                        <option value=''>Todos</option>
                                        <option value='A'>Autorizado</option>
                                        <option value='R'>Rejeitado</option>
                                        <option value='C'>Cancelado</option>
                                        <option value='V'>Enviado</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-0">
                                    <div className="form-label">Data Inicio</div>
                                    <DatePicker className="form-control" selected={this.state.dataHoraRegistroInicio} onChange={this.handleChangeDataHoraRegistroInicio} dateFormat="dd/MM/yyyy HH:mm" showTimeInput timeFormat="HH:mm" />
                                </div>
                                <div className="col-0">
                                    <div className="form-label">Data Fim</div>
                                    <DatePicker className="form-control" selected={this.state.dataHoraRegistroFim} onChange={this.handleChangeDataHoraRegistroFim} dateFormat="dd/MM/yyyy HH:mm" showTimeInput timeFormat="HH:mm" />
                                </div>
                                <div className="col-1">
                                    <div className="form-label">Qtde. Registros</div>
                                    <select className="form-control" ref={this.quantidadeRegistros}>
                                        <option>50</option>
                                        <option>250</option>
                                        <option>500</option>
                                        <option>1000</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button color="primary" size="sm" onClick={this.listarEvento}>Consultar</Button>
                </div>
            </div>
        )
    }

    renderButtonXML(situacaoDocumento, chaveAcesso) {
        if (situacaoDocumento != "V" &&
            situacaoDocumento != "R") {
            return (
                <a href={this.getXml(chaveAcesso)} target="_blank">
                    <FontAwesomeIcon icon={faFileCode} />
                </a>
            )
        } else {
            return (
                <FontAwesomeIcon icon={faTimes} />
            )
        }
    }

    getXml(chaveAcesso) {
        const url = `${config.endpoint['fazemu-nfse']}/nfse/${chaveAcesso}/xml`;
        return url;
    };

}

export default DocumentoFiscal