import React, { Component } from 'react';
import axiosAuth from '../../../helpers/axios-auth';
import { getConfig } from '../../../helpers/axios-config';
import { getCookie } from '../../../helpers/cookie';
import { COOKIE_USER_ID } from '../../../helpers/parameters';
import {
    Alert,
    Button
} from 'reactstrap';

const config = require('config');

class InutilizacaoFaixa extends Component {
    constructor(props) {
        super(props)

        this.codigoIbge = React.createRef();
        this.ano = React.createRef();
        this.idEmissor = React.createRef();
        this.modelo = React.createRef();
        this.serie = React.createRef();
        this.numeroNFInicial = React.createRef();
        this.numeroNFFinal = React.createRef();
        this.justificativa = React.createRef();
        this.state = {
            documentoFiscal: undefined,
            alert: {
                visible: false,
                message: "FAZEMU-WEB",
                level: "warning"
            },
            usuario: ''
        }

        this.sendCard = this.sendCard.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
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

    render() {

        return (
            <div>
                {this.renderAlert()}
                <div>
                    <h1>Inutilização - Faixa de Números</h1>
                </div>
                {this.renderForm()}
            </div>
        )
    }

    renderForm() {
        return (
            <div>
                <div className="card">
                    <div className="card-header">
                        <h4>Identificação</h4>
                    </div>
                    <div className="card-body">
                        <div className="form-group">
                            <div className="form">
                                <div className="form-row">
                                    <div className="col-3">
                                        <div className="form-label">Estado</div>
                                        <select className="form-control" ref={this.codigoIbge}>
                                            <option value="35">São Paulo</option>
                                            <option value="53">Distrito Federal</option>
                                            <option value="32">Espírito Santo</option>
                                            <option value="31">Minas Gerais</option>
                                            <option value="26">Pernambuco</option>
                                            <option value="41">Paraná</option>
                                            <option value="33">Rio de Janeiro</option>
                                            <option value="43">Rio Grande do Sul</option>
                                            <option value="42">Santa Catarina</option>
                                        </select>
                                    </div>
                                    <div className="col-1">
                                        <div className="form-label">Ano</div>
                                        <input className="form-control" type="number" defaultValue="2019" min="0" max="9999" ref={this.ano} />
                                    </div>
                                    <div className="col-2">
                                        <div className="form-label">CNPJ Emissor</div>
                                        <input className="form-control" type="number" min="0" max="99999999999999" ref={this.idEmissor} />
                                    </div>
                                    <div className="col-1">
                                        <div className="form-label">Modelo</div>
                                        <select className="form-control" ref={this.modelo}>
                                            <option>55</option>
                                            <option>65</option>
                                        </select>
                                    </div>
                                    <div className="col-1">
                                        <div className="form-label">Série</div>
                                        <input className="form-control" type="text" maxLength="3" ref={this.serie} />
                                    </div>
                                    <div className="col-2">
                                        <div className="form-label">Número Inicial</div>
                                        <input className="form-control" type="number" min="0" ref={this.numeroNFInicial} />
                                    </div>
                                    <div className="col-2">
                                        <div className="form-label">Número Inicial</div>
                                        <input className="form-control" type="number" min="0" ref={this.numeroNFFinal} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card mt-1">
                    <div className="card-header">
                        <h4>Justificativa</h4>
                    </div>
                    <div className="card-body">
                        <div className="form-group">
                            <div className="form">
                                <div className="form-row">
                                    <div className="col">
                                        <textarea className="form-control" type="text" rows="5" maxLength="1000" placeholder="Justificativa" ref={this.justificativa} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <Button className="float-right" color="danger" size="sm" onClick={this.sendCard}>Enviar Inutilização</Button>
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

    sendCard = () => {
        const url = `${config.endpoint['fazemu-nfe']}/inutilizacao`;

        const codigoIbge = this.codigoIbge.current.value;
        const ano = this.ano.current.value;
        const idEmissor = this.idEmissor.current.value;
        const modelo = this.modelo.current.value;
        const serie = this.serie.current.value;
        const numeroNFInicial = this.numeroNFInicial.current.value;
        const numeroNFFinal = this.numeroNFFinal.current.value;
        const justificativa = this.justificativa.current.value;
        const usuario = getCookie(COOKIE_USER_ID);

        const request = {
            justificativa: justificativa,
            codigoIbge: codigoIbge,
            ano: ano,
            idEmissor: idEmissor,
            modelo: modelo,
            serieDocumentoFiscal: serie,
            numeroNFInicial: numeroNFInicial,
            numeroNFFinal: numeroNFFinal,
            usuario: usuario
        }
        console.log("request", request);

        if (justificativa.length < 15) {
            this.setState(
                {
                    alert: {
                        visible: true,
                        message: "Campo Justificativa deve conter no mínimo 15 caracteres",
                        level: "warning"
                    }
                }
            )
        } else {
            axiosAuth.post(url, request, getConfig())
                .then(response => {
                    this.setState(
                        {
                            documentoFiscal: undefined,
                            alert: {
                                visible: true,
                                message: response.data.mensagemRetorno,
                                level: "success"
                            }
                        }
                    )
                }).catch(error => {
                    let level = "danger";
                    let message = "Ocorreu um erro interno, tente novamente.";

                    if (error.response !== undefined) {
                        level = error.response.status >= 500 ? "danger" : "warning";
                        message = error.response.data.message
                    }

                    this.setState(
                        {
                            alert: {
                                visible: true,
                                message: message,
                                level: level
                            }
                        }
                    )
                });
        }
    }

}

export default InutilizacaoFaixa