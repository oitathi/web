import React, { Component } from 'react';
import MonitoriaLote from './monitoriaLote/MonitoriaLote';
import Menu from '../menu';


class MonitoriaLoteInit extends Component {
    render() {
        return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <MonitoriaLote />
                </div>
            </div>
        )
    }
}

export default MonitoriaLoteInit