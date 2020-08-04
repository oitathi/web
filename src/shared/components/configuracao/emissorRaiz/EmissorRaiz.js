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
import trataErros  from '../../../helpers/trataErros';


const config = require('config');

class EmissorRaiz extends Component {

    constructor(props) {
        super(props)

        this.state = {
            alert: {
                visible: false,
                message: "FAZEMU-WEB",
                level: "warning"
            },
            id: '',
            nomeEmissorRaiz: '',
            situacao: '',
            usuario: ''
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
        const emissorRaiz = this.props.location.emissorRaiz == undefined ? '' : this.props.location.emissorRaiz;

        if (!isNew) {
            this.setState({ id: emissorRaiz.id })
            this.setState({ nomeEmissorRaiz: emissorRaiz.nomeEmissorRaiz })
            this.setState({ situacao: emissorRaiz.situacao })
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
            var url = `${config.endpoint['fazemu-nfe']}/emissorRaiz/adicionar`;
        } else {
            var url = `${config.endpoint['fazemu-nfe']}/emissorRaiz/atualizar`;
        }

        let emissorRaiz = new Object();
        emissorRaiz.id = this.state.id;
        emissorRaiz.nomeEmissorRaiz = this.state.nomeEmissorRaiz;
        emissorRaiz.situacao = this.state.situacao;
        emissorRaiz.usuario = getCookie(COOKIE_USER_ID);

        axiosAuth.post(url, emissorRaiz, getConfig())
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
        this.setState({ id: '' });
        this.setState({ nomeEmissorRaiz: '' });
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
                            <h1>Emissores</h1>
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
                                    <div className="col-2">
                                        <div className="form-label">Emissor</div>
                                        <input className="form-control" type="number" value={this.state.id} 
                                        disabled={!isNew} name="id"
                                        onChange={this.handleInputChange}></input>
                                    </div>

                                    <div className="col-4">
                                        <div className="form-label">Nome</div>
                                        <input className="form-control" type="text" value={this.state.nomeEmissorRaiz} 
                                        disabled={!isNew} name="nomeEmissorRaiz"
                                        onChange={this.handleInputChange}></input>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-1">
                                        <div className="form-label">Situação</div>
                                        <select className="form-control" value={this.state.situacao} name="situacao" onChange={this.handleInputChange}>
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
                    <Link to="/emissorRaizInit"><Button color="danger" size="sm">Voltar</Button></Link>
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

export default EmissorRaiz