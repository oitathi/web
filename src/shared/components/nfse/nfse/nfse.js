import React, { Component } from 'react'
import axiosAuth from '../../../helpers/axios-auth';
import { getConfig } from '../../../helpers/axios-config';
import {
    Button,
    Table,
    TabContent,
    TabPane,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';
import Menu from '../../menu';
import { pathOr } from 'ramda';
import { Link } from 'react-router-dom';
import Eventos from './eventos';
import Retorno from './retorno';
import InterfaceEvento from './interfaceEvento';
import MunicipioEnum from '../../../helpers/municipioEnum';
import TipoEmissaoEnum from '../../../helpers/tipoEmissaoEnum';
import SituacaoDocumentoEnum from '../../../helpers/situacaoDocumentoEnum';
import classnames from 'classnames';
import { isNullOrUndefined, isNull } from 'util';
import formatMoney from '../../../helpers/formatNumber';
import Loading from '../../../helpers/loading';


const config = require('config');

class NFSe extends Component {
    constructor(props) {
        super(props)

        this.toggle = this.toggle.bind(this);
        this.state = {
            documentoFiscal: undefined,
            documentoRetornos: undefined,
            nfse: undefined,
            activeTab: 'SituacaoDocumento',
            loading: false,
        }
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    componentDidMount() {
        const documentoFiscal = this.props.location.documentoFiscal;
        this.getDocumentoRetornos(documentoFiscal);
        this.getNfse(documentoFiscal);
    }

    getDocumentoRetornos(documentoFiscal) {
        const idDocFiscal = "idDocFiscal=" + documentoFiscal.id;
        const url = `${config.endpoint['fazemu-nfse']}/documentoRetorno?${idDocFiscal}`;

        this.setState({ loading: false })
        axiosAuth.get(url, getConfig())
            .then(response => {
                this.setState({
                    documentoRetornos: response.data
                })
            }).catch(error => {
                console.log("error", error.response.data.message, { error })
            }).then(() => {
                this.setState({ loading: false })
            });
    }

    getNfse(documentoFiscal) {
        if (documentoFiscal.situacaoDocumento != null
            && documentoFiscal.situacaoDocumento != "V") {
            const url = `${config.endpoint['fazemu-nfse']}/nfse/${documentoFiscal.chaveAcesso}`;

            this.setState({ loading: false })
            axiosAuth.get(url, getConfig())
                .then(response => {
                    this.setState({
                        nfse: response.data
                    })
                }).catch(error => {
                    console.log("error", error.response.data.message, { error })
                }).then(() => {
                    this.setState({ loading: false })
                });
        }
    }

    render() {
        const documentoFiscal = this.props.location.documentoFiscal;

        const documentoRetornos = pathOr([], ['documentoRetornos'], this.state)

        return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <div>
                        <div>
                            <h1>Consulta NFSe</h1>
                        </div>
                        {this.renderButtons(documentoFiscal, documentoRetornos)}
                        {this.renderTabs(documentoFiscal)}
                        {this.state.loading && <Loading />}
                    </div>
                </div>
            </div>
        )
    }

    renderButtons(documentoFiscal, documentoRetornos) {
        const rowsRetorno = [];

        let hasXML = false;

        if (documentoFiscal.situacaoDocumento != null &&
            documentoFiscal.situacaoDocumento != "V" &&
            documentoFiscal.situacaoDocumento != "R") {
            hasXML = true;
        }

        documentoRetornos.map((documentoRetorno, key) => {
            //Define se ha carta de correcao para o documento fiscal
            rowsRetorno.push(
                <Retorno key={key} documentoRetorno={documentoRetorno} />
            )
        })

        return (
            <div className="mt-1">
                <div className="btn-group" role="group">
                    <Link to="/nfseInit"><Button color="danger" className="btn btn-secondary mr-1" size="sm">Voltar</Button></Link>
                    {this.renderButtonXML(hasXML, documentoFiscal.chaveAcesso)}
                    <Eventos documentoFiscal={documentoFiscal} />
                    {rowsRetorno}
                    <InterfaceEvento documentoFiscal={documentoFiscal} />
                </div>
            </div>
        )
    }

    renderButtonXML(hasXML, chaveAcesso) {
        if (hasXML) {
            return (
                <a href={this.getXml(chaveAcesso)} target="_blank">
                    <Button className="btn btn-secondary mr-1" size="sm">Download XML</Button>
                </a>
            )
        }
    }

    renderTabs(documentoFiscal) {
        return (
            <div>
                <div className="mt-1">
                    <Nav tabs>
                        <NavItem>
                            <NavLink className={classnames({ active: this.state.activeTab === 'SituacaoDocumento' })} onClick={() => { this.toggle('SituacaoDocumento'); }}>
                                Situação Documento
                                </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                        {this.renderSituacaoDocumento(documentoFiscal)}
                    </TabContent>
                </div>
            </div>
        )

    }

    renderSituacaoDocumento(documentoFiscal) {
        return (
            <TabPane tabId="SituacaoDocumento">
                <div className="card mt-1">
                    <div className="card-header">
                        <h4>Situação Documento</h4>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <b className="col-sm-2">Município</b>
                            <span className="col-sm-9">{MunicipioEnum[documentoFiscal.idMunicipio]}</span>
                        </div>
                        <div className="row">
                            <b className="col-sm-2">Número Documento Externo</b>
                            <span className="col-sm-9">{documentoFiscal.numeroDocumentoFiscalExterno}</span>
                        </div>
                        <div className="row">
                            <b className="col-sm-2">Chave de Acesso</b>
                            <span className="col-sm-9">{documentoFiscal.chaveAcessoEnviada}</span>
                        </div>
                        <div className="row">
                            <b className="col-sm-2">Data de Recebimento</b>
                            <span className="col-sm-9">{documentoFiscal.dataHoraReg}</span>
                        </div>
                        <div className="row">
                            <b className="col-sm-2">Tipo Emissão</b>
                            <span className="col-sm-9">{TipoEmissaoEnum[documentoFiscal.tipoEmissao]}</span>
                        </div>
                        <div className="row">
                            <b className="col-sm-2">Código do Retorno</b>
                            <span className="col-sm-9">{documentoFiscal.situacaoAutorizador}</span>
                        </div>
                        <div className="row">
                            <b className="col-sm-2">Situação Documento</b>
                            <span className="col-sm-9">{SituacaoDocumentoEnum[documentoFiscal.situacaoDocumento]}</span>
                        </div>
                    </div>
                </div>
            </TabPane>
        )
    }

    renderPagto(pag) {
        const rows = [];

        pag.detPag.map((pgto, key) => {

            rows.push(
                <div key={key}>
                    <div className="card-body">
                        <div className="row">
                            <b className="col-sm-2">Ind. Pag.</b>
                            <span className="col-sm-9">{pgto.indPag}</span><br />
                        </div>
                        <div className="row">
                            <b className="col-sm-2">Tp. Pagamento</b>
                            <span className="col-sm-9">{pgto.tpag}</span><br />
                        </div>
                        <div className="row">
                            <b className="col-sm-2">Valor Pago</b>
                            <span className="col-sm-9">R$ {formatMoney(pgto.vpag)}</span><br />
                        </div>
                        <div className="row">
                            <b className="col-sm-2">Troco</b>
                            <span className="col-sm-9">R$ {formatMoney(pgto.vtroco)}</span>
                        </div>
                    </div>
                </div>
            )
        })

        return (
            <div>
                {rows}
            </div>
        )
    }

    renderTranspVol(transp) {
        const rows = [];

        transp.vol.map((transporte, key) => {
            rows.push(
                <div key={key}>
                    <b className="col-sm-2">Espécie</b>
                    <span className="col-sm-9">{transporte.esp === null ? '' : transporte.esp}</span><br />
                    <b className="col-sm-2">Marca</b>
                    <span className="col-sm-9">{transporte.marca === null ? '' : transporte.marca}</span><br />
                    <b className="col-sm-2">Peso Liq.</b>
                    <span className="col-sm-9">{transporte.pesoL}</span><br />
                    <b className="col-sm-2">Peso Bruto</b>
                    <span className="col-sm-9">{transporte.pesoB}</span><br />
                    <b className="col-sm-2">Lacres</b>
                    <span className="col-sm-9">
                        {transporte.lacres = isNullOrUndefined ? '' : transporte.lacres}
                    </span><br />
                    <b className="col-sm-2">Qtd. Vol.</b>
                    <span className="col-sm-9">{transporte.qvol}</span><br />
                    <b className="col-sm-2">N. Vol.</b>
                    <span className="col-sm-9">{transporte.nvol}</span>
                </div>
            )

        })

        return (
            <div >
                {rows}

            </div>
        )

    }

    renderProdutos(produtos) {
        const rows = [];

        produtos.map((produto, key) => {
            rows.push(
                <tr key={key}>
                    <th>{key + 1}</th>
                    <td>{produto.prod.cprod}</td>
                    <td>{produto.prod.xprod}</td>
                    <td>{produto.prod.ucom}</td>
                    <td>{produto.prod.qcom}</td>
                    <td>{formatMoney(produto.prod.vunCom)}</td>
                    <td>{formatMoney(produto.prod.vprod)}</td>
                </tr>
            )
        })

        return (
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Codigo</th>
                        <th>Descrição</th>
                        <th>Unid.</th>
                        <th>Qtd.</th>
                        <th>Valor Unitário</th>
                        <th>Valor Total</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </Table>
        )
    }

    getXml = (chaveAcesso) => {
        const url = `${config.endpoint['fazemu-nfse']}/nfse/${chaveAcesso}/xml`;
        return url;
    };

}

export default NFSe