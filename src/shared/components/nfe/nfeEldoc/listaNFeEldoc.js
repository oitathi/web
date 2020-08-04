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
import TipoEmissaoEnum from '../../../helpers/tipoEmissaoEnum';
import SituacaoDocumentoEnum from '../../../helpers/situacaoDocumentoEnum';
import { Link } from 'react-router-dom';
import { faFileCode, faFilePdf, faFileAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loading from '../../../helpers/loading';

const config = require('config');

class ListaNFeEldoc extends Component {

    constructor(props) {
        super(props)

        this.idEmissor = React.createRef();
        this.idDestinatario = React.createRef();
        this.numeroDocumentoFiscal = React.createRef();
        this.numeroInicialDocumentoFiscal = React.createRef();
        this.numeroFinalDocumentoFiscal = React.createRef();
        this.serieDocumentoFiscal = React.createRef();
        this.chaveAcesso = React.createRef();
        this.tipoEmissao = React.createRef();
        this.dataHoraRegistroInicio = React.createRef();
        this.dataHoraRegistroFim = React.createRef();
        this.idEstado = React.createRef();
        this.quantidadeRegistros = React.createRef();

        this.state = {
            loading: false,
            eventos: undefined,
            listaEstados: [],
            pageOfItems: []
        }

        this.listarEvento = this.listarEvento.bind(this);
        this.listarEstados = this.listarEstados.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.handleChangeDataHoraRegistroInicio = this.handleChangeDataHoraRegistroInicio.bind(this);
        this.handleChangeDataHoraRegistroFim = this.handleChangeDataHoraRegistroFim.bind(this);

    }

    componentDidMount() {
        this.listarEstados();
    }

    handleChangeDataHoraRegistroInicio(date) { this.setState({ dataHoraRegistroInicio: date }) }
    handleChangeDataHoraRegistroFim(date) { this.setState({ dataHoraRegistroFim: date }) }

    onChangePage(pageOfItems) {
        this.setState({ pageOfItems: pageOfItems });
    }

    listarEvento = () => {

        let parametros = "";
        const tipoDocumentoFiscal = "tipoDocumentoFiscal=" + "NFE";
        parametros = tipoDocumentoFiscal;

        if (this.idEmissor.current.value !== "") {
            const idEmissor = "&idEmissor=" + this.idEmissor.current.value;
            parametros = parametros + idEmissor;
        }

        if (this.idDestinatario.current.value !== "") {
            const idDestinatario = "&idDestinatario=" + this.idDestinatario.current.value;
            parametros = parametros + idDestinatario;
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

        if (this.chaveAcesso.current.value !== "") {
            const chaveAcesso = "&chaveAcesso=" + this.chaveAcesso.current.value;
            parametros = parametros + chaveAcesso;
        }

        if (this.tipoEmissao.current.value !== "") {
            const tipoEmissao = "&tipoEmissao=" + this.tipoEmissao.current.value;
            parametros = parametros + tipoEmissao;
        }

        if (this.state.dataHoraRegistroInicio ? moment(this.state.dataHoraRegistroInicio).format() : "" !== "") {
            const dataHoraRegistroInicio = "&dataHoraRegistroInicio=" + (this.state.dataHoraRegistroInicio ? moment(this.state.dataHoraRegistroInicio).format('YYYY-MM-DDTHH:mm') : "");
            parametros = parametros + dataHoraRegistroInicio;
        }

        if (this.state.dataHoraRegistroFim ? moment(this.state.dataHoraRegistroFim).format() : "" !== "") {
            const dataHoraRegistroFim = "&dataHoraRegistroFim=" + (this.state.dataHoraRegistroFim ? moment(this.state.dataHoraRegistroFim).format('YYYY-MM-DDTHH:mm') : "");
            parametros = parametros + dataHoraRegistroFim;
        }

        if (this.idEstado.current.value !== "") {
            const idEstado = "&idEstado=" + this.idEstado.current.value;
            parametros = parametros + idEstado;
        }

        if (this.quantidadeRegistros.current.value !== "") {
            const quantidadeRegistros = "&quantidadeRegistros=" + this.quantidadeRegistros.current.value;
            parametros = parametros + quantidadeRegistros;
        }

        const url = `${config.endpoint['fazemu-nfe']}/documentoFiscalEldoc?${parametros}`;
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
                    <h1>NFe Eldoc</h1>
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

            pageOfItems.map((docuEldoc, key) => {
                rows.push(
                    <tr key={key}>
                        <th className="text-center">{docuEldoc.id}</th>
                        <td className="text-center">{docuEldoc.idEmissor}</td>
                        <td className="text-center">{docuEldoc.idDestinatario}</td>
                        <td className="text-center">{docuEldoc.numeroDocumentoFiscal}</td>
                        <td className="text-center">{docuEldoc.serieDocumentoFiscal}</td>
                        <td className="text-center">{docuEldoc.chaveAcessoEnviada}</td>
                        <td className="text-center">{TipoEmissaoEnum[docuEldoc.tipoEmissao]}</td>
                        <td className="text-center">{docuEldoc.dataHoraReg}</td>
                        <td className="text-center">
                            {this.renderButtonXML(docuEldoc.chaveAcesso)}
                        </td>
                        <td className="text-center">
                            {this.renderButtonDANFE(docuEldoc.chaveAcesso)}
                        </td>
                        <td className="text-center">
                            <Link to={{ pathname: `/NFeEldoc`, docuEldoc: docuEldoc }}>
                                <FontAwesomeIcon icon={faFileAlt} />
                            </Link>
                        </td>
                        <td className="text-center">{docuEldoc.quantidadeRegistros}</td>
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
                                <th className="text-center">Destinatário</th>
                                <th className="text-center">Número</th>
                                <th className="text-center">Série</th>
                                <th className="text-center">Chave Acesso</th>
                                <th className="text-center">Tipo Emissão</th>
                                <th className="text-center">Data/Hora Reg.</th>
                                <th className="text-center">XML</th>
                                <th className="text-center">DANFE</th>
                                <th className="text-center">NFe</th>
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

    renderEmitente() {
        return (
            <div className="col-2">
                <div className="form-label">Emitente</div>
                <input className="form-control" type="number" min="0" ref={this.idEmissor} />
            </div>
        )
    }

    renderDestinatario() {
        return (
            <div className="col-2">
                <div className="form-label">Destinatário</div>
                <input className="form-control" type="number" min="0" ref={this.idDestinatario} />
            </div>
        )
    }

    renderChaveDeAcesso() {
        return (
            <div className="col-3">
                <div className="form-label">Chave Acesso</div>
                <input className="form-control" type="text" min="0" ref={this.chaveAcesso} />
            </div>
        )
    }

    renderNumero() {
        return (
            <div className="col-2">
                <div className="form-label">Número</div>
                <input className="form-control" type="number" min="0" ref={this.numeroDocumentoFiscal} />
            </div>
        )
    }

    renderNumeroInicial() {
        return (
            <div className="col-2">
                <div className="form-label">Número Inicial</div>
                <input className="form-control" type="number" min="0" ref={this.numeroInicialDocumentoFiscal} />
            </div>
        )
    }

    renderNumeroFinal() {
        return (
            <div className="col-2">
                <div className="form-label">Número Final</div>
                <input className="form-control" type="number" min="0" ref={this.numeroFinalDocumentoFiscal} />
            </div>
        )
    }

    renderSerie() {
        return (
            <div className="col-2">
                <div className="form-label">Série</div>
                <input className="form-control" type="text" ref={this.serieDocumentoFiscal} />
            </div>
        )
    }

    renderTipoEmissao() {
        return (
            <div className="col-2">
                <div className="form-label">Tipo Emissão</div>
                <select className="form-control" ref={this.tipoEmissao}>
                    <option value=''>Todos</option>
                    <option value='1'>Normal</option>
                    <option value='4'>EPEC</option>
                    <option value='6'>SVC-AN</option>
                    <option value='7'>SVC-RS</option>
                </select>
            </div>
        )
    }

    renderDataInicio() {
        return (
            <div className="col-0">
                <div className="form-label">Data Início</div>
                <DatePicker className="form-control" selected={this.state.dataHoraRegistroInicio} onChange={this.handleChangeDataHoraRegistroInicio} dateFormat="dd/MM/yyyy HH:mm" showTimeInput timeFormat="HH:mm" />
            </div>
        )
    }

    renderDataFim() {
        return (
            <div className="col-0">
                <div className="form-label">Data Fim</div>
                <DatePicker className="form-control" selected={this.state.dataHoraRegistroFim} onChange={this.handleChangeDataHoraRegistroFim} dateFormat="dd/MM/yyyy HH:mm" showTimeInput timeFormat="HH:mm" />
            </div>
        )
    }

    renderQtdRegistros() {
        return (
            <div className="col-2">
                <div className="form-label">Qtde. Registros</div>
                <select className="form-control" ref={this.quantidadeRegistros}>
                    <option>50</option>
                    <option>250</option>
                    <option>500</option>
                    <option>1000</option>
                </select>
            </div>
        )
    }

    renderEstados() {
        let optionItemsEstado = this.state.listaEstados.map((estado, key) =>
            <option key={key} value={estado.id}>{estado.nome}</option>
        );
        return (
            <div className="col-2">
                <div className="form-label">Estado</div>
                <select className="form-control" ref={this.idEstado}>
                    <option value='' defaultChecked>- Selecionar -</option>
                    {optionItemsEstado}
                </select>
            </div>
        )
    }

    listarEstados() {
        const urlEstados = `${config.endpoint['fazemu-nfe']}/estado/ativo`;
        axiosAuth.get(urlEstados, getConfig())
            .then(response => {
                console.log(response.data);
                this.setState({
                    listaEstados: response.data,
                })
            }).catch(error => {
                console.log("erro:", { error })
                this.setState({
                    listaEstados: response.data,
                    alert: {
                        visible: true,
                        message: "Erro ao buscar estados",
                        level: "danger"
                    }
                })
            });
    }



    renderSearchFields() {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="form-group">
                        <div className="form">
                            <div className="form-row">
                                {this.renderEmitente()}
                                {this.renderDestinatario()}
                                {this.renderChaveDeAcesso()}
                                {this.renderEstados()}
                                {this.renderTipoEmissao()}

                            </div>
                            <div className="form-row">
                                {this.renderNumero()}
                                {this.renderNumeroInicial()}
                                {this.renderNumeroFinal()}
                                {this.renderSerie()}
                            </div>
                            <div className="form-row">
                                {this.renderDataInicio()}
                                {this.renderDataFim()}
                                {this.renderQtdRegistros()}

                            </div>
                        </div>
                    </div>
                    <Button color="primary" size="sm" onClick={this.listarEvento}>Consultar</Button>
                </div>
            </div>
        )
    }

    renderButtonDANFE(chaveAcesso) {
        
            return (
                <a href={this.getDanfe(chaveAcesso)} target="_blank">
                    <FontAwesomeIcon icon={faFilePdf} />
                </a>
            )
        
    };

    getDanfe(chaveAcesso) {
        const url = `${config.endpoint['fazemu-nfe']}/nfe/${chaveAcesso}/danfe`;
        return url;
    };

    renderButtonXML(chaveAcesso) {
       
            return (
                <a href={this.getXml(chaveAcesso)} target="_blank">
                    <FontAwesomeIcon icon={faFileCode} />
                </a>
            )
        
    }

    getXml(chaveAcesso) {
        const url = `${config.endpoint['fazemu-nfe']}/documentoFiscalEldoc/eldoc/nfe/${chaveAcesso}/xml`;
        return url;
    };

}

export default ListaNFeEldoc