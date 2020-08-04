import React, { Component } from 'react'
import Menu from '../menu';
import ListaManifestacao from './manifestacao/listaManifestacao';

class ManifestacaoInit extends Component {
    render() {
        return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <ListaManifestacao />
                </div>
            </div>
        );
    }

}

export default ManifestacaoInit