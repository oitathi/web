import React, { Component } from 'react';
import CancelamentoChave from '../nfe/cancelamento/cancelamentoChave';
import Menu from '../menu';

class CancelamentoInit extends Component {
    render() {
        return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <CancelamentoChave />
                </div>
            </div>
        );
    }

}

export default CancelamentoInit