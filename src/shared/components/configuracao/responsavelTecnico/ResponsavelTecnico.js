import React, { Component } from 'react';
import InputMask from 'react-input-mask';
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
import Menu from '../../menu';
import trataErros  from '../../../helpers/trataErros';


const config = require('config');

class ResponsavelTecnico extends Component {

    constructor(props) {
       super(props)

        this.state = {
            listaEmissorRaiz: [],
            alert: {
                visible: false,
                message: "FAZEMU-WEB",
                level: "warning"
            },
            idResponsavelTecnico: null,
            idEmissorRaiz: '',
            cnpj: '',
            contato: '',
            email: '',
            telefone: '',
            situacao: '',
            usuario: ''
        }

        this.onDismiss = this.onDismiss.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.handleChangeIdResponsavelTecnico = this.handleChangeIdResponsavelTecnico.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChangeCnpj = this.handleChangeCnpj.bind(this);
        this.handleChangeContato = this.handleChangeContato.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangeTelefone = this.handleChangeTelefone.bind(this);
        this.handleChangeSituacao = this.handleChangeSituacao.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleChangeIdResponsavelTecnico(event) { this.setState({ idResponsavelTecnico: event.target.value }) }
    handleChangeCnpj(event) { this.setState({ cnpj: event.target.value }) }
    handleChangeContato(event) { this.setState({ contato: event.target.value }) }
    handleChangeEmail(event) { this.setState({ email: event.target.value }) }
    handleChangeTelefone(event) { this.setState({ telefone: event.target.value }) }
    handleChangeSituacao(event) { this.setState({ situacao: event.target.value }) }

    componentDidMount() {
        const isNew = this.props.location.isNew == undefined ? true : this.props.location.isNew;
        const respTecnico = this.props.location.respTecnico == undefined ? '' : this.props.location.respTecnico;

        if (!isNew) {
            this.setState({ idResponsavelTecnico: respTecnico.idResponsavelTecnico })
            this.setState({ idEmissorRaiz: respTecnico.idEmissorRaiz })
            this.setState({ cnpj: respTecnico.cnpj })
            this.setState({ contato: respTecnico.contato })
            this.setState({ email: respTecnico.email })
            this.setState({ telefone: respTecnico.telefone })
            this.setState({ situacao: respTecnico.situacao })
        }

         const urlEmissorRaiz = `${config.endpoint['fazemu-nfe']}/emissorRaiz/?situacao=A`;
         axiosAuth.get(urlEmissorRaiz, getConfig())
            .then(response => {
                console.log(response.data);
                this.setState({
                    listaEmissorRaiz: response.data,
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
            var url = `${config.endpoint['fazemu-nfe']}/responsavelTecnico/adicionar`;
        } else {
            var url = `${config.endpoint['fazemu-nfe']}/responsavelTecnico/atualizar`;
        }

        let respTecnico = new Object();
        respTecnico.idResponsavelTecnico = this.state.idResponsavelTecnico;
        respTecnico.idEmissorRaiz = this.state.idEmissorRaiz;
        respTecnico.cnpj = this.state.cnpj;
        respTecnico.contato = this.state.contato;
        respTecnico.email = this.state.email;
        respTecnico.telefone = this.state.telefone;
        respTecnico.situacao = this.state.situacao;
        respTecnico.usuario = getCookie(COOKIE_USER_ID);

        axiosAuth.post(url, respTecnico, getConfig())
            .then(response => {
                console.log("response salvar", response.data);
                this.setState({
                    alert: {
                        visible: true,
                        message: response.data,
                        level: "success"
                    }
                });
                this.resetForm();
            }).catch(response => {
                console.log("error salvar", { response })
                this.setState({
                    alert: {
                        visible: true,
                        message: trataErros(response.response.data),
                        level: "danger"
                    }
                })
            });

    };


    resetForm = () => {
        this.setState({ idEmissorRaiz: '' });
        this.setState({ cnpj: '' })
        this.setState({ contato: '' })
        this.setState({ email: '' })
        this.setState({ telefone: '' })
        this.setState({ situacao: '' })
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
                            <h1>Responsável Técnico</h1>
                        </div>
                        {this.renderForm()}
                    </div>
                </div>
            </div>
        );
    }

    renderForm() {
        const isNew = this.props.location.isNew == undefined ? true : this.props.location.isNew;
        const listaEmissorRaiz = pathOr([], ['listaEmissorRaiz'], this.state);

        let optionEmissorRaiz = listaEmissorRaiz.map((emissorRaiz, key) =>
        <option key={key} value={emissorRaiz.id}>{emissorRaiz.nomeEmissorRaiz}</option>);

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
                                    <div className="col-2">
                                        <div className="form-label">Emissor</div>
                                        <select className="form-control" name="idEmissorRaiz" value={this.state.idEmissorRaiz} onChange={this.handleInputChange} disabled={!isNew}>
                                            <option value='' defaultChecked>- Selecionar -</option>
                                            {optionEmissorRaiz}
                                        </select>
                                    
                                    </div>
                                    <div className="col-2">
                                        <div className="form-label">CNPJ</div>
                                        <InputMask
                                            mask={'99.999.999/9999-99'}
                                            className="form-control"
                                            value={this.state.cnpj}
                                            onChange={this.handleChangeCnpj}
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col-2">
                                        <div className="form-label">Contato</div>
                                        <input className="form-control" type="text" value={this.state.contato} onChange={this.handleChangeContato}></input>
                                    </div>
                                     <div className="col-2">
                                        <div className="form-label">Telefone</div>
                                        <InputMask
                                            mask={'(99) 9999-99999'}
                                            className="form-control"
                                            value={this.state.telefone}
                                            onChange={this.handleChangeTelefone}
                                        />
                                   </div>
                                   
                                </div>
                                <div className="form-row">
                                    <div className="col-4">
                                        <div className="form-label">E-mail</div>
                                        <input className="form-control" type="text" min="0" value={this.state.email} onChange={this.handleChangeEmail}></input>
                                    </div>
                                   
                                </div>
                                <div className="form-row">
                                    <div className="col-1">
                                        <div className="form-label">Situação</div>
                                        <select className="form-control" value={this.state.situacao} onChange={this.handleChangeSituacao}>
                                            <option value='' defaultChecked>- Selecionar -</option>
                                            <option value='A'>Ativo</option>
                                            <option value='C'>Cancelado</option>
                                        </select>
                                    </div>
                              </div>
                             </div>
                        </div>
                    </form>
                </div>
                <div className="card-footer">
                    <Button color="success" size="sm" type="submit" onClick={this.handleSubmit}>Salvar</Button>&nbsp;
                    <Link to="/responsavelTecnicoInit"><Button color="danger" size="sm">Voltar</Button></Link>
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

export default ResponsavelTecnico