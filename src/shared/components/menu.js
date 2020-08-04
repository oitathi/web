import React, { Component } from 'react';
import { getCookie, removeCookie } from '../helpers/cookie';
import {
    COOKIE_USER_ID,
    COOKIE_USER_TOKEN,
    COOKIE_USER_NAME
} from '../helpers/parameters';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';
import { faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isForbidden } from '../helpers/isForbidden';

class Menu extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false,
            desabilita: false
        };
    }

    componentDidMount() {
        this.setState({
            desabilita: isForbidden()
        });
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return (
            <div>
                {this.renderMenu()}
            </div>
        );
    }

    renderMenu() {
        return (
            <div>
                <Navbar color="dark" dark expand="md">
                    <NavbarBrand href="/"><FontAwesomeIcon icon={faFileInvoiceDollar} /> Fazemu</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>

                            <UncontrolledDropdown inNavbar>
                                <DropdownToggle nav caret>NFe</DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem href="/nfeInit">NFe</DropdownItem>
                                    <DropdownItem href="/cancelamento" disabled={this.state.desabilita}>Cancelamento</DropdownItem>
                                    <DropdownItem href="/cartaCorrecao" disabled={this.state.desabilita}>Carta de Correção</DropdownItem>
                                    <DropdownItem href="/inutilizacaoChave" disabled={this.state.desabilita}>Inutilização - Chave de Acesso</DropdownItem>
                                    <DropdownItem href="/inutilizacaoFaixa" disabled={this.state.desabilita}>Inutilização - Faixa de Números</DropdownItem>
                                    <DropdownItem href="/manifestacaoInit" disabled={this.state.desabilita}>Manifestação</DropdownItem>
                                    <DropdownItem href="/incluirDocumentoInit" disabled={this.state.desabilita}>Incluir Documento</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>

                              <UncontrolledDropdown inNavbar>
                                <DropdownToggle nav caret>NFe Eldoc</DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem href="/nfeEldocInit">NFe Eldoc</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>

                           <UncontrolledDropdown inNavbar>
                                <DropdownToggle nav caret>NFSe</DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem href="/nfseInit">NFSe</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>

                            <UncontrolledDropdown inNavbar>
                                <DropdownToggle nav caret>Monitoria</DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem href="/dashboard">Dashboard</DropdownItem>
                                    <DropdownItem href="/documentoEpecInit">Documento Epec</DropdownItem>
                                    <DropdownItem href="/interfaceEventoInit">Interface Evento</DropdownItem>
                                    <DropdownItem href="/monitoriaLote">Monitoria Lote</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>

                            <UncontrolledDropdown inNavbar>
                                <DropdownToggle nav caret>Ferramentas</DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem href="/downloadDanfeInit">Download DANFE</DropdownItem>
                                    <DropdownItem href="/downloadXMLInit">Download XML</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>

                            <UncontrolledDropdown inNavbar>
                                <DropdownToggle nav caret disabled={this.state.desabilita}>Configurações</DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem href="/certificadoDigitalInit">Certificado Digital</DropdownItem>
                                    <DropdownItem href="/codigoRetornoAutorizadorInit">Código Retorno Autorizador</DropdownItem>
                                    <DropdownItem href="/emissorRaizInit">Emissores</DropdownItem>
                                    <DropdownItem href="/emissorRaizFilialInit">Emissor Raiz Filial</DropdownItem>
                                    <DropdownItem href="/estadoConfiguracaoInit">Estado / Configuração</DropdownItem>
                                    <DropdownItem href="/estadoTipoEmissaoInit">Estado / Tipo Emissão</DropdownItem>
                                    <DropdownItem href="/impressoras">Impressora</DropdownItem>
                                    <DropdownItem href="/municipioConfiguracaoInit">Municipio / Configuração</DropdownItem>
                                    <DropdownItem href="/parametrosInfraInit">Parâmetros</DropdownItem>
                                    <DropdownItem href="/responsavelTecnicoInit">Responsável Técnico</DropdownItem>
                                    <DropdownItem href="/tiposEmissao">Tipo Emissão</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                            <UncontrolledDropdown inNavbar>
                                <DropdownToggle nav caret>{getCookie(COOKIE_USER_NAME)}</DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem onClick={() => removeCookie(COOKIE_USER_ID, COOKIE_USER_TOKEN)} href="/">Sair</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}

export default Menu;
