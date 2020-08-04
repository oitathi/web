import React, { Component } from 'react';
import InutilizacaoFaixa from './inutilizacao/inutilizacaoFaixa';
import Menu from '../menu';

class InutilizacaoFaixaInit extends Component {
    render() {
        return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <InutilizacaoFaixa />
                </div>
            </div>
        );
    }

}

export default InutilizacaoFaixaInit