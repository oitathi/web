import React, { Component } from 'react';
import { Button, Alert } from 'reactstrap';
import { Link } from 'react-router-dom';
import axiosAuth from '../../../helpers/axios-auth';
import { getConfig } from '../../../helpers/axios-config';
import Menu from '../../menu';
import trataErros from '../../../helpers/trataErros';
import EstadoManifestacaoEnum from '../../../helpers/estadoManifestacaoEnum';

const config = require('config');
class Manifestar extends Component {

	constructor(props) {
		super(props);

		const df = this.props.location.df;
		console.log(df);
		this.state = {
			documentoFiscal: df,
			tpEvento: '',
			justificativa: '',
			retornos: undefined,
			isManifestada: false,
			alert: {
				visible: false,
				message: "FAZEMU-WEB",
				level: "warning"
			}
		}

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChangeTpEvento = this.handleChangeTpEvento.bind(this);
		this.handleChangeJustificativa = this.handleChangeJustificativa.bind(this);
	}


	handleChangeTpEvento(event) {
		this.setState({
			tpEvento: event.target.value,
			justificativa: ''
		})
	}
	handleChangeJustificativa(event) { this.setState({ justificativa: event.target.value }) }

	handleSubmit(event) {
		event.preventDefault();

		let url = `${config.endpoint['fazemu-nfe']}/manifestacao`;
		let newObj = new Object();
		newObj = this.state.documentoFiscal;
		newObj.tpEvento = this.state.tpEvento;
		newObj.justificativa = this.state.justificativa;


		axiosAuth.post(url, newObj, getConfig())
			.then(response => {
				this.setState({
					isManifestada: response.data.success,
					alert: {
						visible: true,
						message: trataErros(response.data.retorno), //validado por codigo no back
						level: response.data.retorno[0]
					}

				});
				//this.resetForm();
			}).catch(response => {
				console.log("error salvar", { response })
				this.setState({

					alert: {
						visible: true,
						message: trataErros(response.response.data), //validado pelo spring 
						level: "danger"
					}
				})
			});
	}

	resetForm = () => {
		this.setState({ documentoFischal: null });

	}

	renderAlert() {
		return (
			<Alert color={this.state.alert.level} isOpen={this.state.alert.visible} toggle={this.onDismiss}>
				{this.state.alert.message}
			</Alert>
		)
	}


	render() {
		return (
			<div>
				<div>
					<Menu />
				</div>
				<div className="container-fluid px-5">
					<div>
						<div>
							<h1>Manifestação</h1>
						</div>
						{this.renderAlert()}
						{this.renderForm()}
					</div>
				</div>
			</div>
		)
	}

	renderForm() {
		return (
			<div>
				<div className="card mt-1">
					<div className="card-header">
						<h4>Identificação</h4>
					</div>
					<div className="card-body">
						<div className="form-group">
							<div className="form">
								<div className="form-row">

									<div className="col-3">
										<div className="form-label">Estado</div>
										<input className="form-control" type="text" name="estado" max="50"
											disabled={true} readOnly value={EstadoManifestacaoEnum[this.state.documentoFiscal.chaveAcesso.substring(0, 2)]}
											onChange={this.handleInputChange}>
										</input>
									</div>

									<div className="col-1">
										<div className="form-label">Ano</div>
										<input className="form-control" type="text" readOnly value={this.state.documentoFiscal.anoDocumentoFiscal} />
									</div>

									<div className="col-2">
										<div className="form-label">Emissor</div>
										<input className="form-control" type="text" readOnly value={this.state.documentoFiscal.idEmissor} />
									</div>

									<div className="col-1">
										<div className="form-label">Modelo</div>
										<input className="form-control" type="text" readOnly value={this.state.documentoFiscal.chaveAcesso.substring(20, 22)} />
									</div>

									<div className="col-1">
										<div className="form-label">Série</div>
										<input className="form-control" type="text" readOnly value={this.state.documentoFiscal.serieDocumentoFiscal} />
									</div>

									<div className="col-2">
										<div className="form-label">Número</div>
										<input className="form-control" type="text" readOnly value={this.state.documentoFiscal.numeroDocumentoFiscal} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="card mt-1">
					<div className="card-header">
						<h4>Manifestação</h4>
					</div>
					<div className="card-body">
						<div className="form-group">
							<div className="form">
								<div className="form-row">
									<div className="col-0">
										<div className="form-label">Tipo de Evento</div>
										<select className="form-control" type="text" value={this.state.tpEvento} onChange={this.handleChangeTpEvento}>
											<option value="">Selecione</option>
											<option value="210200">Confirmação da Operação</option>
											<option value="210210">Ciência da Operação</option>
											<option value="210220">Desconhecimento da Operação</option>
											<option value="210240">Operação não Realizada</option>
										</select>
									</div>
								</div>
								<div className="form-row mt-2">
									<div className="col">
										<div className="form-label">Justificativa</div>
										<textarea className="form-control" name="text" rows="5" maxLength="1000" placeholder="Justificativa" readOnly={this.state.tpEvento != '210240'} onChange={this.handleChangeJustificativa} />
									</div>
								</div>
							</div>
						</div>
						<div className="form-row">
							<Button className="mr-2" color="info" type="submit" size="sm" onClick={this.handleSubmit} disabled={this.state.isManifestada}>Manifestar</Button>
							<Link to="/manifestacaoInit"><Button color="danger" size="sm">Voltar</Button></Link>
						</div>
					</div>
				</div>
			</div>
		)
	}

} export default Manifestar