import React, { Component } from 'react';
import axiosAuth from '../../../helpers/axios-auth';
import { getConfig } from '../../../helpers/axios-config';
import {
    Button,
    Table
} from 'reactstrap';
import { pathOr } from 'ramda';
import MetodoEnum from '../../../helpers/metodoEnum';
import TipoServicoEnum from '../../../helpers/tipoServicoEnum';
import SituacaoEnum from '../../../helpers/situacaoEnum';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Pagination from '../../Pagination';
import Loading from '../../../helpers/loading';

const config = require('config');

class InterfaceEvento extends Component {

    constructor(props) {
        super(props)

        this.idSistema = React.createRef();
        this.idMetodo = React.createRef();
        this.chaveAcesso = React.createRef();
        this.situacao = React.createRef();
        this.dataHoraRegistroInicio = React.createRef();
        this.dataHoraRegistroFim = React.createRef();
        this.quantidadeRegistros = React.createRef();

        this.state = {
            eventos: undefined,
            pageOfItems: [],
            loading: false
        }

        this.listarEvento = this.listarEvento.bind(this);

        this.onChangePage = this.onChangePage.bind(this);

        this.handleChangeDataHoraRegistroInicio = this.handleChangeDataHoraRegistroInicio.bind(this);
        this.handleChangeDataHoraRegistroFim = this.handleChangeDataHoraRegistroFim.bind(this);

    }

    handleChangeDataHoraRegistroInicio(date) { this.setState({ dataHoraRegistroInicio: date }) }
    handleChangeDataHoraRegistroFim(date) { this.setState({ dataHoraRegistroFim: date }) }

    onChangePage(pageOfItems) {
        // update state with new page of items
        this.setState({ pageOfItems: pageOfItems });
    }

    listarEvento = () => {
        
        let parametros = "";
        if (this.idSistema.current.value !== "") {
            const idSistema = "&idSistema=" + this.idSistema.current.value;
            parametros = parametros + idSistema;
        }
        if (this.idMetodo.current.value !== "") {
            const idMetodo = "&idMetodo=" + this.idMetodo.current.value;
            parametros = parametros + idMetodo;
        }
        
        if (this.chaveAcesso.current.value !== "") {
            const chaveAcesso = "&chaveAcesso=" + this.chaveAcesso.current.value;
            parametros = parametros + chaveAcesso;
        }
        
        if (this.situacao.current.value !== "") {
            const situacao = "&situacao=" + this.situacao.current.value;
            parametros = parametros + situacao;
        }
        
        if (this.state.dataHoraRegistroInicio ? moment(this.state.dataHoraRegistroInicio).format() : "" !== "") {
            const dataHoraRegistroInicio = "&dataHoraRegistroInicio=" + (this.state.dataHoraRegistroInicio ? moment(this.state.dataHoraRegistroInicio).format() : "");
            parametros = parametros + dataHoraRegistroInicio;
        }
        
        if (this.state.dataHoraRegistroFim ? moment(this.state.dataHoraRegistroFim).format() : "" !== "") {
            const dataHoraRegistroFim = "&dataHoraRegistroFim=" + (this.state.dataHoraRegistroFim ? moment(this.state.dataHoraRegistroFim).format() : "");
            parametros = parametros + dataHoraRegistroFim;
        }

        if(this.quantidadeRegistros.value !== ""){
            const quantidadeRegistros = "&quantidadeRegistros=" + this.quantidadeRegistros.current.value;
            parametros = parametros + quantidadeRegistros;

        }

        const url = `${config.endpoint['fazemu-nfe']}/interfaceEvento?${parametros}`;

        this.setState({loading: true})
        axiosAuth.get(url, getConfig())
            .then(response => {
                console.log(response.data)
                this.setState({
                    eventos: response.data,
                })
            }).catch(error => {
                console.log("error", { error })
                return null;
            }).then(()=> {
                this.setState({loading: false})
            });

    };

    render() {
        const { eventos } = this.state;

        return (
            <div>
                <div>
                    <h1>Interface Evento</h1>
                </div>
                {this.renderSearchFields()}
                {this.renderEventos(eventos)}
                {this.state.loading && <Loading />}
            </div>
        )
    }

    renderEventos(eventos) {
        if (eventos !== undefined) {

            const pageOfItems = pathOr([], ['pageOfItems'], this.state)
            const rows = []

            pageOfItems.map((inev, key) => {
                rows.push(
                    <tr key={key}>
                        <th>{inev.idEvento}</th>
                        <td>{inev.idSistema}</td>
                        <td>{MetodoEnum[inev.idMetodo]}</td>
                        <td>{TipoServicoEnum[inev.tipoServico]}</td>
                        <td>{inev.chaveAcessoEnviada}</td>
                        <td>{inev.observacao}</td>
                        <td>{SituacaoEnum[inev.situacao]}</td>
                        <td className="text-nowrap">{moment(inev.dataHoraRegistro).format("DD/MM/YYYY HH:mm:ss")}</td>
                        <td className="text-nowrap">{moment(inev.dataHora).format("DD/MM/YYYY HH:mm:ss")}</td>
                    </tr>
                )
            })

            return (
                <div className="card-header">
                    <Table striped>
                        <thead>
                            <tr>
                                <th className="text-center">#</th>
                                <th className="text-center">Sistema</th>
                                <th className="text-center">Retorno</th>
                                <th className="text-center">Tipo Serviço</th>
                                <th>Chave Acesso</th>
                                <th>Observação</th>
                                <th className="text-center">Situação</th>
                                <th className="text-center">Data/Hora Reg.</th>
                                <th className="text-center">Data/Hora Ult.Alt.</th>
                            </tr>
                        </thead>
                        <tbody id="inevbody" >
                            {rows}
                        </tbody>
                    </Table>
                    <div align="right">
                        <Pagination items={this.state.eventos} onChangePage={this.onChangePage} />
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
                                <div className="col-1">
                                    <div className="form-label">Sistema</div>
                                    <select className="form-control" ref={this.idSistema}>
                                        <option value="">Todos</option>
                                        <option>UMBRELLA</option>
                                        <option>WMS</option>
                                    </select>
                                </div>
                                <div className="col-1">
                                    <div className="form-label">Retorno</div>
                                    <select className="form-control" ref={this.idMetodo}>
                                        <option value="">Todos</option>
                                        <option value="1">UMBRELLA</option>
                                        <option value="2">WMS</option>
                                    </select>
                                </div>
                                <div className="col-4">
                                    <div className="form-label">Chave Acesso</div>
                                    <input className="form-control" type="text" ref={this.chaveAcesso} />
                                </div>
                                <div className="col-1">
                                    <div className="form-label">Situação</div>
                                    <select className="form-control" ref={this.situacao}>
                                        <option value="">Todos</option>
                                        <option value="A">Aberto</option>
                                        <option value="E">Erro</option>
                                        <option value="C">Cancelado</option>
                                        <option value="L">Liquidado</option>
                                    </select>
                                </div>
                                <div className="col-0">
                                    <div className="form-label">Data Inicio</div>
                                    <DatePicker className="form-control" selected={this.state.dataHoraRegistroInicio} onChange={this.handleChangeDataHoraRegistroInicio} dateFormat="dd/MM/yyyy HH:mm:ss" showTimeInput timeFormat="HH:mm:ss" />
                                </div>
                                <div className="col-0">
                                    <div className="form-label">Data Fim</div>
                                    <DatePicker className="form-control" selected={this.state.dataHoraRegistroFim} onChange={this.handleChangeDataHoraRegistroFim} dateFormat="dd/MM/yyyy HH:mm:ss" showTimeInput timeFormat="HH:mm:ss" />
                                </div>
                                <div className="col-1">
                                    <div className="form-label">Qtde. Registros</div>
                                    <select className="form-control" ref={this.quantidadeRegistros}>
                                        <option>50</option>
                                        <option>250</option>
                                        <option>1000</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button color="primary" size="sm" onClick={this.listarEvento}>Consultar</Button>
                </div>
            </div>
        )
    }
}

export default InterfaceEvento