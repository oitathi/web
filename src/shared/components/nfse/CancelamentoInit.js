import React, { Component } from 'react';
import CancelamentoDados from '../nfse/cancelamento/cancelamentoDados';
import Menu from '../menu';

class CancelamentoInit extends Component {
    render() {
        return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <CancelamentoDados />
                </div>
            </div>
        );
    }

}

export default CancelamentoInit