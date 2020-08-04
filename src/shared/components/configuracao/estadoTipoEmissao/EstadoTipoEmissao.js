import React, { Component } from 'react';
import axiosAuth from '../../../helpers/axios-auth';
import { getConfig } from '../../../helpers/axios-config';
import { getCookie } from '../../../helpers/cookie';
import { COOKIE_USER_ID } from '../../../helpers/parameters';
import {
    Alert,
    Button
} from 'reactstrap';
import { pathOr } from 'ramda';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Menu from '../../menu';
import DatePicker from "react-datepicker";

const config = require('config');

class EstadoTipoEmissao extends Component {

    constructor(props) {
        super(props)

        this.acessKey = React.createRef();
        this.state = {
            listaEstados: [],
            listaTipoEmissao: [],
            alert: {
                visible: false,
                message: "FAZEMU-WEB",
                level: "warning"
            },
            idEstado: '',
            dataInicioEmissao: '',
            dataFimEmissao: '',
            tipoEmissao: '',
            justificativa: '',
            usuario: ''
        }

        this.onDismiss = this.onDismiss.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.handleChangeIdEstado = this.handleChangeIdEstado.bind(this);
        this.handleChangeDataInicioEmissao = this.handleChangeDataInicioEmissao.bind(this);
        this.handleChangeDataFimEmissao = this.handleChangeDataFimEmissao.bind(this);
        this.handleChangeTipoEmissao = this.handleChangeTipoEmissao.bind(this);
        this.handleChangeJustificativa = this.handleChangeJustificativa.bind(this);
        this.validaDataFim = this.validaDataFim.bind(this);
    }

    handleChangeIdEstado(event) { 
        this.setState({ idEstado: event.target.value }) 
        this.listaTipoEmissaoPorEstado(event.target.value);
    }

    handleChangeDataInicioEmissao(date) { this.setState({ dataInicioEmissao: date }) }

    handleChangeDataFimEmissao(date) { 
        const dataAtual = new Date();
        if(dataAtual <= date){
            this.setState({ dataFimEmissao: date }) 
        }else{
           this.setState({ 
                alert: {
                    visible: true,
                    message: "Data fim, incluindo o horário,  não pode ser anterior a data de hoje  ",
                    level: "danger"
                }
            })  
        }
    }

    handleChangeTipoEmissao(event) { this.setState({ tipoEmissao: event.target.value }) }
    handleChangeJustificativa(event) { this.setState({ justificativa: event.target.value }) }

    componentDidMount() {
        const isNew = this.props.location.isNew == undefined ? true : this.props.location.isNew;
        const estadoTipoEmissao = this.props.location.estadoTipoEmissao == undefined ? '' : this.props.location.estadoTipoEmissao;

        if (!isNew) {
            this.setState({ idEstado: estadoTipoEmissao.idEstado })
            this.setState({ dataInicioEmissao: new Date(estadoTipoEmissao.dataInicio) })
            this.setState({ dataFimEmissao: new Date(estadoTipoEmissao.dataFim) })
            this.setState({ tipoEmissao: estadoTipoEmissao.tipoEmissao })
            this.setState({ justificativa: estadoTipoEmissao.justificativa })
        }

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

    onDismiss() {
        this.setState(
            {
                alert: {
                    visible: false
                }
            }
        );
    }

    listaTipoEmissaoPorEstado(id){
        let parametros = "idEstado=" + id;
        const urlTipoEmissao = `${config.endpoint['fazemu-nfe']}/tipoEmissao/estado?${parametros}`;
        if(id != ''){
            axiosAuth.get(urlTipoEmissao, getConfig())
                .then(response => {
                    console.log(response.data);
                    this.setState({
                        listaTipoEmissao: response.data,
                    })
                }).catch(error => {
                    console.log("erro:", error);
                    this.setState({
                        idEstado: '',
                        alert: {
                            visible: true,
                            message: "Erro ao buscar tipo de emissão",
                            level: "danger"
                        }
                    })
                })
        }
    }

    handleSubmit(event) {
        if (this.state.justificativa.length < 15) {
            this.setState(
                {
                    alert: {
                        visible: true,
                        message: "Campo Justificativa deve conter no mínimo 15 caracteres",
                        level: "warning"
                    }
                }
            )
        } else {
            event.preventDefault();
            const isNew = this.props.location.isNew == undefined ? true : this.props.location.isNew;

            if (isNew) {
                var url = `${config.endpoint['fazemu-nfe']}/estadoTipoEmissao/adicionar`;
            } else {
                var url = `${config.endpoint['fazemu-nfe']}/estadoTipoEmissao/atualizar`;
            }

            let estadoTipoEmissao = new Object();
            estadoTipoEmissao.idEstado = this.state.idEstado;
            estadoTipoEmissao.dataInicioEmissao = moment(this.state.dataInicioEmissao).format(); 
            estadoTipoEmissao.dataFimEmissao = moment(this.state.dataFimEmissao).format();
            estadoTipoEmissao.tipoEmissao = this.state.tipoEmissao;
            estadoTipoEmissao.justificativa = this.state.justificativa;
            estadoTipoEmissao.usuario = getCookie(COOKIE_USER_ID);

            axiosAuth.post(url, estadoTipoEmissao, getConfig())
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
        }

    };

    resetForm = () => {
        this.setState({ idEstado: '' });
        this.setState({ dataInicioEmissao: '' })
        this.setState({ dataFimEmissao: '' })
        this.setState({ tipoEmissao: '' })
        this.setState({ justificativa: '' })
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
                            <h1>Estado Tipo Emissão</h1>
                        </div>
                        {this.renderForm()}
                    </div>
                </div>
            </div>
        );
    }

    validaDataFim(){
        const isNew = this.props.location.isNew == undefined ? true : this.props.location.isNew;        
        const dataAtual = new Date();

         if( isNew){
            return false;
        }else{
            if(dataAtual > this.state.dataFimEmissao){
               return true;
            }
        }
        return false;
    }

    renderForm() {
        const isNew = this.props.location.isNew == undefined ? true : this.props.location.isNew;
        const dataAtual = new Date();

        const listaEstados = pathOr([], ['listaEstados'], this.state);
        const listaTipoEmissao = pathOr([], ['listaTipoEmissao'], this.state);

        let optionItemsEstado = listaEstados.map((estado, key) =>
            <option key={key} value={estado.id}>{estado.nome}</option>
        );
        let optionItemsTipoEmissao = listaTipoEmissao.map((tipoEmissao, key) =>
            <option key={key} value={tipoEmissao.id}>{tipoEmissao.nome}</option>
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
                                        <select className="form-control" value={this.state.idEstado} onChange={this.handleChangeIdEstado} disabled={!isNew}>
                                            <option value='' defaultChecked>- Selecionar -</option>
                                            {optionItemsEstado}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-2">
                                        <div className="form-label">Data Início</div>
                                        <DatePicker className="form-control" 
                                        selected={this.state.dataInicioEmissao}
                                        onChange={this.handleChangeDataInicioEmissao} 
                                        dateFormat="dd/MM/yyyy HH:mm:ss" 
                                        showTimeInput timeFormat="HH:mm:ss"
                                        minDate={dataAtual} 
                                        disabled={!isNew}/>
                                    </div>
                                    <div className="col-2">
                                        <div className="form-label">Data Fim</div>
                                        <DatePicker className="form-control" 
                                        selected={this.state.dataFimEmissao} 
                                        onChange={this.handleChangeDataFimEmissao} 
                                        dateFormat="dd/MM/yyyy HH:mm:ss" 
                                        showTimeInput timeFormat="HH:mm:ss" 
                                        minDate={dataAtual} 
                                        disabled={this.validaDataFim()}/>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col-2">
                                        <div className="form-label">Tipo Emissão</div>
                                        <select className="form-control" value={this.state.tipoEmissao} onChange={this.handleChangeTipoEmissao} disabled={!isNew || this.state.idEstado == ''}>
                                            <option value='' defaultChecked>- Selecionar -</option>
                                            {optionItemsTipoEmissao}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col">
                                        <div className="form-label">Justificativa</div>
                                        <textarea className="form-control" type="text" rows="5" maxLength="1000" value={this.state.justificativa} onChange={this.handleChangeJustificativa} disabled={!isNew} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="card-footer">
                    <Button color="success" size="sm" type="submit" onClick={this.handleSubmit} disabled={this.state.idEstado == '' || this.state.dataInicioEmissao == '' || this.state.dataFimEmissao == '' || this.state.tipoEmissao == '' || this.state.justificativa == ''}>Salvar</Button>&nbsp;
                    <Link to="/estadoTipoEmissaoInit"><Button color="danger" size="sm">Voltar</Button></Link>
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

export default EstadoTipoEmissao