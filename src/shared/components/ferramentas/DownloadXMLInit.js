import React, { Component } from 'react';
import DownloadXML from './downloadXML/DownloadXML';
import Menu from '../menu';

class DownloadXMLInit extends Component {
    render() {
        return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <DownloadXML />
                </div>
            </div>
        );
    }

}

export default DownloadXMLInit