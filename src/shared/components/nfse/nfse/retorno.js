import React from 'react';
import {
    Button,
} from 'reactstrap';
import TipoServicoEnum from '../../../helpers/tipoServicoEnum';

const config = require('config');

class Retorno extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            documentoRetorno: this.props.documentoRetorno
        };
    }

    componentDidMount() {
        const documentoRetorno = this.props.documentoRetorno;
        this.getXml(documentoRetorno);
    }

    getXml = (documentoRetorno) => {
        const idXml = "idXml=" + documentoRetorno.idXml;
        const url = `${config.endpoint['fazemu-nfse']}/documentoRetorno/xml?${idXml}`;

        return url;
    };

    render() {
        const { documentoRetorno } = this.state;
        if (documentoRetorno != undefined) {
            return ( 
                <span>
                    <div className="btn-group" role="group">
                        <a href={this.getXml(documentoRetorno)} target="_blank">
                            <Button className="btn btn-secondary mr-1" size="sm">{TipoServicoEnum[documentoRetorno.tipoServico]}</Button>
                        </a>
                    </div>
                </span>
            );
        }

        return null;
    }
}

export default Retorno;