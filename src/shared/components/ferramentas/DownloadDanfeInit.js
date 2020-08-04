import React, { Component } from 'react';
import DownloadDanfe from './downloadDanfe/DownloadDanfe';
import Menu from '../menu';

class DownloadDanfeInit extends Component {
    render() {
        return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <DownloadDanfe />
                </div>
            </div>
        );
    }

}

export default DownloadDanfeInit