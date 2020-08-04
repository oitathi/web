import React, { Component } from 'react';
import {Button, Alert, FormGroup, FormText} from 'reactstrap';
import axiosAuth from '../../../helpers/axios-auth';
import Menu from '../../menu';
import trataErros  from '../../../helpers/trataErros';
import { getConfig } from '../../../helpers/axios-config';
import { getCookie } from '../../../helpers/cookie';
import { COOKIE_USER_ID } from '../../../helpers/parameters';
import Loading from '../../../helpers/loading';
import { Link } from 'react-router-dom';



const config = require('config');
class ManifestacaoMassiva extends Component{

	constructor(props){
		super(props);
		this.state = {
			fileInput: null,
			tpEvento: '',
			justificativa: '',
			loading: false,
			listaResults:[],
			alert: {
                visible: false,
                message: "FAZEMU-WEB",
                level: "warning"
            }
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.fileChangeHandler = this.fileChangeHandler.bind(this);
		this.handleChangeTpEvento = this.handleChangeTpEvento.bind(this);
		this.handleChangeJustificativa = this.handleChangeJustificativa.bind(this);
	}

	handleChangeTpEvento(event) {this.setState({ tpEvento: event.target.value} ) }
	handleChangeJustificativa(event) { this.setState({ justificativa: event.target.value }) }

	render(){
		return (
			 <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <div>
                        <div>
                            <h1>Manifestação Massiva</h1>
                        </div>
						{this.renderAlert()}
						{this.renderForm()}
						{this.state.loading && <Loading />}
                    </div>
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

	renderForm() {
		return (
			<div>
				<div className="card mt-1">
					<div className="card-header">
						<h4>Upload</h4>
					</div>
					<div className="card-body">
						<form onSubmit={this.handleSubmit}>
							<div className="form-group">
								<div className="form">
									{this.renderFileUpload()}
									{this.renderTpEvento()}
									{this.renderJustificativa()}
								</div>
							</div>
						</form>
					</div>
					{this.renderSubmit()}
				</div>
				{this.renderResultados()}
			</div>
		)
	}

	renderFileUpload(){
		return (
			<div className="form-row">
				<FormGroup>
					<div className="form-label">Arquivo</div>
					<input type="file" ref={this.fileInput} name="file" id="fileInput" onChange={this.fileChangeHandler} />
					<FormText color="muted">Somente arquivos com extensão TXT serão aceitos.</FormText>
					<FormText color="muted">O arquivo deve conter apenas 1 chave de acesso por linha.</FormText>
				</FormGroup>
			</div>
		)
	}

	renderTpEvento(){
		return(
			<div className="form-row">
				<div className="col-0">
					<div className="form-label">Tipo de Evento</div>
					<select className="form-control" type="text"  value={this.state.tpEvento} onChange={this.handleChangeTpEvento}>
						<option value="">Selecione</option>
						<option value="210200">Confirmação da Operação</option>
						<option value="210210">Ciência da Emissão</option>
						<option value="210220">Desconhecimento da Operação</option>
						<option value="210240"> Operação não Realizada</option>
					</select>
				</div>
			</div>
		)
	}

	renderJustificativa(){
		if (this.state.tpEvento === '210240') {
			return (
				<div className="form-row mt-2">
					<div className="col">
						<div className="form-label">Justificativa</div>
						<textarea className="form-control" name="text" rows="5" maxLength="1000" placeholder="Justificativa" onChange={this.handleChangeJustificativa} />
					</div>
				</div>
			)
		}
	}

	renderSubmit(){
		return(
			 <div className="form-row mb-3 ml-3">
				<Button className="mr-2" color="info" size="sm" type="submit" onClick={this.handleSubmit} target="_blank">Manifestar</Button>
				<Link to="/manifestacaoInit">
					<Button color="danger" size="sm" className='mr-1'>Voltar</Button>
				</Link>
			</div>
		)
	}

	renderResultados(){
		if(this.state.listaResults.length > 0){
			return (
				<div className="card mt-3">
					<div className="card-header">
						<h4>Resultado</h4>
					</div>
					<div className="card-body mt-2">
						{this.renderCards()}
					</div>
				</div>
			)
		}
	}

	renderCards(){
		const listItems = this.state.listaResults.map((d) => 
			<div>
				{this.renderSuccessCard(d)}
				{this.renderDangerCard(d)}
			</div>
		);
		if (this.state.listaResults.length  > 0) {
			return (
				<div>
					{listItems }
				</div>
			);
		}
	}

	renderSuccessCard(d){
		if(d.success == true){
			return (
				<div className="border border-secondary rounded mb-3">
					<div className="bg-success text-white">
						<h5 className="ml-2">{d.chaveAcesso}</h5>
					</div>
					{this.renderBodyCard(d)}
				</div>
			)
		}
	} 

	renderDangerCard(d){
		if(d.success == false){
			return (
				<div className="border border-secondary rounded mb-3">
					<div className="bg-danger text-white">
						<h5 className="ml-2">{d.chaveAcesso}</h5>
					</div>
					{this.renderBodyCard(d)}
				</div>
			)
		}
	}

	renderBodyCard(d){
		const body = d.retorno.map((r) =>
			<li key={r}>{r}</li>
		);

		return (
			<div className="ml-2 bg-light">
				{body}
			</div>
				
		)
	}

	fileChangeHandler(event) {
		let arquivo = event.target.files[0].name;
		let extensao = arquivo.substring(arquivo.length-3, arquivo.length);

		 if (extensao === 'txt') {
			 this.setState({ fileInput: event.target.files[0] })
		 }else{
			  	this.setState({ alert: {
                	visible: true,
                	message: "Somente arquivos com extensão TXT são aceitos",
                	level: "warning"
				}})
				this.setState({ fileInput: null });
				document.getElementById("fileInput").value = '';
			}
	}
	
	handleSubmit(event) {
		event.preventDefault();
		var configuracao = getConfig(null, 'multipart/form-data');
		var parametros = "&usuario=" + getCookie(COOKIE_USER_ID);

		 if (this.state.tpEvento !== "") {
			 parametros = "&tpEvento=" + this.state.tpEvento;
		 }

		 if (this.state.justificativa !== ""){
			parametros = parametros + "&justificativa=" +  this.state.justificativa;
		 }
		
		var url = `${config.endpoint['fazemu-nfe']}/manifestacao/massivo/?${parametros}`;
		
		var form = new FormData();
        form.append("file", this.state.fileInput);
		form.append("usuario", getCookie(COOKIE_USER_ID));
		
		this.setState({loading: true})
		axiosAuth.post(url, form,configuracao)
		.then(response => {
			this.setState({listaResults: response.data})
		}).catch(response => {
            console.log("error salvar", { response })
            this.setState({
				alert: {
                    	visible: true,
                        message: trataErros(response.retorno), //validado pelo spring 
                        level: "danger"
                }
            })
		}).then(()=> {
                this.setState({loading: false})
        });
	}

	




}export default ManifestacaoMassiva