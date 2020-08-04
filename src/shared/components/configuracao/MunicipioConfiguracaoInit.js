import React, { Component } from 'react';
import ListaMunicipioConfiguracao from './municipioConfiguracao/ListaMunicipioConfiguracao';
import Menu from '../menu';

class MunicipioConfiguracaoInit extends Component {
    render() {
        return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <ListaMunicipioConfiguracao />
                </div>
            </div>
        );
    }

}

export default MunicipioConfiguracaoInit