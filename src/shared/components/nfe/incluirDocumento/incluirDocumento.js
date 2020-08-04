import React, { Component } from 'react';
import { Alert, Button, FormGroup, FormText } from 'reactstrap';
import axiosAuth from '../../../helpers/axios-auth'
import { getConfig } from '../../../helpers/axios-config';
import { getCookie } from '../../../helpers/cookie';
import { COOKIE_USER_ID } from '../../../helpers/parameters';
import trataErros from '../../../helpers/trataErros';


const config = require('config');
class IncluirDocumento extends Component {

    constructor(props) {
        super(props)

        this.state = {
            alert: {
                visible: false,
                message: "FAZEMU-WEB",
                level: "warning"
            },
            fileInput: [],
            chaveAcesso: '',
            destinatario: '',
            usuario: '',
            loading: false
        }

        this.handleChangechaveAcesso = this.handleChangechaveAcesso.bind(this);
        this.handleChangeDestinatario = this.handleChangeDestinatario.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangechaveAcesso(event) {
        this.setState({
            chaveAcesso: event.target.value,
        })
    }

    handleChangeDestinatario(event) {
        this.setState({
            destinatario: event.target.value,
        })
    }

    handleChangeFile(event) {
        let arquivo = event.target.files[0].name;
        let extensao = arquivo.substring(arquivo.length - 3, arquivo.length);

        if (extensao === 'xml') {
            this.setState({
                fileInput: event.target.files[0],
            })
        } else {
            this.setState({
                alert: {
                    visible: true,
                    message: "Somente arquivos com extensão XML são aceitos",
                    level: "warning"
                }
            })
            this.setState({ fileInput: null });
            document.getElementById("fileInput").value = '';
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

    render() {
        return (
            <div>
                <h1>Incluir Documento</h1>
                {this.renderAlert()}
                {this.renderForm()}
            </div>
        );
    }

    renderForm() {
        return (
            <div className="card mt-1">
                <div className="card-header">
                    <h4>Inclusão de Documento</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <div className="form">
                                <div className="form-row">
                                    <div className="col-5">
                                        <div className="form-label">Chave de Acesso</div>
                                        <input className="form-control" type="text" value={this.state.chaveAcesso} onChange={this.handleChangechaveAcesso}></input>
                                    </div>
                                    <div className="col-2">
                                        <div className="form-label">Destinatário</div>
                                        <input className="form-control" type="number" value={this.state.destinatario} onChange={this.handleChangeDestinatario}></input>
                                    </div>
                                </div>
                                <div className="ml-2 mt-2">
                                    {this.renderFileUpload()}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="card-footer">
                    <Button color="primary" className="mr-2" size="sm" type="submit" onClick={this.handleSubmit}>Incluir</Button>
                </div>
            </div>
        );
    }

    renderAlert() {
        return (
            <Alert color={this.state.alert.level} isOpen={this.state.alert.visible} toggle={this.onDismiss}>
                {this.state.alert.message}
            </Alert>
        )
    }


    renderFileUpload() {
        return (
            <div className="form-row">
                <FormGroup>
                    <div className="form-label">Arquivo</div>
                    <input type="file" ref={this.fileInput} name="file" id="fileInput" onChange={this.handleChangeFile} />
                    <FormText color="muted">Somente arquivos com extensão XML serão aceitos.</FormText>
                    <FormText color="muted">O arquivo deve conter o XML processado (nfeProc).</FormText>
                </FormGroup>
            </div>
        )
    }
    handleSubmit(event) {
        event.preventDefault();
        var configuracao = getConfig(null, 'multipart/form-data');
        var form = new FormData();
        form.append("file", this.state.fileInput);
        form.append("usuario", getCookie(COOKIE_USER_ID));

        var parametros;
        if (this.state.chaveAcesso !== "") {
            parametros = "&chaveAcesso=" + this.state.chaveAcesso;
        }

        if (this.state.destinatario !== "") {
            parametros = parametros + "&destinatario=" + this.state.destinatario;
        }

        let url = `${config.endpoint['fazemu-nfe']}/documentoFiscal/incluirDocumento/?${parametros}`;

        this.setState({ loading: true })
        axiosAuth.post(url, form, configuracao)
            .then(response => {
                console.log(response.data);
                this.setState({
                    alert: {
                        visible: true,
                        message: trataErros(response.data.retorno), //validado por codigo no back
                        level: response.data.success == true ? "success" : "danger"
                    }
                });
                this.resetForm();
            }).catch(response => {
                console.log("error salvar", { response })
            }).then(() => {
                this.setState({ loading: false })
            });
    }

    resetForm = () => {
        this.setState({ chaveAcesso: '' });
        this.setState({ destinatario: '' });
    }
}
export default IncluirDocumento