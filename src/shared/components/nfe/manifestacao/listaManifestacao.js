import React, { Component } from 'react';
import axiosAuth from '../../../helpers/axios-auth';
import { getConfig } from '../../../helpers/axios-config';
import {
    Alert,
    Button,
    Table

} from 'reactstrap';
import { pathOr } from 'ramda';
import DatePicker from 'react-datepicker';
import Pagination from '../../Pagination';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { faFileAlt, faFileCode, faTimes, faFilePdf, faBorderNone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TipoEventoManifestacaoEnum from '../../../helpers/tipoEventoManifestacaoEnum';
import Loading from '../../../helpers/loading';
import '../../../css/style.css';


const config = require('config');

class ListaManifestacao extends Component {

    constructor(props) {
        super(props)

        this.state = {
            emitente: '',
            destinatario: '',
            chaveAcesso: '',
            numero: '',
            numeroInicial: '',
            numeroFinal: '',
            serie: '',
            manifestacao: '',
            dataInicio: '',
            dataFim: '',
            qtdRegistros: '50',
            csv: [],
            eventos: [],
            pageOfItems: [],
            loading: false,
            alert: {
                visible: false,
                message: "FAZEMU-WEB",
                level: "warning"
            }
        }

        this.handleChangeEmitente = this.handleChangeEmitente.bind(this);
        this.handleChangeDestinatario = this.handleChangeDestinatario.bind(this);
        this.handleChangeChaveAcesso = this.handleChangeChaveAcesso.bind(this);
        this.handleChangeNumero = this.handleChangeNumero.bind(this);
        this.handleChangeNumeroInicial = this.handleChangeNumeroInicial.bind(this);
        this.handleChangeNumeroFinal = this.handleChangeNumeroFinal.bind(this);
        this.handleChangeSerie = this.handleChangeSerie.bind(this);
        this.handleChangeManifestacao = this.handleChangeManifestacao.bind(this);
        this.handleChangeDataInicio = this.handleChangeDataInicio.bind(this);
        this.handleChangeDataFim = this.handleChangeDataFim.bind(this);
        this.handleChangeQtdRegistros = this.handleChangeQtdRegistros.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.listarEvento = this.listarEvento.bind(this);
    }

    handleChangeEmitente(event) { this.setState({ emitente: event.target.value }) }
    handleChangeDestinatario(event) { this.setState({ destinatario: event.target.value }) }
    handleChangeChaveAcesso(event) { this.setState({ chaveAcesso: event.target.value }) }
    handleChangeNumero(event) { this.setState({ numero: event.target.value }) }
    handleChangeNumeroInicial(event) { this.setState({ numeroInicial: event.target.value }) }
    handleChangeNumeroFinal(event) { this.setState({ numeroFinal: event.target.value }) }
    handleChangeSerie(event) { this.setState({ serie: event.target.value }) }
    handleChangeManifestacao(event) { this.setState({ manifestacao: event.target.value }) }
    handleChangeDataInicio(date) { this.setState({ dataInicio: date }) }
    handleChangeDataFim(date) { this.setState({ dataFim: date }) }
    handleChangeQtdRegistros(event) { this.setState({ qtdRegistros: event.target.value }) }
    onChangePage(pageOfItems) { this.setState({ pageOfItems: pageOfItems }) }

    render() {
        return (
            <div>
                <h1>Manifestação</h1>
                {this.renderAlert()}
                <div className="card">
                    <div className="card-body">
                        <div className="form-group">
                            <div className="form">
                                {this.renderSearchFields()}
                            </div>
                        </div>
                    </div>
                </div>
                {this.renderRows()}
                {this.state.loading && <Loading />}
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

    renderSearchFields() {
        return (
            <div>
                <div className="form-row">
                    {this.renderSearchForEmitente()}
                    {this.renderSearchForDestinatario()}
                    {this.renderSearchForChaveAcesso()}
                </div>
                <div className="form-row">
                    {this.renderSearchForNumero()}
                    {this.renderSearchForNumeroInicial()}
                    {this.renderSearchForNumeroFinal()}
                    {this.renderSearchForSerie()}
                    {this.renderSearchForManifestacao()}
                </div>
                <div className="form-row">
                    {this.renderSearchForDataInicio()}
                    {this.renderSearchForDataFim()}
                    {this.renderSearchForQtdRegistro()}
                </div>
                {this.renderSearchButtons()}
            </div>
        )
    }

    renderSearchForEmitente() {
        return (
            <div className="col-2">
                <div className="form-label">Emitente</div>
                <input type="text" className="form-control" placeholder="Emitente" value={this.state.emitente} onChange={this.handleChangeEmitente}></input>
            </div>
        )
    }

    renderSearchForDestinatario() {
        return (
            <div className="col-2">
                <div className="form-label">Destinatário</div>
                <input type="text" className="form-control" placeholder="Destinatario" value={this.state.destinatario} onChange={this.handleChangeDestinatario}></input>
            </div>
        )
    }

    renderSearchForChaveAcesso() {
        return (
            <div className="col-5">
                <div className="form-label">Chave Acesso</div>
                <input type="text" className="form-control" placeholder="Chave Acesso" value={this.state.chaveAcesso} onChange={this.handleChangeChaveAcesso}></input>
            </div>
        )
    }

    renderSearchForNumero() {
        return (
            <div className="col-2">
                <div className="form-label">Número</div>
                <input type="text" className="form-control" placeholder="Número" value={this.state.numero} onChange={this.handleChangeNumero}></input>
            </div>
        )
    }

    renderSearchForNumeroInicial() {
        return (
            <div className="col-2">
                <div className="form-label">Número Inicial</div>
                <input type="text" className="form-control" placeholder="Número Inicial" value={this.state.numeroInicial} onChange={this.handleChangeNumeroInicial}></input>
            </div>
        )
    }

    renderSearchForNumeroFinal() {
        return (
            <div className="col-2">
                <div className="form-label">Número Final</div>
                <input type="text" className="form-control" placeholder="Número Final" value={this.state.numeroFinal} onChange={this.handleChangeNumeroFinal}></input>
            </div>
        )
    }

    renderSearchForSerie() {
        return (
            <div className="col-1">
                <div className="form-label">Série</div>
                <input type="text" className="form-control" placeholder="Série" value={this.state.serie} onChange={this.handleChangeSerie}></input>
            </div>
        )
    }

    renderSearchForManifestacao() {
        let tipoEventoManifestacao = Object.keys(TipoEventoManifestacaoEnum).map(key => (
            <option key={key} value={key}>{TipoEventoManifestacaoEnum[key]}</option>));

        return (
            <div className="col-2">
                <div className="form-label">Tipo Manifestação</div>
                <select className="form-control" name="manifestacao" value={this.state.manifestacao} onChange={this.handleChangeManifestacao}>
                    <option value='' defaultChecked>- Selecionar -</option>
                    {tipoEventoManifestacao}
                </select>
            </div>
        )
    }

    renderSearchForDataInicio() {
        return (
            <div className="col-2">
                <div className="form-label">Data Início</div>
                <DatePicker className="form-control" selected={this.state.dataInicio} onChange={this.handleChangeDataInicio} dateFormat="dd/MM/yyyy HH:mm:ss" showTimeInput timeFormat="HH:mm:ss" />
            </div>
        )
    }

    renderSearchForDataFim() {
        return (
            <div className="col-2">
                <div className="form-label">Data Fim</div>
                <DatePicker className="form-control" selected={this.state.dataFim} onChange={this.handleChangeDataFim} dateFormat="dd/MM/yyyy HH:mm:ss" showTimeInput timeFormat="HH:mm:ss" />
            </div>
        )
    }

    renderSearchForQtdRegistro() {
        return (
            <div className="col-1">
                <div className="form-label">Qtde. Registros</div>
                <select className="form-control" name="qtdRegistros" value={this.state.qtdRegistros} onChange={this.handleChangeQtdRegistros}>
                    <option>50</option>
                    <option>250</option>
                    <option>500</option>
                    <option>1000</option>
                </select>
            </div>
        )
    }

    renderSearchButtons() {
        return (
            <div className="form-row ml-1 mt-3 mb-3">
                <Button color="primary" size="sm" className="mr-2" onClick={this.listarEvento}>Consultar</Button>
                <Link to='/manifestacaoMassiva'>
                    <Button className="mr-1" color="success" size="sm">Manifestação Massiva</Button>
                </Link>
                <Button style={{ backgroundColor: '#FF598F', border: 'none' }} size="sm" className="mr-2" onClick={() => this.listarEvento(true)}>Exportar CSV</Button>
            </div>
        )
    }

    renderRows() {
        const pageOfItems = pathOr([], ['pageOfItems'], this.state)
        const rows = []


        pageOfItems.map((documentoFiscal, key) => {
            rows.push(
                <tr key={key}>
                    <th className="text-center">{documentoFiscal.id}</th>
                    <td className="text-center">{documentoFiscal.idEmissor}</td>
                    <td className="text-center">{documentoFiscal.idDestinatario}</td>
                    <td className="text-center">{documentoFiscal.numeroDocumentoFiscal}</td>
                    <td className="text-center">{documentoFiscal.serieDocumentoFiscal}</td>
                    <td className="text-center">{documentoFiscal.chaveAcesso}</td>
                    <td className="text-center">{TipoEventoManifestacaoEnum[documentoFiscal.manifestado]}</td>
                    <td className="text-center">{documentoFiscal.dataHoraRegStr}</td>
                    <td className="text-center">{documentoFiscal.dataHoraManifestacaoStr}</td>
                    <td className="text-center">
                        {this.renderButtonXml(documentoFiscal)}
                    </td>
                    <td className="text-center">
                        {this.renderButtonDANFE(documentoFiscal)}
                    </td>
                    <td className="text-center">
                        <Link to={{ pathname: `/documentoManifestacao`, documentoFiscal: documentoFiscal }}>
                            <FontAwesomeIcon icon={faFileAlt} />
                        </Link>
                    </td>
                </tr>
            )
        })

        if (this.state.eventos.length > 0) {
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
                                <th className="text-center">Tipo Manif.</th>
                                <th className="text-center">Data Emissão NFe</th>
                                <th className="text-center">Data Manif.</th>
                                <th className="text-center">XML</th>
                                <th className="text-center">DANFE</th>
                                <th className="text-center">Manif.</th>
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

    renderButtonDANFE(documentoFiscal) {
        if (documentoFiscal.manifestado != 'N') {
            return (
                <a href={this.getDanfe(documentoFiscal.chaveAcesso)} target="_blank">
                    <FontAwesomeIcon icon={faFilePdf} />
                </a>
            )
        } else {
            return (
                <FontAwesomeIcon icon={faTimes} />
            )
        }

    };

    getDanfe(chaveAcesso) {
        const url = `${config.endpoint['fazemu-nfe']}/nfe/${chaveAcesso}/danfe`;
        return url;
    };

    renderButtonXml(documentoFiscal) {
        if (documentoFiscal.manifestado != 'N') {
            return (
                <a href={this.getXml(documentoFiscal.chaveAcesso)} target="_blank">
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
        const url = `${config.endpoint['fazemu-nfe']}/nfe/${chaveAcesso}/xml`;
        return url;
    };

    listarEvento = (isCSV) => {

        let parametros = "";
        const tipoDocumentoFiscal = "tipoDocumentoFiscal=" + "NFE";
        parametros = tipoDocumentoFiscal;

        if (this.state.emitente !== "") {
            const idEmissor = "&idEmissor=" + this.state.emitente;
            parametros = parametros + idEmissor;
        }

        if (this.state.destinatario !== "") {
            const idDestinatario = "&idDestinatario=" + this.state.destinatario;
            parametros = parametros + idDestinatario;
        }

        if (this.state.numero !== "") {
            const numeroDocumentoFiscal = "&numeroDocumentoFiscal=" + this.state.numero;
            parametros = parametros + numeroDocumentoFiscal;
        }

        if (this.state.numeroInicial !== "") {
            const numeroInicialDocumentoFiscal = "&numeroInicialDocumentoFiscal=" + this.state.numeroInicial;
            parametros = parametros + numeroInicialDocumentoFiscal;
        }

        if (this.state.numeroFinal !== "") {
            const numeroFinalDocumentoFiscal = "&numeroFinalDocumentoFiscal=" + this.state.numeroFinal;
            parametros = parametros + numeroFinalDocumentoFiscal;
        }

        if (this.state.serie !== "") {
            const serieDocumentoFiscal = "&serieDocumentoFiscal=" + this.state.serie;
            parametros = parametros + serieDocumentoFiscal;
        }

        if (this.state.chaveAcesso !== "") {
            const chaveAcesso = "&chaveAcesso=" + this.state.chaveAcesso;
            parametros = parametros + chaveAcesso;
        }

        if (this.state.dataInicio ? moment(this.state.dataInicio).format() : "" !== "") {
            const dataInicio = "&dataHoraRegistroInicio=" + (this.state.dataInicio ? moment(this.state.dataInicio).format() : "");
            parametros = parametros + dataInicio;
        }

        if (this.state.dataFim ? moment(this.state.dataFim).format() : "" !== "") {
            const dataFim = "&dataHoraRegistroFim=" + (this.state.dataFim ? moment(this.state.dataFim).format() : "");
            parametros = parametros + dataFim;
        }

        if (this.state.manifestacao !== "") {
            const manifestadoFilter = "&manifestadoFilter=" + this.state.manifestacao;
            parametros = parametros + manifestadoFilter;
        }

        if (this.state.qtdRegistros !== "") {
            const quantidadeRegistros = "&quantidadeRegistros=" + this.state.qtdRegistros;
            parametros = parametros + quantidadeRegistros;
        }

        const url = `${config.endpoint['fazemu-nfe']}/documentoFiscal/manifestacao/?${parametros}`;

        this.setState({ loading: true })

        if (isCSV != true) {
            axiosAuth.get(url, getConfig())
                .then(response => {
                    console.log(response.data)
                    this.setState({
                        eventos: response.data,
                        alert: {
                            visible: response.data.length > 0 ? false : true,
                            message: "Nenhum dado encontrado",
                            level: "success"
                        }
                    })
                }).catch(error => {
                    console.log(error);
                    return null
                }).then(() => {
                    this.setState({ loading: false })
                });
        } else {
            axiosAuth.get(url, getConfig())
                .then(response => {
                    console.log(response.data)
                    this.setState({
                        csv: response.data,
                        alert: {
                            visible: response.data.length > 0 ? false : true,
                            message: "Nenhum dado encontrado",
                            level: "success"
                        }
                    })
                }).catch(error => {
                    console.log(error);
                    return null
                }).then(() => {
                    let pesquisa = this.state.csv;

                    let url = `${config.endpoint['fazemu-nfe']}/download/processar/csv`;

                    axiosAuth.post(url, pesquisa, getConfig())
                        .then(response => {
                            var blob = new Blob([response.data], { type: "application/octet-stream" });
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'manifestacao.csv';
                            a.click();
                            this.setState({
                                alert: {
                                    visible: true,
                                    message: "Arquivo exportado com sucesso!",
                                    level: "success"
                                }
                            })
                        }).catch(response => {
                            console.log(response)
                            this.setState({
                                alert: {
                                    visible: true,
                                    message: "Falha ao exportar o arquivo!",
                                    level: "danger"
                                }
                            })
                        });

                    this.setState({ loading: false })
                });

        }
    }

} export default ListaManifestacao