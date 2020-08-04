import React, { Component } from 'react'
import ListaNFe from './nfe/listaNFe';
import Menu from '../menu';

class NFeInit extends Component {
    render() {
        return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <ListaNFe />
                </div>
            </div>
        );
    }

}

export default NFeInit