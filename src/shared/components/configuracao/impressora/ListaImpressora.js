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
import SituacaoImpressoraEnum from '../../../helpers/situacaoImpressoraEnum';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';

const config = require('config');

class ListaImpressora extends Component {

    constructor(props) {
        super(props);

        this.state = {
            nome: '',
            local: '',
            ip: '',
            marca: '',
            modelo: '',
            situacao: '',
            impressoras: undefined,
            pageOfItems: [],
            alert: {
                visible: false,
                message: "FAZEMU-WEB",
                level: "warning"
            }
        }

        this.handleChangeNome = this.handleChangeNome.bind(this);
        this.handleChangeLocal = this.handleChangeLocal.bind(this);
        this.handleChangeIp = this.handleChangeIp.bind(this);
        this.handleChangeMarca = this.handleChangeMarca.bind(this);
        this.handleChangeModelo = this.handleChangeModelo.bind(this);
        this.handleChangeSituacao = this.handleChangeSituacao.bind(this);

        this.onChangePage = this.onChangePage.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.listarImpressora = this.listarImpressora.bind(this);
    }

    handleChangeNome(event) { this.setState({ nome: event.target.value }) }
    handleChangeLocal(event) { this.setState({ local: event.target.value }) }
    handleChangeIp(event) { this.setState({ ip: event.target.value }) }
    handleChangeMarca(event) { this.setState({ marca: event.target.value }) }
    handleChangeModelo(event) { this.setState({ modelo: event.target.value }) }
    handleChangeSituacao(event) { this.setState({ situacao: event.target.value }) }

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

    listarImpressora = () => {

        let parametros = "";
        if (this.state.nome !== "") {
            const nome = "nome=" + this.state.nome;
            parametros = parametros + nome;
        }
        if (this.state.local !== "") {
            const local = "&local=" + this.state.local;
            parametros = parametros + local;
        }
        if (this.state.ip !== "") {
            const ip = "&ip=" + this.state.ip;
            parametros = parametros + ip;
        }
        if (this.state.marca !== "") {
            const marca = "&marca=" + this.state.marca;
            parametros = parametros + marca;
        }
        if (this.state.modelo !== "") {
            const modelo = "&modelo=" + this.state.modelo;
            parametros = parametros + modelo;
        }
        if (this.state.situacao !== "") {
            const situacao = "&situacao=" + this.state.situacao;
            parametros = parametros + situacao;
        }

        const url = `${config.endpoint['fazemu-nfe']}/impressora?${parametros}`;

        axiosAuth.get(url, getConfig())
            .then(response => {
                console.log(response.data)
                this.setState({
                    impressoras: response.data,
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
        const { impressoras } = this.state;

        return (
            <div>
                {this.renderAlert()}
                <div>
                    <h1>Impressoras</h1>
                </div>
                {this.renderSearchFields()}
                {this.renderRows(impressoras)}
            </div>
        );
    }

    renderRows(impressoras) {
        if (impressoras !== undefined) {


            const pageOfItems = pathOr([], ['pageOfItems'], this.state)
            const rows = []

            pageOfItems.map((imp, key) => {
                rows.push(
                    <tr key={key}>
                        <th className="text-center">{imp.id}</th>
                        <td className="text-center">{imp.nome}</td>
                        <td className="text-center">{imp.local}</td>
                        <td className="text-center">{imp.ip}</td>
                        <td className="text-center">{imp.porta}</td>
                        <td className="text-center">{imp.marca}</td>
                        <td className="text-center">{imp.modelo}</td>
                        <td className="text-center">{SituacaoImpressoraEnum[imp.situacao]}</td>
                        <td className="text-center">
                            <Link to={{
                                pathname: `/impressora`,
                                impressora: imp,
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
                                <th className="text-center">Nome</th>
                                <th className="text-center">Local</th>
                                <th className="text-center">IP</th>
                                <th className="text-center">Porta</th>
                                <th className="text-center">Marca</th>
                                <th className="text-center">Modelo</th>
                                <th className="text-center">Situação</th>
                                <th className="text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </Table>
                    <div align="right">
                        <Pagination items={this.state.impressoras} onChangePage={this.onChangePage} />
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
                                <div className="col-2">
                                    <div className="form-label">Nome</div>
                                    <input type="text" className="form-control" value={this.state.nome} onChange={this.handleChangeNome}></input>
                                </div>
                                <div className="col-2">
                                    <div className="form-label">Local</div>
                                    <input type="text" className="form-control" value={this.state.local} onChange={this.handleChangeLocal}></input>
                                </div>
                                <div className="col-2">
                                    <div className="form-label">IP</div>
                                    <input type="text" className="form-control" value={this.state.ip} onChange={this.handleChangeIp}></input>
                                </div>
                                <div className="col-2">
                                    <div className="form-label">Marca</div>
                                    <input type="text" className="form-control" value={this.state.marca} onChange={this.handleChangeMarca}></input>
                                </div>
                                <div className="col-2">
                                    <div className="form-label">Modelo</div>
                                    <input type="text" className="form-control" value={this.state.modelo} onChange={this.handleChangeModelo}></input>
                                </div>
                                <div className="col-1">
                                    <div className="form-label">Situação</div>
                                    <select className="form-control" value={this.state.situacao} onChange={this.handleChangeSituacao}>>
                                        <option value=''>Todos</option>
                                        <option value='A'>Ativo</option>
                                        <option value='C'>Cancelado</option>
                                    </select>
                                </div>
                                <small className="form-text text-muted"></small>
                            </div>
                        </div>
                    </div>
                    <Button color="primary" size="sm" onClick={this.listarImpressora}>Consultar</Button>&nbsp;
                    <Link to="/impressora"><Button color="success" size="sm">Criar</Button></Link>
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

export default ListaImpressora