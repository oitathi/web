import React, { Component } from 'react'
import axiosAuth from '../../../helpers/axios-auth';
import { getConfig } from '../../../helpers/axios-config';
import { isNullOrUndefined } from 'util';
import {
    Button,
    Table,
    TabPane,
    TabContent,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';
import Menu from '../../menu';
import { pathOr } from 'ramda';
import { Link } from 'react-router-dom';
import Eventos from '../nfe/eventos';
import Retorno from '../nfe/retorno';
import TipoEmissaoEnum from '../../../helpers/tipoEmissaoEnum';
import SituacaoDocumentoEnum from '../../../helpers/situacaoDocumentoEnum';
import TipoEventoManifestacaoEnum from '../../../helpers/tipoEventoManifestacaoEnum';
import classnames from 'classnames';
import formatMoney from '../../../helpers/formatNumber';
import moment from 'moment';

const config = require('config');

class documentoManifestacao extends Component {
    constructor(props) {
        super(props)

        this.toggle = this.toggle.bind(this);

        this.state = {
            documentoFiscal: undefined,
            documentoRetornos: undefined,
            nfe: undefined,
            tipoNota: '',
            activeTab: 'SituacaoDocumento',
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
        this.getNfe(documentoFiscal);
    }

    getDocumentoRetornos(documentoFiscal) {
        const idDocFiscal = "idDocFiscal=" + documentoFiscal.id;
        const url = `${config.endpoint['fazemu-nfe']}/documentoRetorno?${idDocFiscal}`;

        axiosAuth.get(url, getConfig())
            .then(response => {
                console.log(response)
                this.setState({
                    documentoRetornos: response.data
                })
            }).catch(error => {
                console.log("error", error.response.data.message, { error })
            });
    }

    getNfe(documentoFiscal) {
        if (documentoFiscal.situacaoDocumento != null && documentoFiscal.situacaoDocumento != "V") {
            const url = `${config.endpoint['fazemu-nfe']}/nfe/completa/resumida/${documentoFiscal.chaveAcesso}`;
            axiosAuth.get(url, getConfig())
                .then(response => {
                    console.log("nfe", response)
                    this.setState({
                        nfe: this.getTipoNfe(response),
                        tipoNota: response.data.tipoNota
                    })
                }).catch(error => {
                    console.log("error ao tentar pegar nfe ", error.response, { error })
                });
        }
    }

    getTipoNfe(response) {
        if (response.data.tipoNota == 'completa') {
            return response.data.completa;
        }
        if (response.data.tipoNota == 'resumida') {
            return response.data.resumida;
        }
        return undefined
    }

    getXml = (chaveAcesso) => {
        const url = `${config.endpoint['fazemu-nfe']}/nfe/${chaveAcesso}/xml`;
        return url;
    };

    render() {
        const documentoFiscal = this.props.location.documentoFiscal;
        const { nfe } = this.state;
        const documentoRetornos = pathOr([], ['documentoRetornos'], this.state)

        return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <div>
                        <div>
                            <h1>Consulta NFe</h1>
                        </div>
                        {this.renderButtons(documentoFiscal, documentoRetornos)}
                        {this.managerTabs(documentoFiscal, nfe)}
                        <div className="mt-2">
                            <Link to={{ pathname: `/manifestar`, df: documentoFiscal }}>
                                <Button color="info" size="sm" className='mr-2'>Manifestar</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderButtons(documentoFiscal, documentoRetornos) {
        let hasXML = false;

        if (documentoFiscal.situacaoDocumento != null &&
            documentoFiscal.situacaoDocumento != "V") {
            hasXML = true;
        }

        const rowsRetorno = [];

        documentoRetornos.map((documentoRetorno, key) => {
            rowsRetorno.push(
                <Retorno key={key} documentoRetorno={documentoRetorno} />
            )
        })

        return (
            <div className="mt-3 mb-2">
                <div className="btn-group" role="group">

                    <Link to="/manifestacaoInit">
                        <Button color="danger" size="sm" className='mr-1'>Voltar</Button>
                    </Link>

                    {this.renderButtonXML(hasXML, documentoFiscal.chaveAcesso)}
                    <Eventos documentoFiscal={documentoFiscal} />
                    {rowsRetorno}
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

    managerTabs(documentoFiscal, nfe) {
        if (this.state.tipoNota == 'completa') {
            return (
                this.renderNfeTabs(documentoFiscal, nfe)
            )
        }
        else {
            return (
                this.renderResumoTabs(documentoFiscal, nfe)
            )
        }
    }

    renderResumoTabs(documentoFiscal, nfe) {
        if (nfe !== undefined) {
            return (
                <div>
                    <div className="mt-1">
                        <Nav tabs>
                            <NavItem>
                                <NavLink className={classnames({ active: this.state.activeTab === 'SituacaoDocumento' })} onClick={() => { this.toggle('SituacaoDocumento'); }}>
                                    Situação Documento
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={classnames({ active: this.state.activeTab === 'Resumo' })} onClick={() => { this.toggle('Resumo'); }}>
                                    Resumo
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                            {this.renderSituacaoDocumento(documentoFiscal)}
                            <TabPane tabId="Resumo" >
                                <div className="card mt-1">
                                    <div className="card-header">
                                        <h4>Resumo</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <b className="col-sm-2">Chave De Acesso</b>
                                            <span className="col-sm-9">{nfe.chNFe}</span>
                                        </div>
                                        <div className="row">
                                            <b className="col-sm-2">CNPJ</b>
                                            <span className="col-sm-9">{nfe.cnpj}</span>
                                        </div>
                                        <div className="row">
                                            <b className="col-sm-2">Nome</b>
                                            <span className="col-sm-9">{nfe.xnome}</span>
                                        </div>
                                        <div className="row" >
                                            <b className="col-sm-2">IE</b>
                                            <span className="col-sm-9">{nfe.ie}</span>
                                        </div>
                                        <div className="row" >
                                            <b className="col-sm-2">Data de Emissão</b>
                                            <span className="col-sm-9">{moment(nfe.dhEmi).format("DD/MM/YYYY HH:mm:ss")}</span>
                                        </div>
                                        <div className="row" >
                                            <b className="col-sm-2">Tipo de Documento Fiscal</b>
                                            <span className="col-sm-9">{nfe.tpNF}</span>
                                        </div>
                                        <div className="row" >
                                            <b className="col-sm-2">Versão de Documento Fiscal</b>
                                            <span className="col-sm-9">{nfe.vnf}</span>
                                        </div>
                                        <div className="row" >
                                            <b className="col-sm-2">Digito Validador</b>
                                            <span className="col-sm-9">{nfe.digVal}</span>
                                        </div>
                                        <div className="row" >
                                            <b className="col-sm-2">Data de Recebimento</b>
                                            <span className="col-sm-9">{moment(nfe.dhRecbto).format("DD/MM/YYYY HH:mm:ss")}</span>
                                        </div>
                                        <div className="row" >
                                            <b className="col-sm-2">Número de Protocolo</b>
                                            <span className="col-sm-9">{nfe.nprot}</span>
                                        </div>
                                        <div className="row" >
                                            <b className="col-sm-2">Situação</b>
                                            <span className="col-sm-9">{nfe.csitNFe}</span>
                                        </div>
                                    </div>
                                </div>
                            </TabPane>
                        </TabContent>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    {this.renderNfeUndefined(documentoFiscal)}
                </div>
            )
        }
    }

    renderNfeTabs(documentoFiscal, nfe) {
        const identificacao = pathOr("", ['nfe', 'infNFe', 'ide'], nfe);
        const emitente = pathOr("", ['nfe', 'infNFe', 'emit'], nfe);
        const destinatario = pathOr("", ['nfe', 'infNFe', 'dest'], nfe);
        const transp = pathOr([], ['nfe', 'infNFe', 'transp'], nfe);
        const valores = pathOr("", ['nfe', 'infNFe', 'total'], nfe);
        const produtos = pathOr([], ['nfe', 'infNFe', 'det'], nfe);
        const pagamento = pathOr([], ['nfe', 'infNFe', 'pag'], nfe);
        const dadosAdc = pathOr("", ['nfe', 'infNFe', 'infAdic'], nfe);

        if (nfe !== undefined) {
            return (
                <div>
                    <div className="mt-1">
                        <Nav tabs>
                            <NavItem>
                                <NavLink className={classnames({ active: this.state.activeTab === 'SituacaoDocumento' })} onClick={() => { this.toggle('SituacaoDocumento'); }}>
                                    Situação Documento
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={classnames({ active: this.state.activeTab === 'Identificacao' })} onClick={() => { this.toggle('Identificacao'); }}>
                                    Identificação
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={classnames({ active: this.state.activeTab === 'Emitente' })} onClick={() => { this.toggle('Emitente'); }}>
                                    Emitente
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={classnames({ active: this.state.activeTab === 'Destinatario' })} onClick={() => { this.toggle('Destinatario'); }}>
                                    Destinatário
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={classnames({ active: this.state.activeTab === 'Transportadora' })} onClick={() => { this.toggle('Transportadora'); }}>
                                    Transportadora
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={classnames({ active: this.state.activeTab === 'Produtos' })} onClick={() => { this.toggle('Produtos'); }}>
                                    Produtos
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={classnames({ active: this.state.activeTab === 'Impostos' })} onClick={() => { this.toggle('Impostos'); }}>
                                    Impostos
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={classnames({ active: this.state.activeTab === 'Pagamento' })} onClick={() => { this.toggle('Pagamento'); }}>
                                    Pagamento
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={classnames({ active: this.state.activeTab === 'DadosAdicionais' })} onClick={() => { this.toggle('DadosAdicionais') }}>
                                    Dados Adicionais
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                            {this.renderSituacaoDocumento(documentoFiscal)}
                            <TabPane tabId="Identificacao" >
                                <div className="card mt-1">
                                    <div className="card-header">
                                        <h4>Identificação</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <b className="col-sm-2">Código IBGE</b>
                                            <span className="col-sm-9">{identificacao.cuf}</span>
                                        </div>
                                        <div className="row">
                                            <b className="col-sm-2">Natureza de Operação</b>
                                            <span className="col-sm-9">{identificacao.natOp}</span>
                                        </div>
                                        <div className="row">
                                            <b className="col-sm-2">Modelo</b>
                                            <span className="col-sm-9">{identificacao.mod}</span>
                                        </div>
                                        <div className="row" >
                                            <b className="col-sm-2">Série</b>
                                            <span className="col-sm-9">{identificacao.serie}</span>
                                        </div>
                                        <div className="row" >
                                            <b className="col-sm-2">Número</b>
                                            <span className="col-sm-9">{identificacao.nnf}</span>
                                        </div>
                                        <div className="row" >
                                            <b className="col-sm-2">Tipo de Documento Fiscal</b>
                                            <span className="col-sm-9">{identificacao.tpNF}</span>
                                        </div>
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tabId="Emitente">
                                <div className="card mt-1">
                                    <div className="card-header">
                                        <h4>Emitente</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="row" >
                                            <b className="col-sm-2">CNPJ</b>
                                            <span className="col-sm-9">{emitente.cnpj === null ? '' : emitente.cnpj}</span>
                                        </div>
                                        <div className="row" >
                                            <b className="col-sm-2">Nome</b>
                                            <span className="col-sm-9">{emitente.xnome}</span>
                                        </div>
                                        <div className="row" >
                                            <b className="col-sm-2">Endereço</b>
                                            <span className="col-sm-9">{
                                                `${emitente.enderEmit.xlgr === null ? '' : emitente.enderEmit.xlgr}
                                                ${emitente.enderEmit.nro} 
                                                ${emitente.enderEmit.xcpl === null ? '' : emitente.enderEmit.xcpl} 
                                                ${emitente.enderEmit.xbairro} 
                                                ${emitente.enderEmit.xmun}
                                                ${emitente.enderEmit.uf}
                                                ${emitente.enderEmit.xpais}`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tabId="Destinatario">
                                <div className="card mt-1">
                                    <div className="card-header">
                                        <h4>Destinatário</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <b className="col-sm-2">CPF/CNPJ</b>
                                            <span className="col-sm-9">{destinatario.cnpj === null ? '' : destinatario.cnpj}</span>
                                        </div>
                                        <div className="row">
                                            <b className="col-sm-2">Nome</b>
                                            <span className="col-sm-9">{destinatario.xnome}</span>
                                        </div>
                                        <div className="row">
                                            <b className="col-sm-2">Endereço</b>
                                            <span className="col-sm-9">{
                                                `${destinatario.enderDest.xlgr} 
                                                ${destinatario.enderDest.nro}
                                                ${destinatario.enderDest.xcpl = isNullOrUndefined ? '' : destinatario.enderDest.xcpl}
                                                ${destinatario.enderDest.xbairro} 
                                                ${destinatario.enderDest.xmun}
                                                ${destinatario.enderDest.uf}
                                                ${destinatario.enderDest.xpais} `}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tabId="Transportadora">
                                <div className="card mt-1">
                                    <div className="card-header">
                                        <h4>Transportadora</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <b className="col-sm-2">Transportadora</b>
                                            <span className="col-sm-9">{`${transp.transporta !== null ?
                                                `${transp.transporta.cnpj === null ? transp.transporta.cpf : transp.transporta.cnpj} 
                                                - ${transp.transporta.xnome === null ? '' : transp.transporta.xnome}
                                                ${transp.transporta.ie === null ? '' : transp.transporta.ie}
                                                ${transp.transporta.xender === null ? '' : transp.transporta.xender}
                                                ${transp.transporta.xmun === null ? '' : transp.transporta.xmun}
                                                ${transp.transporta.uf === null ? '' : transp.transporta.uf}
                                            ` : ''}`}</span>
                                        </div>
                                        <div className="row">
                                            <b className="col-sm-2">Frete</b>
                                            <span className="col-sm-9">{transp.modFrete}</span>
                                        </div>
                                        <div className="row">
                                            <b className="col-sm-2">Veículo</b>
                                            <span className="col-sm-9">{transp.veicTransp}</span>
                                        </div>
                                        <div className="row">
                                            <b className="col-sm-2">Retorno</b>
                                            <span className="col-sm-9">{transp.retTransp}</span>
                                        </div>
                                        <div className="row">
                                            <b className="col-sm-2">Reboque</b>
                                            <span className="col-sm-9">{transp.reboque}</span>
                                        </div>
                                        <div className="row">
                                            <b className="col-sm-2">Vagão</b>
                                            <span className="col-sm-9">{transp.vagao}</span>
                                        </div>
                                        <div className="row">
                                            <b className="col-sm-2">Balsa</b>
                                            <span className="col-sm-9">{transp.balsa}</span>
                                        </div>
                                        <div className="row">
                                            <b className="col-sm-1">Volume:</b>
                                            {this.renderTranspVol(transp)}
                                        </div>
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tabId="Produtos">
                                <div className="card mt-1">
                                    <div className="card-header">
                                        <h4>Produtos</h4>
                                    </div>
                                    <div className="card-body">
                                        {this.renderProdutos(produtos)}
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tabId="Impostos">
                                <div className="card mt-1">
                                    <div className="card-header">
                                        <h4>Impostos</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-sm border text-nowrap">
                                                <b>B.CÁLC. ICMS</b>
                                                <div className="text-right">{formatMoney(valores.icmstot.vbc)}</div>
                                            </div>
                                            <div className="col-sm border text-nowrap">
                                                <b>VALOR ICMS</b>
                                                <div className="text-right">{formatMoney(valores.icmstot.vicms)}</div>
                                            </div>
                                            <div className="col-sm border text-nowrap">
                                                <b>B.CÁLC. ICMS S.T.</b>
                                                <div className="text-right">{formatMoney(valores.icmstot.vbcst)}</div>
                                            </div>
                                            <div className="col-sm border text-nowrap">
                                                <b>V. ICMS SUBST.</b>
                                                <div className="text-right">{formatMoney(valores.icmstot.vbcst)}</div>
                                            </div>
                                            <div className="col-sm border text-nowrap">
                                                <b>V. IMP. IMPORTAÇÃO</b>
                                                <div className="text-right">{formatMoney(valores.icmstot.vii)}</div>
                                            </div>
                                            <div className="col-sm border text-nowrap">
                                                <b>VALOR DO FCP</b>
                                                <div className="text-right">{formatMoney(valores.icmstot.vfcp)}</div>
                                            </div><div className="col-sm border text-nowrap">
                                                <b>VALOR DO PIS</b><div className="text-right">{formatMoney(valores.icmstot.vpis)}</div>
                                            </div>
                                            <div className="col-sm border text-nowrap"><b>V. TOTAL PRODUTOS</b>
                                                <div className="text-right">{formatMoney(valores.icmstot.vprod)}</div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm border text-nowrap">
                                                <b>VALOR DO FRETE</b>
                                                <div className="text-right">{formatMoney(valores.icmstot.vfrete)}</div>
                                            </div>
                                            <div className="col-sm border text-nowrap">
                                                <b>VALOR DO SEGURO</b>
                                                <div className="text-right">{formatMoney(valores.icmstot.vseg)}</div>
                                            </div>
                                            <div className="col-sm border text-nowrap">
                                                <b>DESCONTO</b>
                                                <div className="text-right">{formatMoney(valores.icmstot.vdesc)}</div>
                                            </div>
                                            <div className="col-sm border text-nowrap">
                                                <b>OUTRAS DESPESAS</b>
                                                <div className="text-right">{formatMoney(valores.icmstot.voutro)}</div>
                                            </div>
                                            <div className="col-sm border text-nowrap">
                                                <b>VALOR TOTAL IPI</b>
                                                <div className="text-right">{formatMoney(valores.icmstot.vipi)}</div>
                                            </div>
                                            <div className="col-sm border text-nowrap">
                                                <b>V. TOT. TRIB.</b>
                                                <div className="text-right">{formatMoney(valores.icmstot.vtotTrib)}</div>
                                            </div>
                                            <div className="col-sm border text-nowrap">
                                                <b>VALOR DA COFINS</b>
                                                <div className="text-right">{formatMoney(valores.icmstot.vcofins)}</div>
                                            </div><div className="col-sm border text-nowrap">
                                                <b>V. TOTAL DA NOTA</b>
                                                <div className="text-right">{formatMoney(valores.icmstot.vnf)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tabId="Pagamento">
                                <div className="card mt-1">
                                    <div className="card-header">
                                        <h4>Pagamento</h4>
                                    </div>
                                    <div className="card-body">
                                        <div>
                                            {this.renderPagto(pagamento)}
                                        </div>
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tabId="DadosAdicionais">
                                <div className="card mt-1">
                                    <div className="card-header">
                                        <h4>Informações Adicionais</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <b className="col-sm-2">Informação Complementar</b>
                                            <span className="col-sm-9">{dadosAdc.infCpl}</span>
                                        </div>
                                    </div>
                                </div>
                            </TabPane>
                        </TabContent>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    {this.renderNfeUndefined(documentoFiscal)}
                </div>
            )
        }

    }

    renderNfeUndefined(documentoFiscal) {
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
                <div>
                    <div className="card mt-1">
                        <div className="card-header">
                            <h4>Situação Documento</h4>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <b className="col-sm-2">Chave de Acesso</b>
                                <span className="col-sm-9">{documentoFiscal.chaveAcesso}</span>
                            </div>
                            <div className="row">
                                <b className="col-sm-2">Data de Recebimento</b>
                                <span className="col-sm-9">{documentoFiscal.dataHoraRegStr}</span>
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
                            <div className="row">
                                <b className="col-sm-2">Tipo Manifestação</b>
                                <span className="col-sm-9">{TipoEventoManifestacaoEnum[documentoFiscal.manifestado]}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </TabPane>
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


}

export default documentoManifestacao