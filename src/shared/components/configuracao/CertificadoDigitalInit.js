import React, { Component } from 'react';
import ListaCertificadoDigital from './certificadoDigital/ListaCertificadoDigital';
import Menu from '../menu';

class CertificadoDigitalInit extends Component {
    render() {
        return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <ListaCertificadoDigital />
                </div>
            </div>
        );
    }

}

export default CertificadoDigitalInit