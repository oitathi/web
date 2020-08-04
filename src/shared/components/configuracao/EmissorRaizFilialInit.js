import React, { Component } from 'react';
import ListaEmissorRaizFilial from './emissorRaizFilial/ListaEmissorRaizFilial';
import Menu from '../menu';

class EmissorRaizFilialInit extends Component {
	 render() {
        return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <ListaEmissorRaizFilial />
                </div>
            </div>
        );
    }
}export default EmissorRaizFilialInit