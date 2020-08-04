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
import SituacaoEmissoresEnum from '../../../helpers/situacaoEmissoresEnum';

const config = require('config');

class ListaEmissorRaiz extends Component {

    constructor(props) {
        super(props);

        this.state = {
            semResultado: false,
            nomeEmissor: '',
            situacao: '',
            listaEmissores: undefined,
            pageOfItems: [],
            alert: {
                visible: false,
                message: "FAZEMU-WEB",
                level: "warning"
            }
        }

        this.handleChangeNomeEmissor = this.handleChangeNomeEmissor.bind(this);
        this.handleChangeSituacao = this.handleChangeSituacao.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.listarEmissorRaiz = this.listarEmissorRaiz.bind(this);
    }

    handleChangeNomeEmissor(event) { this.setState({ nomeEmissor: event.target.value }) }
    handleChangeSituacao(event) { this.setState({ situacao: event.target.value }) }

    componentDidMount() {
        this.listarEmissorRaiz();
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

    listarEmissorRaiz = () => {
        let parametros = "";
        if(this.state.nomeEmissor !== ""){
            const nomeAux = "nomeEmissor=" + this.state.nomeEmissor;
            parametros = parametros + nomeAux;
        }
        if(this.state.situacao !== ""){
            const situacaoAux = "&situacao=" + this.state.situacao;
            parametros = parametros + situacaoAux;
        }
        const url = `${config.endpoint['fazemu-nfe']}/emissorRaiz?${parametros}`;
        axiosAuth.get(url, getConfig())
            .then(response => {
                console.log(response.data)
                this.setState({
                    listaEmissores: response.data,
                    semResultado: false,
                    alert: {
                        visible: false,
                    }
                })
                
               }).catch(error => {
                console.log(error);
                this.setState({
                    semResultado: true,
                    pageOfItems: [],
                    alert: {
                        visible: true,
                        message: error.response.data.message,
                        level: "danger"
                    }
                })
            });
    };

    render() {
        return(
            <div>
                <div>
                    {this.renderAlert()}
                    <h1>Emissores</h1>
                    {this.renderSearchFields()}
                </div>
                <div>
                    {this.renderRows()}
                </div>
            </div>
        );
    }

    renderRows(){
        const pageOfItems = pathOr([], ['pageOfItems'], this.state)
        const rows = [];
        
        pageOfItems.map((emra, key) => {
            rows.push(
                <tr key={key}>
                    <th className="text-center">{emra.id}</th>
                    <td className="text-center">{emra.nomeEmissorRaiz}</td>
                    <td className="text-center">{SituacaoEmissoresEnum[emra.situacao]}</td>
                    <td className="text-center">
                        <Link to={{
                            pathname: `/emissorRaiz`,
                            emissorRaiz: emra,
                            isNew: false
                        }}><FontAwesomeIcon icon={faPencilAlt} color="black" title="Editar" /></Link>
                    </td>
                </tr>
            )
        })
        return (
            <div className="card-header" >
                <Table striped>
                    <thead>
                        <tr>
                            <th className="text-center">Emissor</th>
                            <th className="text-center">Nome Emissor</th>
                            <th className="text-center">Situação</th>
                            <th className="text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </Table>
    
                <div align="right" hidden ={this.state.semResultado}>
                    <Pagination items={this.state.listaEmissores} onChangePage={this.onChangePage} />
                </div>
            </div>
        );
    }

    

    renderSearchFields() {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="form-group">
                        <div className="form">
                            <div className="form-row">
                                <div className="col-3">
                                    <div className="form-label">Nome Emissor</div>
                                    <input type="text" className="form-control" placeholder="Nome Emissor" value={this.state.nomeEmissor} onChange={this.handleChangeNomeEmissor}></input>
                                </div>
                                <small className="form-text text-muted"></small>

                                 <div className="col-1">
                                    <div className="form-label">Situação</div>
                                    <select className="form-control" value={this.state.situacao} onChange={this.handleChangeSituacao}>>
                                        <option value=''>Todos</option>
                                        <option value='A'>Ativo</option>
                                        <option value='C'>Cancelado</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button color="primary" size="sm" onClick={this.listarEmissorRaiz}>Consultar</Button>&nbsp;
                    <Link to="/emissorRaiz"><Button color="success" size="sm">Criar</Button></Link>
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

}export default ListaEmissorRaiz