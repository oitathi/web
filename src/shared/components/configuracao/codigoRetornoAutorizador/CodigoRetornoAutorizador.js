import React, { Component } from 'react';
import axiosAuth from '../../../helpers/axios-auth';
import { getConfig } from '../../../helpers/axios-config';
import { getCookie } from '../../../helpers/cookie';
import { COOKIE_USER_ID } from '../../../helpers/parameters';
import {
    Alert,
    Button, FormGroup, Label, Input
} from 'reactstrap';
import { Link } from 'react-router-dom';
import Menu from '../../menu';

const config = require('config');

class CodigoRetornoAutorizador extends Component {

    constructor(props) {
        super(props)

        this.acessKey = React.createRef();
        this.state = {
            alert: {
                visible: false,
                message: "FAZEMU-WEB",
                level: "warning"
            },
            id: '',
            tipoDocumento: '',
            descricao: '',
            situacaoAutorizador: ''
        }

        this.onDismiss = this.onDismiss.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    componentDidMount() {
        const isNew = this.props.location.isNew == undefined ? true : this.props.location.isNew;
        const codigoRetornoAutorizador = this.props.location.codigoRetornoAutorizador == undefined ? '' : this.props.location.codigoRetornoAutorizador;

        if (!isNew) {
            this.setState({ id: codigoRetornoAutorizador.id })
            this.setState({ tipoDocumentoFiscal: codigoRetornoAutorizador.tipoDocumentoFiscal })
            this.setState({ descricao: codigoRetornoAutorizador.descricao })
            this.setState({ situacaoAutorizador: codigoRetornoAutorizador.situacaoAutorizador })
        }

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
            var url = `${config.endpoint['fazemu-nfe']}/codigoRetornoAutorizador/adicionar`;
        } else {
            var url = `${config.endpoint['fazemu-nfe']}/codigoRetornoAutorizador/atualizar`;
        }

        let codigoRetornoAutorizador = new Object();
        codigoRetornoAutorizador.id = this.state.id;
        codigoRetornoAutorizador.tipoDocumentoFiscal = this.state.tipoDocumentoFiscal;
        codigoRetornoAutorizador.descricao = this.state.descricao;
        codigoRetornoAutorizador.situacaoAutorizador = this.state.situacaoAutorizador;
        codigoRetornoAutorizador.usuario = getCookie(COOKIE_USER_ID);

        axiosAuth.post(url, codigoRetornoAutorizador, getConfig())
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
        this.setState({ id: '' });
        this.setState({ tipoDocumentoFiscal: '' })
        this.setState({ descricao: '' })
        this.setState({ situacaoAutorizador: '' })
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
                            <h1>Código Retorno Autorizador</h1>
                        </div>
                        {this.renderForm()}
                    </div>
                </div>
            </div>
        );
    }

    renderForm() {
        const isNew = this.props.location.isNew == undefined ? true : this.props.location.isNew;

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
                                    <div className="col-4">
                                        <div className="form-label">ID</div>
                                        <input className="form-control" type="text" name="id" max="50"
                                            disabled={true}
                                            value={this.state.id} onChange={this.handleInputChange}></input>
                                    </div>
                                </div>

                                <div>
                                    <FormGroup>
                                        <Label for="exampleText">Descrição</Label>
                                        <Input type="textarea" name="descricao" disabled={true} maxLength="4000" value={this.state.descricao} onChange={this.handleInputChange} />
                                    </FormGroup>
                                </div>

                                <div className="form-row">
                                    <div>
                                        <div className="form-label">Situação Autorizador</div>
                                        <select className="form-control" name="tipo" value={this.state.situacaoAutorizador} onChange={this.handleInputChange} disabled={true}>
                                            <option value='' defaultChecked>- Selecionar -</option>
                                            <option value='AF'>Autorizado Finalizado</option>
                                            <option value='EP'>Em Processo</option>
                                            <option value='RF'>Rejeitado Finalizado</option>
                                            <option value='RT'>Rejeitado Tratamento</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="card-footer">
                    {/* <Button color="success" size="sm" type="submit" onClick={this.handleSubmit} disabled={this.state.id == '' || this.state.descricao == '' || this.state.situacaoAutorizador == ''}>Salvar</Button>&nbsp; */}
                    <Link to="/codigoRetornoAutorizadorInit"><Button color="danger" size="sm">Voltar</Button></Link>
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

export default CodigoRetornoAutorizador