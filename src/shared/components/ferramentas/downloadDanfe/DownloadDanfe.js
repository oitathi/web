import React, { Component } from 'react';
import axiosAuth from '../../../helpers/axios-auth';
import { getConfigBlob } from '../../../helpers/axios-config';
import { getCookie } from '../../../helpers/cookie';
import { COOKIE_USER_ID } from '../../../helpers/parameters';
import {
    Alert,
    Button, FormGroup, FormText
} from 'reactstrap';
import Loading from '../../../helpers/loading';


const config = require('config');

class DownloadDanfe extends Component {

    constructor(props) {
        super(props)

        this.state = {
            fileInput: null,
            loading: false,
            alert: {
                visible: false,
                message: "FAZEMU-WEB",
                level: "warning"
            }
        }

        this.onDismiss = this.onDismiss.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.fileChangeHandler = this.fileChangeHandler.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }
    fileChangeHandler(event) {
        let arquivo = event.target.files[0].name;
        let extensao = arquivo.substring(arquivo.length-3, arquivo.length);

        if (extensao === 'txt') {
            this.setState({ fileInput: event.target.files[0] })
        } else {
            this.setState({ alert: {
                visible: true,
                message: "Somente arquivos com extensão TXT são aceitos",
                level: "warning"
            } })
            this.setState({ fileInput: null });
            document.getElementById("fileInput").value = '';
        }
    }

    onDismiss() {
        this.setState( { alert: { visible: false } } );
    }

    handleSubmit(event) {
        event.preventDefault();
        var url = `${config.endpoint['fazemu-nfe']}/download/processar/danfe`;
        var configuracao = getConfigBlob(null, 'multipart/form-data');

        var form = new FormData();
        form.append("file", this.state.fileInput);
        form.append("usuario", getCookie(COOKIE_USER_ID));

        this.setState({loading: true})
        axiosAuth.post(url, form, configuracao)
        .then(response => {
            console.log("response salvar", response.data);
            var blob = new Blob([response.data], {type: "application/octet-stream"});
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            let filename = "FZM" + this.getDateAsString() + ".zip";
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

            this.resetForm();

            this.setState({
                alert: {
                    visible: true,
                    message: "Arquivo gerado com sucesso.",
                    level: "success"
                }
            });
        }).catch(error => {
            console.log("error salvar", { error })
            this.setState({
                alert: {
                    visible: true,
                    message: error.response.data.message,
                    level: "warning"
                }
            })
        }).then(()=> {
                this.setState({loading: false})
        });

    };

    getDateAsString() {
        var dateObj = new Date();
        var month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
        var day = ('0' + dateObj.getDate()).slice(-2);
        var year = dateObj.getFullYear();
        var hour = ('0' + (dateObj.getHours())).slice(-2);
        var minute = ('0' + (dateObj.getMinutes())).slice(-2);
        var second = ('0' + (dateObj.getSeconds())).slice(-2);
        var shortDate = year + month + day + hour + minute + second;
        return shortDate;
    }

    resetForm = () => {
        this.setState({ fileInput: null })
        document.getElementById("fileInput").value = '';
    }

    render() {
        return (
            <div>
                <div className="container-fluid px-5">
                    <div>
                        {this.renderAlert()}
                    <div>
                        <h1>Download Danfe</h1>
                    </div>
                        {this.renderForm()}
                        {this.state.loading && <Loading />}
                    </div>
                </div>
            </div>
        );
    }

    renderForm() {
        const classes = 'tooltip-inner'

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
                                    <FormGroup>
                                        <div className="form-label">Arquivo</div>
                                        <input type="file" ref={this.fileInput} name="file" id="fileInput" onChange={this.fileChangeHandler} />
                                        <FormText color="muted">Somente arquivos com extensão TXT serão aceitos.</FormText>
                                        <FormText color="muted">O arquivo deve conter apenas 1 chave de acesso por linha.</FormText>
                                    </FormGroup>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="card-footer">
                    <Button color="success" size="sm" type="submit" onClick={this.handleSubmit} target="_blank"
                        disabled={ this.state.fileInput == null }>Gerar Arquivo</Button>
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

export default DownloadDanfe