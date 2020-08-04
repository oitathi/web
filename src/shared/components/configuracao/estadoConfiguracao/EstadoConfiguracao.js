import React, { Component } from 'react';
import axiosAuth from '../../../helpers/axios-auth';
import { getConfig } from '../../../helpers/axios-config';
import { getCookie } from '../../../helpers/cookie';
import { COOKIE_USER_ID } from '../../../helpers/parameters';
import {
    Alert,
    Button, FormText
} from 'reactstrap';
import { pathOr } from 'ramda';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Menu from '../../menu';
import DatePicker from "react-datepicker";

const config = require('config');

class EstadoConfiguracao extends Component {

    constructor(props) {
        super(props)

        this.acessKey = React.createRef();
        this.state = {
            listaEstados: [],
            alert: {
                visible: false,
                message: "FAZEMU-WEB",
                level: "warning"
            },
            idEstado: '',
            tipoDocumentoFiscal: '',
            inAtivo: '',
            inResponsavelTecnico: '',
            inCSRT: '',
            inEPECAutomatico: '',
            quantidadeMinimaRegistros: '',
            periodo: '',
            periodoEPEC: '',
            usuario: ''
        }

        this.onDismiss = this.onDismiss.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.handleChangeDataInicioEmissao = this.handleChangeDataInicioEmissao.bind(this);
        this.handleChangeDataFimEmissao = this.handleChangeDataFimEmissao.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleChangeDataInicioEmissao(date) { this.setState({ dataInicioEmissao: date }) }
    handleChangeDataFimEmissao(date) { this.setState({ dataFimEmissao: date }) }
    
    componentDidMount() {
        const isNew = this.props.location.isNew == undefined ? true : this.props.location.isNew;
        const estadoConfiguracao = this.props.location.estadoConfiguracao == undefined ? '' : this.props.location.estadoConfiguracao;

        if (!isNew) {
            this.setState({ idEstado: estadoConfiguracao.idEstado })
            this.setState({ tipoDocumentoFiscal: estadoConfiguracao.tipoDocumentoFiscal })
            this.setState({ inAtivo: estadoConfiguracao.inAtivo })
            this.setState({ inResponsavelTecnico: estadoConfiguracao.inResponsavelTecnico })
            this.setState({ inCSRT: estadoConfiguracao.inCSRT })
            this.setState({ inEPECAutomatico: estadoConfiguracao.inEPECAutomatico })
            this.setState({ quantidadeMinimaRegistros: estadoConfiguracao.quantidadeMinimaRegistros })
            this.setState({ periodo: estadoConfiguracao.periodo })
            this.setState({ periodoEPEC: estadoConfiguracao.periodoEPEC })
        }

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

    onDismiss() {
        this.setState(
            {
                alert: {
                    visible: false
                }
            }
        );
    }

    handleSubmit(event) {
            event.preventDefault();
            const isNew = this.props.location.isNew == undefined ? true : this.props.location.isNew;

            if (isNew) {
                var url = `${config.endpoint['fazemu-nfe']}/estadoConfiguracao/adicionar`;
            } else {
                var url = `${config.endpoint['fazemu-nfe']}/estadoConfiguracao/atualizar`;
            }

            let estadoConfiguracao = new Object();
            estadoConfiguracao.idEstado = this.state.idEstado;
            estadoConfiguracao.tipoDocumentoFiscal = this.state.tipoDocumentoFiscal;
            estadoConfiguracao.inAtivo = this.state.inAtivo;
            estadoConfiguracao.inResponsavelTecnico = this.state.inResponsavelTecnico;
            estadoConfiguracao.inCSRT = this.state.inCSRT;
            estadoConfiguracao.inEPECAutomatico = this.state.inEPECAutomatico;
            estadoConfiguracao.quantidadeMinimaRegistros = this.state.quantidadeMinimaRegistros;
            estadoConfiguracao.periodo = this.state.periodo;
            estadoConfiguracao.periodoEPEC = this.state.periodoEPEC;
            estadoConfiguracao.usuario = getCookie(COOKIE_USER_ID);

            axiosAuth.post(url, estadoConfiguracao, getConfig())
                .then(response => {
                    console.log("response salvar", response.data);
                    this.setState({
                        alert: {
                            visible: true,
                            message: "Dados inseridos com sucesso.",
                            level: "success"
                        }
                    });
                    this.resetForm();
                }).catch(error => {
                    console.log("error salvar", { error })
                    this.setState({
                        alert: {
                            visible: true,
                            message: error.response.data.message,
                            level: "warning"
                        }
                    })
                });
        

    };

    resetForm = () => {
        this.setState({ idEstado: '' });
        this.setState({ tipoDocumentoFiscal: '' });
        this.setState({ inAtivo: '' });
        this.setState({ inResponsavelTecnico: '' });
        this.setState({ inCSRT: '' });
        this.setState({ inEPECAutomatico: '' })
        this.setState({ quantidadeMinimaRegistros: '' })
        this.setState({ periodo: '' })
        this.setState({ periodoEPEC: '' })
        this.setState({ usuario: '' })
    }

    render() {
        return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <div>
                        {this.renderAlert()}
                        <div>
                            <h1>Estado Configuração</h1>
                        </div>
                        {this.renderForm()}
                    </div>
                </div>
            </div>
        );
    }

    renderForm() {
        const isNew = this.props.location.isNew == undefined ? true : this.props.location.isNew;
        const listaEstados = pathOr([], ['listaEstados'], this.state);

        let optionItemsEstado = listaEstados.map((estado, key) =>
            <option key={key} value={estado.id}>{estado.nome}</option>
        );

        return (
            <div className="card mt-1">
                <div className="card-header">
                    <h4>Identificação</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <div className="form">

                                <div className="form-row">
                                    <div>
                                        <div className="form-label">Estado</div>
                                        <select className="form-control" value={this.state.idEstado} onChange={this.handleInputChange}
                                            name="idEstado" disabled={!isNew}>
                                            <option value='' defaultChecked>- Selecionar -</option>
                                            {optionItemsEstado}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-2">
                                        <div className="form-label">Epec Automático?</div>
                                        <select className="form-control" value={this.state.inEPECAutomatico} onChange={this.handleInputChange} name="inEPECAutomatico">
                                            <option value='' defaultChecked>- Selecionar -</option>
                                            <option value='S'>Sim</option>
                                            <option value='N'>Não</option>
                                        </select>

                                    </div>
                                    <div className="col-1">
                                        <div className="form-label">Quantidade Hits</div>
                                        <input className="form-control" type="number" min="0" value={this.state.quantidadeMinimaRegistros} 
                                        onChange={this.handleInputChange} name="quantidadeMinimaRegistros"></input>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-2">
                                        <div className="form-label">Período Avaliação <FormText color="muted">(Em minutos)</FormText></div>
                                        <input className="form-control" type="number" min="0" value={this.state.periodo} onChange={this.handleInputChange} name="periodo"></input>
                                    </div>
                                    <div className="col-1">
                                        <div className="form-label">Período Epec <FormText color="muted">(Em minutos)</FormText></div>
                                        <input className="form-control" type="number" min="0" value={this.state.periodoEPEC} onChange={this.handleInputChange} name="periodoEPEC"></input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="card-footer">
                    <Button color="success" size="sm" type="submit" onClick={this.handleSubmit} disabled={this.state.idEstado == '' || this.state.inEPECAutomatico == '' || this.state.quantidadeMinimaRegistros == '' || this.state.periodo == '' || this.state.periodoEPEC == ''}>Salvar</Button>&nbsp;
                    <Link to="/estadoConfiguracaoInit"><Button color="danger" size="sm">Voltar</Button></Link>
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

export default EstadoConfiguracao