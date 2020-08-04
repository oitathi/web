import React from 'react';
import axiosAuth from '../../../helpers/axios-auth';
import { getConfig } from '../../../helpers/axios-config';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Table
} from 'reactstrap';
import { pathOr } from 'ramda';
import SituacaoEnum from '../../../helpers/situacaoEnum';
import MetodoEnum from '../../../helpers/metodoEnum';
import TipoServicoEnum from '../../../helpers/tipoServicoEnum';
import moment from 'moment';

const config = require('config');

class InterfaceEvento extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };

        this.toggle = this.toggle.bind(this);
    }

    componentDidMount() {
        const documentoFiscal = this.props.documentoFiscal;
        this.getInterfaceEvento(documentoFiscal);
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    getInterfaceEvento = (documentoFiscal) => {
        const chaveAcesso = "chaveAcesso=" + documentoFiscal.chaveAcesso;
        const url = `${config.endpoint['fazemu-nfe']}/interfaceEvento?${chaveAcesso}`;

        axiosAuth.get(url, getConfig())
            .then(response => {
                this.setState({ InterfaceEvento: response.data })
            }).catch(error => {
                console.log("error", { error })
                return null;
            });

    };

    render() {
        const InterfaceEvento = pathOr([], ['InterfaceEvento'], this.state)
        const rows = []

        InterfaceEvento.map((inev, key) => {
            rows.push(
                <tr key={key}>
                    <th className="text-center">{inev.idEvento}</th>
                    <td className="text-center">{inev.idSistema}</td>
                    <td className="text-center">{MetodoEnum[inev.idMetodo]}</td>
                    <td className="text-center">{TipoServicoEnum[inev.tipoServico]}</td>
                    <td className="text-center">{SituacaoEnum[inev.situacao]}</td>
                    <td className="text-nowrap">{moment(inev.dataHoraRegistro).format("DD/MM/YYYY HH:mm:ss")}</td>
                    <td className="text-nowrap">{moment(inev.dataHora).format("DD/MM/YYYY HH:mm:ss")}</td>
                </tr>
            )
        })

        return (
            <span>
                <div className="btn-group" role="group" aria-label="Basic example">
                    <Button id="btnInterfaceEvento" className="btn btn-secondary" size="sm" color="info" onClick={this.toggle}>Interface Evento</Button>
                </div>
                <Modal size="xl" className="modal fade bd-example-modal-lg" isOpen={this.state.modal} fade={false} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Interface Evento</ModalHeader>
                    <ModalBody >
                        <Table striped>
                            <thead >
                                <tr>
                                <th className="text-center">#</th>
                                <th className="text-center">Sistema</th>
                                <th className="text-center">Retorno</th>
                                <th className="text-center">Tipo Serviço</th>
                                <th className="text-center">Situação</th>
                                <th className="text-center">Data/Hora Reg.</th>
                                <th className="text-center">Data/Hora Ult.Alt.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows}
                            </tbody>
                        </Table>
                    </ModalBody>
                </Modal>
            </span>

        );
    }
}

export default InterfaceEvento;