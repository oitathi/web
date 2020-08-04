import React, { Component } from 'react';
import ListaEstadoTipoEmissao from './estadoTipoEmissao/ListaEstadoTipoEmissao';
import Menu from '../menu';

class EstadoTipoEmissaoInit extends Component {
    render() {
        return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <ListaEstadoTipoEmissao />
                </div>
            </div>
        );
    }

}

export default EstadoTipoEmissaoInit