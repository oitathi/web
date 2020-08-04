import React, { Component } from 'react';
import Dashboard from './dashboard/Dashboard';
import Menu from '../menu';

class DashboardInit extends Component {
    render() {
        return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <Dashboard />
                </div>
            </div>
        )
    }
}

export default DashboardInit