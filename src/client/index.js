import React from 'react';
import ReactDOM from 'react-dom';

import NFeInit from '../shared/components/nfe/NFeInit';
import NFe from '../shared/components/nfe/nfe/nfe';
import NFeEldocInit from '../shared/components/nfe/NFeEldocInit'
import NFeEldoc from '../shared/components/nfe/nfeEldoc/nfeEldoc'
import ManifestacaoInit from '../shared/components/nfe/ManifestacaoInit';
import IncluirDocumentoInit from '../shared/components/nfe/IncluirDocumentoInit'
import ListaManifestacao from '../shared/components/nfe/manifestacao/listaManifestacao';
import DocumentoManifestacao from '../shared/components/nfe/manifestacao/documentoManifestacao';
import ManifestacaoMassiva from '../shared/components/nfe/manifestacao/manifestacaoMassiva';
import Manifestar from '../shared/components/nfe/manifestacao/manifestar';
import CancelamentoNFeInit from '../shared/components/nfe/CancelamentoInit';
import CartaCorrecaoInit from '../shared/components/nfe/CartaCorrecaoInit';
import InutilizacaoChaveInit from '../shared/components/nfe/InutilizacaoChaveInit';
import InutilizacaoFaixaInit from '../shared/components/nfe/InutilizacaoFaixaInit';

import NFSeInit from '../shared/components/nfse/NFSeInit';
import NFSe from '../shared/components/nfse/nfse/nfse';
import CancelamentoNFSeInit from '../shared/components/nfse/CancelamentoInit';

import DashboardInit from '../shared/components/monitoria/DashboardInit';
import DocumentoEpecInit from '../shared/components/monitoria/DocumentoEpecInit';
import InterfaceEventoInit from '../shared/components/monitoria/InterfaceEventoInit';
import InterfaceEvento from '../shared/components/monitoria/interfaceEvento/InterfaceEvento';
import MonitoriaLoteInit from '../shared/components/monitoria/MonitoriaLoteInit';

import DownloadDanfeInit from '../shared/components/ferramentas/DownloadDanfeInit';
import DownloadDanfe from '../shared/components/ferramentas/downloadDanfe/DownloadDanfe';
import DownloadXMLInit from '../shared/components/ferramentas/DownloadXMLInit';
import DownloadXML from '../shared/components/ferramentas/downloadXML/DownloadXML';

import CertificadoDigitalInit from '../shared/components/configuracao/CertificadoDigitalInit';
import CertificadoDigital from '../shared/components/configuracao/certificadoDigital/CertificadoDigital';
import CodigoRetornoAutorizadorInit from '../shared/components/configuracao/CodigoRetornoAutorizadorInit';
import CodigoRetornoAutorizador from '../shared/components/configuracao/codigoRetornoAutorizador/CodigoRetornoAutorizador';
import EmissorRaizFilialInit from '../shared/components/configuracao/EmissorRaizFilialInit';
import EmissorRaizFilial from '../shared/components/configuracao/emissorRaizFilial/EmissorRaizFilial';
import EmissorRaizInit from '../shared/components/configuracao/EmissorRaizInit';
import EmissorRaiz from '../shared/components/configuracao/emissorRaiz/EmissorRaiz';
import EstadoConfiguracaoInit from '../shared/components/configuracao/EstadoConfiguracaoInit';
import EstadoConfiguracao from '../shared/components/configuracao/estadoConfiguracao/EstadoConfiguracao';
import EstadoTipoEmissaoInit from '../shared/components/configuracao/EstadoTipoEmissaoInit';
import EstadoTipoEmissao from '../shared/components/configuracao/estadoTipoEmissao/EstadoTipoEmissao';
import ImpressoraInit from '../shared/components/configuracao/ImpressoraInit';
import Impressora from '../shared/components/configuracao/impressora/Impressora';
import MunicipioConfiguracaoInit from '../shared/components/configuracao/MunicipioConfiguracaoInit';
import MunicipioConfiguracao from '../shared/components/configuracao/municipioConfiguracao/MunicipioConfiguracao';
import ParametrosInfraInit from '../shared/components/configuracao/ParametrosInfraInit';
import ParametroInfra from '../shared/components/configuracao/parametrosInfra/ParametroInfra';
import ResponsavelTecnicoInit from '../shared/components/configuracao/ResponsavelTecnicoInit';
import ResponsavelTecnico from '../shared/components/configuracao/responsavelTecnico/ResponsavelTecnico';
import TiposEmissaoInit from '../shared/components/configuracao/TiposEmissaoInit';

import Health from '../shared/components/health';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-datepicker/dist/react-datepicker.css';

import PrivateRoute from '../shared/components/PrivateRoute';
import ShowDocument from '../shared/components/nfe/ShowDocument';
import ShowPdfDocument from '../shared/components/nfe/ShowPdfDocument';



ReactDOM.render(
    <Router>
        <Switch>
            <Route exact path="/" component={NFeEldocInit} />

            <Route exact path="/NFeInit" component={NFeInit} />
            <Route exact path="/NFe" component={NFe} />
            <PrivateRoute exact path="/cancelamento" component={CancelamentoNFeInit} />
            <PrivateRoute exact path="/cartaCorrecao" component={CartaCorrecaoInit} />
            <PrivateRoute exact path="/inutilizacaoChave" component={InutilizacaoChaveInit} />
            <PrivateRoute exact path="/inutilizacaoFaixa" component={InutilizacaoFaixaInit} />
            <PrivateRoute exact path="/manifestacaoInit" component={ManifestacaoInit} />
            <PrivateRoute exact path="/manifestacao" component={ListaManifestacao} />
            <PrivateRoute exact path="/manifestar" component={Manifestar} />
            <PrivateRoute exact path="/documentoManifestacao" component={DocumentoManifestacao} />
            <PrivateRoute exact path="/manifestacaoMassiva" component={ManifestacaoMassiva} />
            <PrivateRoute exact path="/incluirDocumentoInit" component={IncluirDocumentoInit} />

            <Route exact path="/nfeEldocInit" component={NFeEldocInit} />
            <Route exact path="/NFeEldoc" component={NFeEldoc} />
            
            <Route exact path="/NFSeInit" component={NFSeInit} />
            <Route exact path="/NFSe" component={NFSe} />
            <Route exact path="/cancelamento" component={CancelamentoNFSeInit} />

            <Route exact path="/dashboard" component={DashboardInit} />
            <Route exact path="/documentoEpecInit" component={DocumentoEpecInit} />
            <Route exact path="/interfaceEventoInit" component={InterfaceEventoInit} />
            <Route exact path="/interfaceEvento" component={InterfaceEvento} />
            <Route exact path="/monitoriaLote" component={MonitoriaLoteInit} />

            <Route exact path="/downloadDanfeInit" component={DownloadDanfeInit} />
            <Route exact path="/downloadDanfe" component={DownloadDanfe} />
            <Route exact path="/downloadXMLInit" component={DownloadXMLInit} />
            <Route exact path="/downloadXML" component={DownloadXML} />

            <Route exact path="/certificadoDigitalInit" component={CertificadoDigitalInit} />
            <Route exact path="/certificadoDigital" component={CertificadoDigital} />
            <Route exact path="/codigoRetornoAutorizadorInit" component={CodigoRetornoAutorizadorInit} />
            <Route exact path="/codigoRetornoAutorizador" component={CodigoRetornoAutorizador} />
            <Route exact path="/emissorRaizInit" component={EmissorRaizInit} />
            <Route exact path="/emissorRaiz" component={EmissorRaiz} />
            <Route exact path="/emissorRaizFilialInit" component={EmissorRaizFilialInit} />
            <Route exact path="/emissorRaizFilial" component={EmissorRaizFilial} />
            <Route exact path="/estadoConfiguracaoInit" component={EstadoConfiguracaoInit} />
            <Route exact path="/estadoConfiguracao" component={EstadoConfiguracao} />
            <Route exact path="/estadoTipoEmissaoInit" component={EstadoTipoEmissaoInit} />
            <Route exact path="/estadoTipoEmissao" component={EstadoTipoEmissao} />
            <Route exact path="/impressoras" component={ImpressoraInit} />
            <Route exact path="/impressora" component={Impressora} />
            <Route exact path="/municipioConfiguracaoInit" component={MunicipioConfiguracaoInit} />
            <Route exact path="/municipioConfiguracao" component={MunicipioConfiguracao} />
            <Route exact path="/parametrosInfraInit" component={ParametrosInfraInit} />
            <Route exact path="/parametrosInfra" component={ParametroInfra} />
            <Route exact path="/responsavelTecnicoInit" component={ResponsavelTecnicoInit} />
            <Route exact path="/responsavelTecnico" component={ResponsavelTecnico} />
            <Route exact path="/tiposEmissao" component={TiposEmissaoInit} />

            <Route exact path="/health" component={Health} />
            <Route exact path="/showDocument" component={ShowDocument} />
            <Route exact path="/showPdfDocument" component={ShowPdfDocument} />

        </Switch>
    </Router>,
    document.getElementById('root')
);
