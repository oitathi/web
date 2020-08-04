import React, { Component } from 'react';
import axiosAuth from '../../../helpers/axios-auth';
import { getConfig } from '../../../helpers/axios-config';
import { getCookie } from '../../../helpers/cookie';
import { COOKIE_USER_ID } from '../../../helpers/parameters';
import {
    Alert,
    Button
} from 'reactstrap';
import { Link } from 'react-router-dom';
import Menu from '../../menu';

const config = require('config');

class Impressora extends Component {

    constructor(props) {
        super(props)

        this.state = {
            alert: {
                visible: false,
                message: "FAZEMU-WEB",
                level: "warning"
            },
            id: null,
            nome: '',
            local: '',
            ip: '',
            porta: '',
            marca: '',
            modelo: '',
            situacao: '',
            usuario: ''
        }

        this.onDismiss = this.onDismiss.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.handleChangeId = this.handleChangeId.bind(this);
        this.handleChangeNome = this.handleChangeNome.bind(this);
        this.handleChangeLocal = this.handleChangeLocal.bind(this);
        this.handleChangeIp = this.handleChangeIp.bind(this);
        this.handleChangePorta = this.handleChangePorta.bind(this);
        this.handleChangeMarca = this.handleChangeMarca.bind(this);
        this.handleChangeModelo = this.handleChangeModelo.bind(this);
        this.handleChangeSituacao = this.handleChangeSituacao.bind(this);
    }

    handleChangeId(event) { this.setState({ id: event.target.value }) }
    handleChangeNome(event) { this.setState({ nome: event.target.value }) }
    handleChangeLocal(event) { this.setState({ local: event.target.value }) }
    handleChangeIp(event) { this.setState({ ip: event.target.value }) }
    handleChangePorta(event) { this.setState({ porta: event.target.value }) }
    handleChangeMarca(event) { this.setState({ marca: event.target.value }) }
    handleChangeModelo(event) { this.setState({ modelo: event.target.value }) }
    handleChangeSituacao(event) { this.setState({ situacao: event.target.value }) }

    componentDidMount() {
        const isNew = this.props.location.isNew == undefined ? true : this.props.location.isNew;
        const impressora = this.props.location.impressora == undefined ? '' : this.props.location.impressora;

        if (!isNew) {
            this.setState({ id: impressora.id })
            this.setState({ nome: impressora.nome })
            this.setState({ local: impressora.local })
            this.setState({ ip: impressora.ip })
            this.setState({ porta: impressora.porta })
            this.setState({ marca: impressora.marca })
            this.setState({ modelo: impressora.modelo })
            this.setState({ situacao: impressora.situacao })
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
            var url = `${config.endpoint['fazemu-nfe']}/impressora/adicionar`;
        } else {
            var url = `${config.endpoint['fazemu-nfe']}/impressora/atualizar`;
        }

        let impressora = new Object();
        impressora.id = this.state.id;
        impressora.nome = this.state.nome;
        impressora.local = this.state.local;
        impressora.ip = this.state.ip;
        impressora.porta = this.state.porta;
        impressora.marca = this.state.marca;
        impressora.modelo = this.state.modelo;
        impressora.situacao = this.state.situacao;
        impressora.usuario = getCookie(COOKIE_USER_ID);

        axiosAuth.post(url, impressora, getConfig())
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
        this.setState({ nome: '' });
        this.setState({ local: '' })
        this.setState({ ip: '' })
        this.setState({ porta: '' })
        this.setState({ marca: '' })
        this.setState({ modelo: '' })
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
                            <h1>Impressora</h1>
                        </div>
                        {this.renderForm()}
                    </div>
                </div>
            </div>
        );
    }

    renderForm() {
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
                                        <div className="form-label">Nome</div>
                                        <input className="form-control" type="text" value={this.state.nome} onChange={this.handleChangeNome}></input>
                                    </div>
                                    <div className="col-2">
                                        <div className="form-label">Local</div>
                                        <input className="form-control" type="text" value={this.state.local} onChange={this.handleChangeLocal}></input>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col-2">
                                        <div className="form-label">IP</div>
                                        <input className="form-control" type="text" value={this.state.ip} onChange={this.handleChangeIp}></input>
                                    </div>
                                    <div className="col-1">
                                        <div className="form-label">Porta</div>
                                        <input className="form-control" type="number" min="0" value={this.state.porta} onChange={this.handleChangePorta}></input>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col-2">
                                        <div className="form-label">Marca</div>
                                        <input className="form-control" type="text" value={this.state.marca} onChange={this.handleChangeMarca}></input>
                                    </div>
                                    <div className="col-2">
                                        <div className="form-label">Modelo</div>
                                        <input className="form-control" type="text" value={this.state.modelo} onChange={this.handleChangeModelo}></input>
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
                    <Button color="success" size="sm" type="submit" onClick={this.handleSubmit} disabled={this.state.nome == '' || this.state.local == '' || this.state.ip == '' || this.state.porta == '' || this.state.marca == '' || this.state.modelo == '' || this.state.situacao == ''}>Salvar</Button>&nbsp;
                    <Link to="/impressoras"><Button color="danger" size="sm">Voltar</Button></Link>
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

export default Impressora