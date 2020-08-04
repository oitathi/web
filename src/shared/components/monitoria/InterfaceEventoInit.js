import React, { Component } from 'react';
import InterfaceEvento from './interfaceEvento/InterfaceEvento';
import Menu from '../menu';

class InterfaceEventoInit extends Component {

    render() {
        return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <InterfaceEvento />
                </div>
            </div>
        );
    }

}

export default InterfaceEventoInit