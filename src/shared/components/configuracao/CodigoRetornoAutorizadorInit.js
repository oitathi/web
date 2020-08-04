import React, { Component } from 'react';
import ListaCodigoRetornoAutorizador from './codigoRetornoAutorizador/ListaCodigoRetornoAutorizador';
import Menu from '../menu';

class CodigoRetornoAutorizadorInit extends Component {
    render() {
        return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <ListaCodigoRetornoAutorizador />
                </div>
            </div>
        );
    }

}

export default CodigoRetornoAutorizadorInit