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
import TipoServicoEnum from '../../../helpers/tipoServicoEnum';
import PontoDocumentoEnum from '../../../helpers/pontoDocumentoEnum';

const config = require('config');

class Eventos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };

        this.toggle = this.toggle.bind(this);
    }

    componentDidMount() {
        const documentoFiscal = this.props.documentoFiscal;
        this.getEventos(documentoFiscal);
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    getEventos = (documentoFiscal) => {
        const idDocFiscal = "idDocFiscal=" + documentoFiscal.id;
        const url = `${config.endpoint['fazemu-nfse']}/documentoEvento?${idDocFiscal}`;

        axiosAuth.get(url, getConfig())
            .then(response => {
                this.setState({ eventos: response.data })
            }).catch(error => {
                console.log("error", { error })
                return null;
            });

    };

    render() {
        const eventos = pathOr([], ['eventos'], this.state)
        const rows = []

        eventos.map((evento, key) => {
            rows.push(
                <tr key={key}>
                    <th>{PontoDocumentoEnum[evento.idPonto]}</th>
                    <td className="text-center">{TipoServicoEnum[evento.tipoServico]}</td>
                    <td className="text-center">{evento.situacaoAutorizador}</td>
                    <td className="text-center">{evento.dataHora}</td>
                </tr>
            )
        })

        return (
            <span>
                <div className="btn-group" role="group" aria-label="Basic example">
                    <Button id="btneventos" className="btn btn-secondary mr-1" size="sm" onClick={this.toggle}>Eventos</Button>
                </div>
                <Modal size="lg" className="modal fade bd-example-modal-lg" isOpen={this.state.modal} fade={false} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Eventos</ModalHeader>
                    <ModalBody >
                        <Table striped>
                            <thead >
                                <tr>
                                    <th className="text-center">Evento</th>
                                    <th className="text-center">Tipo Serviço</th>
                                    <th className="text-center">Código SEFAZ</th>
                                    <th className="text-center">Data/Hora</th>
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

export default Eventos;