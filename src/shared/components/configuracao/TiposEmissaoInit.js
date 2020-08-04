import React, { Component } from 'react';
import ListaTipoEmissao from './tipoEmissao/ListaTipoEmissao';
import Menu from '../menu';

class TiposEmissaoInit extends Component {
    render() {
        return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <ListaTipoEmissao />
                </div>
            </div>
        );
    }

}

export default TiposEmissaoInit