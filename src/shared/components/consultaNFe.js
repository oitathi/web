import React, { Component } from 'react'
import NFe from './nfe/documentoFiscal/NFe';
import Menu from './menu';

class ConsultaNFe extends Component {

    render() {
        return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <NFe />
                </div>
            </div>
        );
    }

}

export default ConsultaNFe