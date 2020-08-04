import React, { Component } from 'react';
import InutilizacaoChave from './inutilizacao/inutilizacaoChave';
import Menu from '../menu';

class InutilizacaoChaveInit extends Component {
    render() {
        return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <InutilizacaoChave />
                </div>
            </div>
        );
    }

}

export default InutilizacaoChaveInit