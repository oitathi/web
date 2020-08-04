import React, { Component } from 'react';
import ListaEmissorRaiz from './emissorRaiz/ListaEmissorRaiz';
import Menu from '../menu';

class EmissorRaizInit extends Component {
    render() {
        return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <ListaEmissorRaiz />
                </div>
            </div>
        );
    }
}export default EmissorRaizInit