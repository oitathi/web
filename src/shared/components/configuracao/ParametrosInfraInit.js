import React, { Component } from 'react';
import ListaParametrosInfra from './parametrosInfra/ListaParametrosInfra';
import Menu from '../menu';

class ParametrosInfraInit extends Component {
    render() {
        return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <ListaParametrosInfra />
                </div>
            </div>
        );
    }

}

export default ParametrosInfraInit