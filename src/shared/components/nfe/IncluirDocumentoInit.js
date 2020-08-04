import React, { Component } from 'react'
import Menu from '../menu';
import IncluirDocumento from './incluirDocumento/incluirDocumento'

class IncluirDocumentoInit extends Component{
	render() {
        return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <IncluirDocumento />
                </div>
            </div>
        );
    }
} 
export default IncluirDocumentoInit