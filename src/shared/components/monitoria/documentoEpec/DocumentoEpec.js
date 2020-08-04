import React, { Component } from 'react';
import axiosAuth from '../../../helpers/axios-auth';
import { getConfig } from '../../../helpers/axios-config';
import {
    Alert,
    Button,
    Table
} from 'reactstrap';
import { pathOr } from 'ramda';
import Pagination from '../../Pagination';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import SituacaoEnum from '../../../helpers/situacaoEnum';
import EstadoEnum from '../../../helpers/estadoEnum';

const config = require('config');

class DocumentoEpec extends Component {
	
	constructor(props){
        super(props);
        this.state = {
            idDocumentoFiscal: '',
            idEstado: '',
            situacao: '',
            dataHoraRegInicio: null,
            dataHoraRegFim: null,
            documentos:[],
            pageOfItems: [],
			alert:{
				visible:false,
				message: "FAZEMU-WEB",
                level: "warning"
			}
        }
        
        this.onDismiss = this.onDismiss.bind(this);
		this.handleChangeIdEstado= this.handleChangeIdEstado.bind(this);
		this.handleChangeSituacao= this.handleChangeSituacao.bind(this);
        this.handleChangeDataHoraRegInicio = this.handleChangeDataHoraRegInicio.bind(this);
        this.handleChangeDataHoraRegFim = this.handleChangeDataHoraRegFim.bind(this);
		this.onChangePage = this.onChangePage.bind(this);
        this.listarDocumentos = this.listarDocumentos.bind(this);
        
	}

	componentDidMount() {
	}

	onChangePage(pageOfItems) {
        this.setState({ pageOfItems: pageOfItems });
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
    handleFormReset(event) {
        event.target.reset();
        this.setState({dataHoraRegInicio: null});
        this.setState({dataHoraRegFim: null});
        this.setState({documentos:[]});
    }
    handleChangeIdEstado(event) { this.setState({ idEstado: event.target.value }) }
	handleChangeSituacao(event) { this.setState({ situacao: event.target.value }) }
    handleChangeDataHoraRegInicio(date) { this.setState({ dataHoraRegInicio: date }) }
    handleChangeDataHoraRegFim(date) { this.setState({ dataHoraRegFim: date }) }

    listarDocumentos = () => {
		this.state.documentos = [];
		let parametros = "";

		if(this.state.idEstado !== ""){
			let idEstadoAux = "&idEstado=" + this.state.idEstado;
			parametros = parametros + idEstadoAux;
		}

		if(this.state.situacao !== ""){
			let situacaoAux = "&situacao=" + this.state.situacao;
			parametros = parametros + situacaoAux;
		}

		 if(this.state.dataHoraRegInicio ? moment(this.state.dataHoraRegInicio).format() : "" !== "") {
            let dataHoraRegInicioAux = "&dataHoraRegInicio=" + (this.state.dataHoraRegInicio ? moment(this.state.dataHoraRegInicio).format() : "");
            parametros = parametros + dataHoraRegInicioAux;
        }
        
        if(this.state.dataHoraRegFim ? moment(this.state.dataHoraRegFim).format() : "" !== "") {
            let dataHoraRegFimAux = "&dataHoraRegFim=" + (this.state.dataHoraRegFim ? moment(this.state.dataHoraRegFim).format() : "");
            parametros = parametros + dataHoraRegFimAux;
		}
		
		const url = `${config.endpoint['fazemu-nfe']}/documentosEpec/?${parametros}`;

		axiosAuth.get(url, getConfig())
            .then(response => {
                console.log(response.data)
                this.setState({
                    documentos: response.data,
                    alert: {
                        visible: false,
                        message: "FAZEMU-WEB",
                        level: "warning"
                    }
                })
                
            }).catch(error => {
                console.log(error);
                this.setState(
                    {
                        alert: {
                            visible: true,
                            message: error.response.data.message,
                            level: "warning"
                        }
                    }
                )
            });
	}

	render() {
       const { documentos } = this.state;

        return (
            <div>
                {this.renderAlert()}
                <div>
                    <h1>Documento Epec</h1>
                </div>
                {this.renderSearchFields()}
                {this.renderRows(documentos)}
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
	
	renderSearchFields() {
         return (
            <form onReset={this.handleFormReset.bind(this)}>
                <div className="card">
                    <div className="card-body">
                        <div className="form-group">
                            <div className="form">
                                <div className="form-row">
                                    <div className="col-2">
                                        <div className="form-label">Estado</div>
                                         <select className="form-control" value={this.state.idEstado} onChange={this.handleChangeIdEstado}>
                                            <option value='' defaultChecked>- Selecionar -</option>
                                            {Object.keys(EstadoEnum).map(key => (
                                                <option key={key} value={key}>
                                                    {EstadoEnum[key]}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <small className="form-text text-muted"></small>

                                    <div className="col-1">
                                        <div>
                                            <div className="form-label">Situação</div>
                                            <select className="form-control" value={this.state.situacao} onChange={this.handleChangeSituacao}>
                                                <option value='' defaultChecked>- Selecionar -</option>
                                                {Object.keys(SituacaoEnum).map(key => (
                                                    <option key={key} value={key}>
                                                        {SituacaoEnum[key]}
                                                    </option>
                                                ))}
                                        </select>
                                        </div>
                                    </div>
                                    <div className="col-0">
                                        <div className="form-label">Data Registro Inicio</div>
                                        <DatePicker className="form-control" selected={this.state.dataHoraRegInicio} onChange={this.handleChangeDataHoraRegInicio} dateFormat="dd/MM/yyyy HH:mm:ss" showTimeInput timeFormat="HH:mm:ss" />
                                    </div>
                                    <div className="col-0">
                                        <div className="form-label">Data Registro Fim</div>
                                        <DatePicker className="form-control" selected={this.state.dataHoraRegFim} onChange={this.handleChangeDataHoraRegFim} dateFormat="dd/MM/yyyy HH:mm:ss" showTimeInput timeFormat="HH:mm:ss" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button color="primary" size="sm" onClick={this.listarDocumentos}>Consultar</Button>&nbsp;
                    </div>
                </div>
            </form>
        )
	}
	
	 renderRows(documentos) {
        if (documentos !== undefined) {
            const pageOfItems = pathOr([], ['pageOfItems'], this.state)
            const rows = [];

            pageOfItems.map((item, key) => {
                rows.push(
                    <tr key={key}>
                        <th className="text-center">{item.idDocumentoFiscal}</th>
                        <td className="text-center">{EstadoEnum[item.idEstado]}</td>
                        <td className="text-center">{SituacaoEnum[item.situacao]}</td>
						<td className="text-center">{item.observacao}</td>
                        <td className="text-center">{item.dataHoraRegInicio}</td>
                        <td className="text-center">{item.dataHora}</td>
                    </tr>
                )
            })

            return (
                <div className="card-header">
                    <Table striped>
                        <thead>
                            <tr>
                                <th className="text-center">#</th>
                                <th className="text-center">Estado</th>
                                <th className="text-center">Situação</th>
                                <th className="text-center">Observação</th>
                                <th className="text-center">Data Registro</th>
                                 <th className="text-center">Data Atualização</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </Table>

                    <div align="right">
                        <Pagination items={this.state.documentos} onChangePage={this.onChangePage} />
                    </div>
                </div>
            );
        }
    }


}export default DocumentoEpec