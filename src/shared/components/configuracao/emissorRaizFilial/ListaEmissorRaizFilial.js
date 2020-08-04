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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import SimNaoEnum from '../../../helpers/simNaoEnum';

const config = require('config');
class ListaEmissorRaizFilial extends Component {

	constructor(props) {
		super(props);

		this.state = {
            inConsultaDocumento: '',
            nomeEmissor: '',
            filial: '',
            idEmissorRaiz: '',
            listaEmissorRaiz: [],
            listaEmissorRaizFilial: [],
			pageOfItems: [],
            alert: {
                visible: false,
                message: "FAZEMU-WEB",
                level: "warning"
            }
		}
        this.handleChangeNomeEmissor = this.handleChangeNomeEmissor.bind(this);
        this.handleChangeFilial = this.handleChangeFilial.bind(this);
        this.handleChangeInConsultaDocumento = this.handleChangeInConsultaDocumento.bind(this);
        this.handleChangeIdEmissorRaiz= this.handleChangeIdEmissorRaiz.bind(this);
        this.listaEmissorRaizFilial = this.listaEmissorRaizFilial.bind(this);
        this.listaEmissorRaiz = this.listaEmissorRaiz.bind(this);
        this.onChangePage= this.onChangePage.bind(this);
    }

    componentDidMount() {
        this.listaEmissorRaiz();
    }
    
    handleChangeNomeEmissor(event){this.setState({ nomeEmissor: event.target.value })}
    handleChangeFilial(event){this.setState({filial: event.target.value})}
    handleChangeInConsultaDocumento(event) {this.setState({ inConsultaDocumento: event.target.value })}
    handleChangeIdEmissorRaiz(event){
        if(this.state.listaEmissorRaiz && this.state.listaEmissorRaiz.length > 0){
            this.setState({ idEmissorRaiz: event.target.value })
        }
     }
    onChangePage(pageOfItems) {this.setState({ pageOfItems: pageOfItems })}
    onDismiss() {this.setState({alert: {visible: false}})}
    
	render(){
		return(
            <div>
                <div>
                    <h1>Consulta Emissor Raiz Filial</h1>
                    {this.renderAlert()}
                    <div className="card">
				        <div className="card-body">
					        <div className="form-group">
						        <div className="form">				
                                    {this.renderSearchFields()}
                                </div>
                                {this.renderRows()}
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

	renderSearchFields() {
		return (
            <div>
                <div className="form-row">
                    {this.renderSearchForNome()}
                    {this.renderSearchForFilial()}
                    {this.renderSearchForEmissorRaiz()}
                    {this.renderSearchForDocumento()}
                </div>
                {this.renderSearchButtons()}
		    </div>
		);
    }

    renderSearchForNome(){
        return (
            <div className="col-3">
			    <div className="form-label">Nome Emissor</div>
                <input type="text" className="form-control" placeholder="Nome Emissor" value={this.state.nomeEmissor} onChange={this.handleChangeNomeEmissor}></input>
		    </div>
        )
    }

    renderSearchForFilial(){
        return(
            <div className="col-2">
                <div className="form-label">Filial</div>
                <input type="text" className="form-control" placeholder="Filial" value={this.state.filial} onChange={this.handleChangeFilial}></input>
            </div>
        )
    }

    renderSearchForEmissorRaiz(){
         let optionEmissorRaiz = this.state.listaEmissorRaiz.map((emissorRaiz, key) =>
        <option key={key} value={emissorRaiz.id}>{emissorRaiz.nomeEmissorRaiz}</option>);

        return (
            <div className="col-0">
                <div className="form-label">Emissor Raiz</div>
                <select className="form-control" name="idEmissorRaiz" value={this.state.idEmissorRaiz} onChange={this.handleChangeIdEmissorRaiz}>
                    <option value='' defaultChecked>- Selecionar -</option>
                    {optionEmissorRaiz}
                </select>
            </div>
        )
    }

    renderSearchForDocumento(){
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

    renderSearchButtons(){
        return (
            <div className="form-row ml-1 mt-3">
                <Button color="primary" size="sm" className="mr-2" onClick={this.listaEmissorRaizFilial}>Consultar</Button>
                <Link to="/emissorRaizFilial">
                    <Button color="success" size="sm">Criar</Button>
                </Link>
            </div>
        )
    }
    
    renderRows(){
        const pageOfItems = pathOr([], ['pageOfItems'], this.state)
        const rows = []

        pageOfItems.map((erf, key) => {
                rows.push(
                    <tr key={key}>
                        <th className="text-center">{erf.nome}</th>
                        <th className="text-center">{erf.nomeEmissorRaiz}</th>
                        <td className="text-center">{erf.filial}</td>
                        <td className="text-center">{SimNaoEnum[erf.inConsultaDocumento]}</td>
                        <td className="text-center">
                            <Link to={{pathname: `/emissorRaizFilial`,erf: erf}}>
                                <FontAwesomeIcon icon={faPencilAlt} color="black" title="Editar" />
                            </Link>
                        </td>
                    </tr>
                )
        })
        return(
            <div className="mt-3">
                <Table striped>
                    <thead>
                        <tr>
                            <th className="text-center">Emissor Raiz Filial</th>
                            <th className="text-center">Emissor Raiz</th>
                            <th className="text-center">Filial</th>
                            <th className="text-center">Consulta Documento</th>
                            <th className="text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </Table>
                <div align="right">
                    <Pagination items={this.state.listaEmissorRaizFilial} onChangePage={this.onChangePage} />
                </div>
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

    listaEmissorRaizFilial(){
        let parametros = "";

        if(this.state.nomeEmissor !== ''){
            let nomeEmissor = "nome=" + this.state.nomeEmissor;
            parametros = parametros + nomeEmissor;
        }
        if(this.state.filial !== ''){
            let filial = "&idFilial=" + this.state.filial;
            parametros = parametros + filial;
        }
        if(this.state.idEmissorRaiz !== ''){
            let idEmissorRaiz = "&idEmissorRaiz=" + this.state.idEmissorRaiz;
            parametros = parametros + idEmissorRaiz;
        }
        if(this.state.inConsultaDocumento !== ''){
            let documentos = "&inConsultaDocumento=" + this.state.inConsultaDocumento;
            parametros = parametros + documentos;
        }
       let urlEmissorRaizFilial = `${config.endpoint['fazemu-nfe']}/emissorRaizFilial?${parametros}`;
        axiosAuth.get(urlEmissorRaizFilial, getConfig())
            .then(response => {
                this.setState({
                    listaEmissorRaizFilial: response.data,
                    alert: {
                        visible: response.data.length >0 ? false : true,
                        message: "Nenhum dado encontrado",
                        level: "success"
                    }               
                })
            }).catch(error => {
                console.log("erro:");
                console.log(error);
                this.setState({
                    alert: {
                        visible: true,
                        message: error.data,
                        level: "warning"
                    }
                })
            });
    
    }
    
}export default ListaEmissorRaizFilial