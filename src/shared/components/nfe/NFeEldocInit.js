import React, { Component } from 'react'
import ListaNFeEldoc from './nfeEldoc/listaNFeEldoc'
import Menu from '../menu';

class NFeEldocInit extends Component {
    render() {
        return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <ListaNFeEldoc />
                </div>
            </div>
        );
    }

}

export default NFeEldocInit