import React, { Component } from 'react';
import ListaImpressora from './impressora/ListaImpressora';
import Menu from '../menu';

class ImpressoraInit extends Component {
    render() {
        return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <ListaImpressora />
                </div>
            </div>
        );
    }

}

export default ImpressoraInit