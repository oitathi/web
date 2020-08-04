import React, { Component } from 'react';
import ListaEstadoConfiguracao from './estadoConfiguracao/ListaEstadoConfiguracao';
import Menu from '../menu';

class EstadoConfiguracaoInit extends Component {
    render() {
        return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <ListaEstadoConfiguracao />
                </div>
            </div>
        );
    }

}

export default EstadoConfiguracaoInit