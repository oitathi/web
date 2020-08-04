import React, { Component } from 'react';
import DocumentoEpec from './documentoEpec/DocumentoEpec';
import Menu from '../menu';

class DocumentoEpecInit extends Component {
    render() {
        return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <DocumentoEpec />
                </div>
            </div>
        )
    }
}

export default DocumentoEpecInit