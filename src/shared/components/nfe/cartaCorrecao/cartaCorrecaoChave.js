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

class CartaCorrecaoChave extends Component {
    constructor(props) {
        super(props)

        this.chaveAcesso = React.createRef();
        this.state = {
            xCorrecao: '',
            documentoFiscal: undefined,
            alert: {
                visible: false,
                message: "FAZEMU-WEB",
                level: "warning"
            },
            usuario: ''
        }

        this.getDocumentoFiscal = this.getDocumentoFiscal.bind(this);
        this.getParametrosInfra = this.getParametrosInfra.bind(this);
        this.getUltimoEnvioAprovado = this.getUltimoEnvioAprovado.bind(this);
        this.handleChangeXCorrecao = this.handleChangeXCorrecao.bind(this);

        this.sendCard = this.sendCard.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
    }

    componentDidMount() {
        this.getParametrosInfra();
    }

    handleChangeXCorrecao(event) {this.setState({xCorrecao: event.target.value})}

    getDocumentoFiscal = () => {
        const chaveAcesso = this.chaveAcesso.current.value;
        const url = `${config.endpoint['fazemu-nfe']}/nfe/${chaveAcesso}/documentoFiscal`;
      
        axiosAuth.get(url, getConfig())
            .then(response => {
                this.setState({documentoFiscal: response.data})
                this.getUltimoEnvioAprovado();
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

    getUltimoEnvioAprovado(){
        
        const parametro = this.state.documentoFiscal.id;
        const url = `${config.endpoint['fazemu-nfe']}/cartaCorrecao/${parametro}`;
        axiosAuth.get(url, getConfig())
            .then(response => {
                this.setState({xCorrecao: response.data})
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
                    <h1>Carta de Correção</h1>
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
            const { valorParametro } = this.state;

            const condicaoUso = valorParametro != undefined ? valorParametro.valor : ''

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
                            <h4>Correção</h4>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <div className="form">
                                    <div className="form-row">
                                        <div className="col">
                                            <textarea className="form-control" name="text" rows="5" maxLength="1000" placeholder="Carta de Correção" value={this.state.xCorrecao} onChange={this.handleChangeXCorrecao} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card mt-1">
                        <div className="card-header">
                            <h4>Condições de Uso</h4>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <div className="form">
                                    <div className="form-row mt-1">
                                        <div className="col">
                                            <textarea className="form-control" name="text" rows="4" placeholder="Condições de Uso" readOnly  value={condicaoUso} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer">
                            <Button className="float-right" color="danger" size="sm" onClick={this.sendCard}>Enviar Carta de Correção</Button>
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
        const url = `${config.endpoint['fazemu-nfe']}/cartaCorrecao`;

        const chaveAcesso = this.chaveAcesso.current.value;
        const xCorrecao = this.state.xCorrecao;
        const usuario = getCookie(COOKIE_USER_ID);

        const request = {
            chaveAcesso: chaveAcesso,
            xCorrecao: xCorrecao,
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
        } else if (xCorrecao.length < 15) {
            this.setState(
                {
                    alert: {
                        visible: true,
                        message: "Campo Correção deve conter no mínimo 15 caracteres",
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

    getParametrosInfra = () => {

        let parametros = "";
        const idParametro = "idParametro=" + "SEFAZ_CARTA_CORRECAO_COND_USO";
        parametros = idParametro;
        const tipoDocumentoFiscal = "&tipoDocumentoFiscal=" + "NFE";
        parametros = parametros + tipoDocumentoFiscal;

        const url = `${config.endpoint['fazemu-nfe']}/parametrosInfra/findByTipoDocumentoFiscalAndIdParametro?${parametros}`;

        axiosAuth.get(url, getConfig())
            .then(response => {
                this.setState({ valorParametro: response.data })
            }).catch(error => {
                console.log("error", { error })
                return null;
            });

    };

}

export default CartaCorrecaoChave