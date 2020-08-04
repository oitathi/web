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

class InutilizacaoChave extends Component {
    constructor(props) {
        super(props)

        this.chaveAcesso = React.createRef();
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

        this.getDocumentoFiscal = this.getDocumentoFiscal.bind(this);
        this.sendCard = this.sendCard.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
    }

    getDocumentoFiscal = () => {
        const chaveAcesso = this.chaveAcesso.current.value;
        const url = `${config.endpoint['fazemu-nfe']}/nfe/${chaveAcesso}/documentoFiscal`;

        axiosAuth.get(url, getConfig())
            .then(response => {
                this.setState({
                    documentoFiscal: response.data,
                    alert: {
                        visible: false,
                        message: "FAZEMU-WEB",
                        level: "warning"
                    }
                })
            }).catch(error => {
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

    };

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
        const { documentoFiscal } = this.state;
        return (
            <div>
                {this.renderAlert()}
                <div>
                    <h1>Inutilização - Chave de Acesso</h1>
                </div>
                {this.renderDocumentoFiscal()}
                {this.renderRows(documentoFiscal)}
            </div>
        )
    }

    renderDocumentoFiscal() {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="form-group">
                        <div className="form">
                            <div className="form-row">
                                <input className="form-control" type="key" placeholder="Chave de Acesso" ref={this.chaveAcesso} />
                            </div>
                        </div>
                    </div>
                    <Button color="primary" size="sm" onClick={this.getDocumentoFiscal}>Consultar Chave de Acesso</Button>
                </div>
            </div>
        )
    }

    renderRows(documentoFiscal) {
        if (documentoFiscal !== undefined) {
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
                                            <select className="form-control" type="text" readOnly value={documentoFiscal.chaveAcesso.substring(0, 2)}>
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
                                            <input className="form-control" type="text" readOnly value={documentoFiscal.anoDocumentoFiscal} />
                                        </div>
                                        <div className="col-2">
                                            <div className="form-label">Emissor</div>
                                            <input className="form-control" type="text" readOnly value={documentoFiscal.idEmissor} />
                                        </div>
                                        <div className="col-1">
                                            <div className="form-label">Modelo</div>
                                            <input className="form-control" type="text" readOnly value={documentoFiscal.chaveAcesso.substring(20, 22)} />
                                        </div>
                                        <div className="col-1">
                                            <div className="form-label">Série</div>
                                            <input className="form-control" type="text" readOnly value={documentoFiscal.serieDocumentoFiscal} />
                                        </div>
                                        <div className="col-2">
                                            <div className="form-label">Número Inicial</div>
                                            <input className="form-control" type="text" readOnly value={documentoFiscal.numeroDocumentoFiscal} />
                                        </div>
                                        <div className="col-2">
                                            <div className="form-label">Número Final</div>
                                            <input className="form-control" type="text" readOnly value={documentoFiscal.numeroDocumentoFiscal} />
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

    }
    renderAlert() {
        return (
            <Alert color={this.state.alert.level} isOpen={this.state.alert.visible} toggle={this.onDismiss}>
                {this.state.alert.message}
            </Alert>
        )
    }

    sendCard = () => {
        const { documentoFiscal } = this.state;

        const url = `${config.endpoint['fazemu-nfe']}/inutilizacao`;
        const chaveAcesso = this.chaveAcesso.current.value;
        const justificativa = this.justificativa.current.value;
        const usuario = getCookie(COOKIE_USER_ID);

        const request = {
            chaveAcesso: chaveAcesso,
            justificativa: justificativa,
            codigoIbge: documentoFiscal.chaveAcesso.substring(0, 2),
            ano: documentoFiscal.anoDocumentoFiscal,
            idEmissor: documentoFiscal.idEmissor,
            modelo: documentoFiscal.chaveAcesso.substring(20, 22),
            serieDocumentoFiscal: documentoFiscal.serieDocumentoFiscal,
            numeroNFInicial: documentoFiscal.numeroDocumentoFiscal,
            numeroNFFinal: documentoFiscal.numeroDocumentoFiscal,
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

export default InutilizacaoChave