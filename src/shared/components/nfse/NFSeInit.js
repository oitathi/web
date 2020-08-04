import React, { Component } from 'react'
import ListaNFSe from './nfse/listaNFSe';
import Menu from '../menu';

class NFSeInit extends Component {
    render() {
        return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <ListaNFSe />
                </div>
            </div>
        );
    }

}

export default NFSeInit