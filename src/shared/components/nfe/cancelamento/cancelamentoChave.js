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

class CancelamentoChave extends Component {
    constructor(props) {
        super(props)

        this.chaveAcesso = React.createRef();
        this.numeroProtocolo = React.createRef();
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
                {this.renderDocumentoFiscal()}
                {this.renderForm(documentoFiscal)}
            </div>
        )
    }

    renderDocumentoFiscal() {
        return (
            <div className="form-group">
                <div>
                    <h1>Cancelamento</h1>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="form-group" >
                            <input className="form-control" type="key" name="key" id="key" placeholder="Chave de Acesso" ref={this.chaveAcesso} />
                        </div>
                        <Button color="primary" size="sm" onClick={this.getDocumentoFiscal}>Consultar Chave de Acesso</Button>
                    </div>
                </div>
            </div>
        )
    }

    renderForm(documentoFiscal) {
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
                                            <div className="form-label">Número</div>
                                            <input className="form-control" type="text" readOnly value={documentoFiscal.numeroDocumentoFiscal} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card mt-1">
                        <div className="card-header">
                            <h4>Cancelamento</h4>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <div className="form">
                                    <div className="form-row">
                                        <div className="col-3">
                                            <div className="form-label">Protocolo</div>
                                            <input className="form-control" type="number" ref={this.numeroProtocolo} />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="col">
                                            <div className="form-label">Justificativa</div>
                                            <textarea className="form-control" name="text" rows="5" maxLength="1000" placeholder="Justificativa" ref={this.justificativa} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card mt-1">
                        <div className="card-footer">
                            <Button className="float-right" color="danger" size="sm" onClick={this.sendCard}>Enviar Cancelamento</Button>
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
        const url = `${config.endpoint['fazemu-nfe']}/cancelamento`;

        const chaveAcesso = this.chaveAcesso.current.value;
        const numeroProtocolo = this.numeroProtocolo.current.value;
        const justificativa = this.justificativa.current.value;
        const usuario = getCookie(COOKIE_USER_ID);

        const request = {
            chaveAcesso: chaveAcesso,
            numeroProtocolo: numeroProtocolo,
            justificativa: justificativa,
            usuario: usuario
        }

        const { documentoFiscal } = this.state;

        if (documentoFiscal.situacaoDocumento !== "A") {
            this.setState(
                {
                    alert: {
                        visible: true,
                        message: "Documento não está autorizado.",
                        level: "danger"
                    }
                }
            )
        } else if (justificativa.length < 15) {
            this.setState(
                {
                    alert: {
                        visible: true,
                        message: "Campo Justificativa deve conter no mínimo 15 caracteres",
                        level: "warning"
                    }
                }
            )
        } else if (numeroProtocolo.length < 15) {
            this.setState(
                {
                    alert: {
                        visible: true,
                        message: "Campo Protocolo deve conter no mínimo 15 caracteres",
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

export default CancelamentoChave