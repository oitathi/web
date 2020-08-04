import React, { Component } from 'react';
import axiosAuth from '../../../helpers/axios-auth';
import { getConfig } from '../../../helpers/axios-config';
import { getCookie } from '../../../helpers/cookie';
import { COOKIE_USER_ID } from '../../../helpers/parameters';
import {
    Alert,
    Button, FormText
} from 'reactstrap';
import { pathOr } from 'ramda';
import { Link } from 'react-router-dom';
import Menu from '../../menu';

const config = require('config');

class MunicipioConfiguracao extends Component {

    constructor(props) {
        super(props)

        this.acessKey = React.createRef();
        this.state = {
            listaMunicipios: [],
            alert: {
                visible: false,
                message: "FAZEMU-WEB",
                level: "warning"
            },
            idMunicipio: '',
            tipoDocumentoFiscal: '',
            inAtivo: '',
            inLote: '',
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
        const MunicipioConfiguracao = this.props.location.MunicipioConfiguracao == undefined ? '' : this.props.location.MunicipioConfiguracao;

        if (!isNew) {
            this.setState({ idMunicipio: MunicipioConfiguracao.idMunicipio })
            this.setState({ tipoDocumentoFiscal: MunicipioConfiguracao.tipoDocumentoFiscal })
            this.setState({ inAtivo: MunicipioConfiguracao.inAtivo })
            this.setState({ inLote: MunicipioConfiguracao.inLote })
        }

        const urlMunicipios = `${config.endpoint['fazemu-nfse']}/municipio/ativo`;
        axiosAuth.get(urlMunicipios, getConfig())
            .then(response => {
                console.log(response.data);
                this.setState({
                    listaMunicipios: response.data,
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
            var url = `${config.endpoint['fazemu-nfse']}/municipioConfiguracao/adicionar`;
        } else {
            var url = `${config.endpoint['fazemu-nfse']}/municipioConfiguracao/atualizar`;
        }

        let MunicipioConfiguracao = new Object();
        MunicipioConfiguracao.idMunicipio = this.state.idMunicipio;
        MunicipioConfiguracao.tipoDocumentoFiscal = this.state.tipoDocumentoFiscal;
        MunicipioConfiguracao.inAtivo = this.state.inAtivo;
        MunicipioConfiguracao.inLote = this.state.inLote;
        MunicipioConfiguracao.usuario = getCookie(COOKIE_USER_ID);

        axiosAuth.post(url, MunicipioConfiguracao, getConfig())
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
        this.setState({ idMunicipio: '' });
        this.setState({ tipoDocumentoFiscal: '' });
        this.setState({ inAtivo: '' });
        this.setState({ inLote: '' });
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
                            <h1>Municipio Configuração</h1>
                        </div>
                        {this.renderForm()}
                    </div>
                </div>
            </div>
        );
    }

    renderForm() {
        const isNew = this.props.location.isNew == undefined ? true : this.props.location.isNew;
        const listaMunicipios = pathOr([], ['listaMunicipios'], this.state);

        let optionItemsMunicipio = listaMunicipios.map((municipio, key) =>
            <option key={key} value={municipio.idMunicipio}>{municipio.nome}</option>
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
                                        <div className="form-label">Municipio</div>
                                        <select className="form-control" value={this.state.idMunicipio} onChange={this.handleInputChange}
                                            name="idMunicipio" disabled={!isNew}>
                                            <option value='' defaultChecked>- Selecionar -</option>
                                            {optionItemsMunicipio}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-2">
                                        <div className="form-label">Utiliza Lote?</div>
                                        <select className="form-control" value={this.state.inLote} onChange={this.handleInputChange} name="inLote">
                                            <option value='' defaultChecked>- Selecionar -</option>
                                            <option value='S'>Sim</option>
                                            <option value='N'>Não</option>
                                        </select>
                                    </div>
                                    <div className="col-2">
                                        <div className="form-label">Ativo?</div>
                                        <select className="form-control" value={this.state.inAtivo} onChange={this.handleInputChange} name="inAtivo">
                                            <option value='' defaultChecked>- Selecionar -</option>
                                            <option value='S'>Sim</option>
                                            <option value='N'>Não</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="card-footer">
                    {/* <Button color="success" size="sm" type="submit" onClick={this.handleSubmit} disabled={this.state.idMunicipio == '' || this.state.inLote == '' || this.state.inAtivo == ''}>Salvar</Button>&nbsp; */}
                    <Link to="/MunicipioConfiguracaoInit"><Button color="danger" size="sm">Voltar</Button></Link>
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

export default MunicipioConfiguracao