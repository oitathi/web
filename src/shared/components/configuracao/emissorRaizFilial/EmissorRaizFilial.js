import React, { Component } from 'react';
import axiosAuth from '../../../helpers/axios-auth';
import { getConfig } from '../../../helpers/axios-config';
import { getCookie } from '../../../helpers/cookie';
import { COOKIE_USER_ID } from '../../../helpers/parameters';
import {
    Alert,
    Button,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import SimNaoEnum from '../../../helpers/simNaoEnum';
import Menu from '../../menu';
import trataErros  from '../../../helpers/trataErros';

const config = require('config');
class EmissorRaizFilial extends Component {

	constructor(props) {
		super(props)
		const erf = this.props.location.erf;

		this.state = {
			isNew: erf == undefined ? true : false,
			nome: erf == undefined ? '' : erf.nome,
			filial: erf == undefined ? '' : erf.filial,
			idEmissorRaiz: erf == undefined ? '' : erf.idEmissorRaiz,
            inConsultaDocumento: erf == undefined ? '' : erf.inConsultaDocumento,
            chaveAutenticacao: erf == undefined ? '' : erf.chaveAutenticacao,
			listaEmissorRaiz: [],
			alert: {
                visible: false,
                message: "FAZEMU-WEB",
                level: "warning"
			}
		}

		this.handleChangeNomeEmissorRaizFilial = this.handleChangeNomeEmissorRaizFilial.bind(this);
        this.handleChangeFilial = this.handleChangeFilial.bind(this);
        this.handleChangeChaveAutenticacao = this.handleChangeChaveAutenticacao.bind(this);
        this.handleChangeInConsultaDocumento = this.handleChangeInConsultaDocumento.bind(this);
        this.handleChangeIdEmissorRaiz= this.handleChangeIdEmissorRaiz.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
	}

	 componentDidMount() {
        this.listaEmissorRaiz();
    }
	
	handleChangeNomeEmissorRaizFilial(event){this.setState({ nome : event.target.value })}
    handleChangeFilial(event){this.setState({filial: event.target.value})};
    handleChangeChaveAutenticacao(event){this.setState({chaveAutenticacao: event.target.value})}
    handleChangeInConsultaDocumento(event) {this.setState({ inConsultaDocumento: event.target.value })}
    handleChangeIdEmissorRaiz(event){
        if(this.state.listaEmissorRaiz && this.state.listaEmissorRaiz.length > 0){
            this.setState({ idEmissorRaiz: event.target.value })
        }
	 }

	onDismiss() {
        this.setState({alert: {visible: false}});
    }
    
    render(){
		return(
			<div>
            	<div>
                	<Menu />
                </div>
                <div className="container-fluid px-5">
					<div>
                    	<h1>Emissor Raiz Filial</h1>
                    	{this.renderAlert()}
                    	<div className="card">
				        	<div className="card-body">
					        	<div className="form-group">
						        	<div className="form">				
                                    	{this.renderFields()}
                                	</div>
                            	</div>
                        	</div>
                 		</div>
                	</div>
				</div>
			</div>
        );
	}

	renderAlert() {
        return (
            <Alert color={this.state.alert.level} isOpen={this.state.alert.visible} toggle={this.onDismiss}>
                {this.state.alert.message}
            </Alert>
        )
	}

	renderFields(){
		return (
            <div>
                <div className="form-row">
                    {this.renderInputForNomeEmissorRaizFilial()}
                    {this.renderInputForFilial()}
                    {this.renderInputForChaveAutenticacao()}
                </div>
                 <div className="form-row">
                    {this.renderInputForEmissorRaiz()}
                    {this.renderInputForDocumento()}
                </div>
                {this.renderButtons()}
		    </div>
		)
	}

	renderInputForNomeEmissorRaizFilial(){
        return (
            <div className="col-3">
			    <div className="form-label">Nome Emissor</div>
                <input type="text" className="form-control" placeholder="Nome Emissor" value={this.state.nome} onChange={this.handleChangeNomeEmissorRaizFilial}></input>
		    </div>
        )
	}
	
	renderInputForFilial(){
        return(
            <div className="col-2">
                <div className="form-label">Filial</div>
                <input type="number" readOnly={!this.state.isNew} className="form-control" placeholder="Filial" value={this.state.filial} onChange={this.handleChangeFilial}></input>
            </div>
        )
	}
	
	renderInputForEmissorRaiz(){
         let optionEmissorRaiz = this.state.listaEmissorRaiz.map((emissorRaiz, key) =>
        <option key={key} value={emissorRaiz.id}>{emissorRaiz.nomeEmissorRaiz}</option>);

        return (
            <div className="col-0">
                <div className="form-label">Emissor Raiz</div>
                <select disabled={!this.state.isNew} className="form-control" name="idEmissorRaiz" value={this.state.idEmissorRaiz} onChange={this.handleChangeIdEmissorRaiz}>
                    <option value='' defaultChecked>- Selecionar -</option>
                    {optionEmissorRaiz}
                </select>
            </div>
        )
	}
	
	renderInputForDocumento(){
        let optionDocumento = Object.keys(SimNaoEnum).map(key => (
        <option key={key} value={key}>{SimNaoEnum[key]}</option>));

        return (
            <div className="col-0">
                <div className="form-label">
                    Consulta Documento
                </div>
                <select className="form-control" name="inConsultaDocumento" value={this.state.inConsultaDocumento} onChange={this.handleChangeInConsultaDocumento}>
                    <option value='' defaultChecked>- Selecionar -</option>
                        {optionDocumento}
                </select>
            </div>
        )
    }
    
    renderInputForChaveAutenticacao(){
        return(
            <div className="col-3">
                <div className="form-label">Chave Autenticação</div>
                <input type="text" className="form-control" placeholder="Chave Autenticação" value={this.state.chaveAutenticacao} onChange={this.handleChangeChaveAutenticacao}></input>
            </div>
        )
    }
	
	renderButtons(){
        return (
            <div className="form-row ml-1 mt-3">
                <Button color="info" size="sm" className="mr-2" type="submit" onClick={this.handleSubmit}>Salvar</Button>
                <Link to="/emissorRaizFilialInit">
					<Button color="danger" size="sm">Voltar</Button>
				</Link>
            </div>
        )
	}
	
	listaEmissorRaiz(){
        const urlEmissorRaiz = `${config.endpoint['fazemu-nfe']}/emissorRaiz/?situacao=A`;
        axiosAuth.get(urlEmissorRaiz, getConfig())
         .then(response => {
             console.log(response.data);
              this.setState({
                    listaEmissorRaiz: response.data,
                })
            }).catch(error => {
                console.log("error b2wlogin", { error })
            });
    }
    
    handleSubmit(event) {
        
        let isNew = this.state.isNew;

        if (isNew) {
            var url = `${config.endpoint['fazemu-nfe']}/emissorRaizFilial/adicionar`;
        } else {
            var url = `${config.endpoint['fazemu-nfe']}/emissorRaizFilial/atualizar`;
        }

         console.log("url", url)

        let emissorFilial = this.buildObject();
        axiosAuth.post(url, emissorFilial, getConfig())
            .then(response =>{
                this.setState({
                    alert: {
                        visible: true,
                        message: response.data.retorno,
                        level: response.data.success ? "success" : "danger"
                    }
                })
            }).catch(response => {
                this.setState({
                    alert: {
                        visible: true,
                        message: trataErros(response.response.data),
                        level: "danger"
                    }
                })
            });
    }

	buildObject(){
		let emissorFilial = new Object();

		emissorFilial.nome= this.state.nome;
		emissorFilial.filial = this.state.filial;
		emissorFilial.idEmissorRaiz = this.state.idEmissorRaiz;
        emissorFilial.inConsultaDocumento= this.state.inConsultaDocumento;
        emissorFilial.chaveAutenticacao = this.state.chaveAutenticacao;
        emissorFilial.usuario = getCookie(COOKIE_USER_ID);
        
		return emissorFilial;

	 }

	
	

}export default EmissorRaizFilial