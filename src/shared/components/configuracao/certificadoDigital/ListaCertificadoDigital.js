import React, { Component } from 'react';
import axiosAuth from '../../../helpers/axios-auth';
import { getConfig } from '../../../helpers/axios-config';
import {
    Alert,
    Button,
    Table
} from 'reactstrap';
import { pathOr } from 'ramda';
import Pagination from '../../Pagination';
import moment from 'moment';
import SituacaoCertificadoEnum from '../../../helpers/situacaoCertificadoEnum';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';

const config = require('config');

class ListaCertificadoDigital extends Component {

    constructor(props) {
        super(props);

        this.state = {
            nomeEmissor: '',
            situacao:'',
            listaCertificados: [],
            pageOfItems: [],
            alert: {
                visible: false,
                message: "FAZEMU-WEB",
                level: "warning"
            }
        }

        this.handleChangeNomeEmissor = this.handleChangeNomeEmissor.bind(this);
        this.handleChangeSituacao = this.handleChangeSituacao.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.listarCertificadoDigital = this.listarCertificadoDigital.bind(this);
    }

    handleChangeNomeEmissor(event) { this.setState({ nomeEmissor: event.target.value }) }
    handleChangeSituacao(event) { this.setState({ situacao: event.target.value }) }

    componentDidMount() {
        this.listarCertificadoDigital();
    }

    onChangePage(pageOfItems) {
        this.setState({ pageOfItems: pageOfItems });
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

 
    listarCertificadoDigital = () => {
        let parametros = "";
         if(this.state.nomeEmissor !== ""){
            const nomeAux = "nomeEmissor=" + this.state.nomeEmissor;
            parametros = parametros + nomeAux;
        }
         if(this.state.situacao !== ""){
            const situacaoAux = "&situacaoVigencia=" + this.state.situacao;
            parametros = parametros + situacaoAux;
        }
        const url = `${config.endpoint['fazemu-nfe']}/certificadoDigital/?${parametros}`;

        axiosAuth.get(url, getConfig())
            .then(response => {
                console.log(response.data)
                this.setState({
                    listaCertificados: response.data,
                    alert: {
                        visible: false,
                        message: "FAZEMU-WEB",
                        level: "warning"
                    }
                })
                
            }).catch(error => {
                console.log(error);
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

    render() {
       const { listaCertificados } = this.state;

        return (
            <div>
                {this.renderAlert()}
                <div>
                    <h1>Certificado Digital</h1>
                </div>
                {this.renderSearchFields()}
                {this.renderRows(listaCertificados)}
            </div>
        );
    }

    renderRows(listaCertificados) {
        if (listaCertificados !== undefined) {
            const pageOfItems = pathOr([], ['pageOfItems'], this.state)
            const rows = [];

            pageOfItems.map((item, key) => {
                rows.push(
                    <tr key={key}>
                        <th className="text-center">{item.id}</th>
                        <td className="text-center">{item.nomeEmissorRaiz}</td>
                        <td className="text-center">{moment(item.dataVigenciaInicio).format("DD/MM/YYYY HH:mm:ss")}</td>
                        <td className="text-center">{moment(item.dataVigenciaFim).format("DD/MM/YYYY HH:mm:ss")}</td>
                        <td className="text-center">{SituacaoCertificadoEnum[item.situacao]}</td>
                        <td className="text-center">
                            <Link to={{
                                pathname: `/certificadoDigital`,
                                certificadoDigital: item,
                                isNew: false
                            }}><FontAwesomeIcon icon={faPencilAlt} color="black" title="Editar" /></Link>
                        </td>
                    </tr>
                )
            })

            return (
                <div className="card-header">
                    <Table striped>
                        <thead>
                            <tr>
                                <th className="text-center">#</th>
                                <th className="text-center">Nome Emissor Raiz</th>
                                <th className="text-center">Data Vigência Início</th>
                                <th className="text-center">Data Vigência Fim</th>
                                <th className="text-center">Situação</th>
                                <th className="text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </Table>

                    <div align="right">
                        <Pagination items={this.state.listaCertificados} onChangePage={this.onChangePage} />
                    </div>
                </div>
            );
        }
    }

    renderSearchFields() {
         return (
            <div className="card">
                <div className="card-body">
                    <div className="form-group">
                        <div className="form">
                            <div className="form-row">
                                <div className="col-3">
                                    <div className="form-label">Nome Emissor</div>
                                    <input type="text" className="form-control" placeholder="Nome Emissor" value={this.state.nomeEmissor} onChange={this.handleChangeNomeEmissor}></input>
                                </div>
                                <small className="form-text text-muted"></small>

                                <div className="col-1">
                                    <div>
                                        <div className="form-label">Situação</div>
                                        <select className="form-control" name="idEmissorRaiz" value={this.state.idSituacao} onChange={this.handleChangeSituacao}>
                                            <option value='' defaultChecked>- Selecionar -</option>
                                            <option value='A' defaultChecked>- A EXPIRAR -</option>
                                            <option value='E' defaultChecked>- EXPIRADO -</option>
                                            <option value='V' defaultChecked>- VÁLIDO -</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button color="primary" size="sm" onClick={this.listarCertificadoDigital}>Consultar</Button>&nbsp;
                    <Link to="/certificadoDigital"><Button color="success" size="sm">Criar</Button></Link>
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

export default ListaCertificadoDigital