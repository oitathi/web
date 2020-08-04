import React, { Component } from 'react';
import axiosAuth from '../../../helpers/axios-auth';
import { getConfig } from '../../../helpers/axios-config';
import { getCookie } from '../../../helpers/cookie';
import { COOKIE_USER_ID } from '../../../helpers/parameters';
import {
    Alert,
    Button, FormGroup, FormText
} from 'reactstrap';
import { pathOr } from 'ramda';
import { Link } from 'react-router-dom';
import SituacaoCertificadoEnum from '../../../helpers/situacaoCertificadoEnum';
import Menu from '../../menu';
import DatePicker from "react-datepicker";

const config = require('config');

class CertificadoDigital extends Component {

    constructor(props) {
        super(props)

        this.state = {
            listaEmissorRaiz: [],
            fileInput: null,
            alert: {
                visible: false,
                message: "FAZEMU-WEB",
                level: "warning"
            },
            id: '',
            idEmissorRaiz: '',
            nomeEmissorRaiz: '',
            dataVigenciaInicio: null,
            dataVigenciaFim: null,
            dataExpiracaoCertificado: '',
            situacao: '',
            usuario: '',
            senha: ''
        }

        this.onDismiss = this.onDismiss.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChangeDataVigenciaInicio = this.handleChangeDataVigenciaInicio.bind(this);
        this.handleChangeDataVigenciaFim = this.handleChangeDataVigenciaFim.bind(this);
        this.fileChangeHandler = this.fileChangeHandler.bind(this);
        this.handleChangeIdEmissorRaiz = this.handleChangeIdEmissorRaiz.bind(this);
        this.listarEmissoresRaizAtivos = this.listarEmissoresRaizAtivos.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }
    handleChangeDataVigenciaInicio(date) { this.setState({ dataVigenciaInicio: date }) }
    handleChangeDataVigenciaFim(date) { this.setState({ dataVigenciaFim: date }) }
    handleChangeIdEmissorRaiz(event) { this.setState({ idEmissorRaiz: event.target.value }) }


    fileChangeHandler(event) {
        let arquivo = event.target.files[0].name;
        let extensao = arquivo.substring(arquivo.length - 3, arquivo.length);

        if (extensao === 'pfx') {
            this.setState({ fileInput: event.target.files[0] })
        } else {
            this.setState({
                alert: {
                    visible: true,
                    message: "Somente arquivos com extensão PFX são aceitos",
                    level: "warning"
                }
            })
            this.setState({ fileInput: null });
            document.getElementById("fileInput").value = '';
        }
    }

    componentDidMount() {
        const isNew = this.props.location.isNew == undefined ? true : this.props.location.isNew;
        const certificadoDigital = this.props.location.certificadoDigital == undefined ? '' : this.props.location.certificadoDigital;

        if (!isNew) {
            this.setState({ id: certificadoDigital.id });
            this.setState({ idEmissorRaiz: certificadoDigital.idEmissorRaiz });
            this.setState({ nomeEmissorRaiz: certificadoDigital.nomeEmissorRaiz });
            this.setState({ dataVigenciaInicio: new Date(certificadoDigital.dataVigenciaInicio) });
            this.setState({ dataVigenciaFim: new Date(certificadoDigital.dataVigenciaFim) });
            this.setState({ dataExpiracaoCertificado: certificadoDigital.dataExpiracaoCertificado });
            this.setState({ situacao: certificadoDigital.situacao });

            this.state.listaEmissorRaiz.push(certificadoDigital);

        }

        this.listarEmissoresRaizAtivos();

    }

    onDismiss() {
        this.setState({ alert: { visible: false } });
    }

    listarEmissoresRaizAtivos = () => {
        const urlEmissorRaiz = `${config.endpoint['fazemu-nfe']}/emissorRaiz/?situacao=A`;
        axiosAuth.get(urlEmissorRaiz, getConfig())
            .then(response => {
                console.log(response.data);
                this.setState({
                    listaEmissorRaiz: response.data,
                    alert: {
                        visible: false,
                        message: "FAZEMU-WEB",
                        level: "warning"
                    }
                })
            }).catch(error => {
                console.log("error b2wlogin", { error })
                return null;
            });
    }

    handleSubmit(event) {
        event.preventDefault();
        const isNew = this.props.location.isNew == undefined ? true : this.props.location.isNew;
        var configuracao = getConfig();
        var url = '';

        if (isNew) {
            url = `${config.endpoint['fazemu-nfe']}/certificadoDigital/adicionar`;
            configuracao = getConfig(null, 'multipart/form-data');

            var certificadoDigital = new FormData();
            certificadoDigital.append("file", this.state.fileInput);
            certificadoDigital.append("dataVigenciaInicio", this.state.dataVigenciaInicio);
            certificadoDigital.append("idEmissorRaiz", this.state.idEmissorRaiz);
            certificadoDigital.append("usuario", getCookie(COOKIE_USER_ID));
            certificadoDigital.append("senha", this.state.senha);

        } else {
            url = `${config.endpoint['fazemu-nfe']}/certificadoDigital/atualizar`;

            var certificadoDigital = new Object();
            certificadoDigital.id = this.state.id;
            certificadoDigital.idEmissorRaiz = this.state.idEmissorRaiz;
            certificadoDigital.dataVigenciaInicio = this.state.dataVigenciaInicio;
            certificadoDigital.dataVigenciaFim = this.state.dataVigenciaFim;
            certificadoDigital.usuario = getCookie(COOKIE_USER_ID);
            certificadoDigital.senha = this.state.senha;
        }

        axiosAuth.post(url, certificadoDigital, configuracao)
            .then(response => {
                // console.log("response salvar", response.data);
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
        this.setState({ idEmissorRaiz: '' });
        this.setState({ nomeEmissorRaiz: '' });
        this.setState({ dataVigenciaInicio: '' })
        this.setState({ dataVigenciaFim: '' })
        this.setState({ dataExpiracaoCertificado: '' })
        this.setState({ situacao: '' })
        this.setState({ usuario: '' })
        this.setState({ senha: '' })
        this.setState({ fileInput: null })
        document.getElementById("fileInput").value = '';
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
                            <h1>Certificado Digital</h1>
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
            <option key={key} value={emissorRaiz.id}>{emissorRaiz.nomeEmissorRaiz}</option>
        );


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
                                    <div>
                                        <div className="form-label">Nome Emissor Raiz</div>
                                        <select className="form-control" name="idEmissorRaiz" value={this.state.idEmissorRaiz} onChange={this.handleChangeIdEmissorRaiz} disabled={!isNew}>
                                            <option value='' defaultChecked>- Selecionar -</option>
                                            {optionEmissorRaiz}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-2">
                                        <div className="form-label">Data Vigência Início</div>
                                        <DatePicker className="form-control"
                                            selected={this.state.dataVigenciaInicio}
                                            onChange={this.handleChangeDataVigenciaInicio}
                                            placeholderText="Data Vigência Início"
                                            dateFormat="dd/MM/yyyy HH:mm:ss"
                                            showTimeInput
                                            timeFormat="HH:mm:ss"
                                            disabled={!isNew}
                                        />
                                    </div>
                                    <div className="col-2">
                                        <div className="form-label">Data Vigência Fim</div>
                                        <DatePicker className="form-control"
                                            selected={this.state.dataVigenciaFim}
                                            onChange={this.handleChangeDataVigenciaFim}
                                            placeholderText="Data Vigência Fim"
                                            dateFormat="dd/MM/yyyy HH:mm:ss"
                                            showTimeInput
                                            timeFormat="HH:mm:ss"
                                            disabled
                                        />
                                    </div>
                                </div>

                                {!isNew &&
                                    <div>
                                        <div className="form-row">
                                            <div className="col-4">
                                                <div className="form-label">Situação</div>
                                                <input className="form-control" type="text" name="situacao" max="50"
                                                    disabled={true}
                                                    value={SituacaoCertificadoEnum[this.state.situacao]} onChange={this.handleInputChange}></input>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {isNew &&
                                    <div>
                                        <div className="form-row">
                                            <FormGroup>
                                                <div className="form-label">Certificado Digital</div>
                                                <input type="file" ref={this.fileInput} name="file" id="fileInput" onChange={this.fileChangeHandler} />
                                                <FormText color="muted">Somente arquivos com extensão PFX serão aceitos.</FormText>
                                            </FormGroup>
                                        </div>

                                        <div className="form-row">
                                            <div className="col-4">
                                                <div className="form-label">Senha</div>
                                                <input className="form-control" type="text" name="senha"
                                                    value={this.state.senha} onChange={this.handleInputChange}></input>
                                            </div>
                                        </div>
                                    </div>
                                }

                            </div>
                        </div>
                    </form>
                </div>
                <div className="card-footer">
                    <Button color="success" size="sm" type="submit" onClick={this.handleSubmit}
                        disabled={(isNew && (this.state.idEmissorRaiz == '' || this.state.dataVigenciaInicio == null || this.state.fileInput == null || this.state.senha == ''))}>Salvar</Button>&nbsp;
                    <Link to="/certificadoDigitalInit"><Button color="danger" size="sm">Voltar</Button></Link>
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

export default CertificadoDigital