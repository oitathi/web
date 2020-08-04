import React, { Component } from 'react';
import Menu from '../menu';
import ListaResponsavelTecnico from './responsavelTecnico/ListaResponsavelTecnico';

class ResponsavelTecnicoInit extends Component {
    render() {
        return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <ListaResponsavelTecnico />
                </div>
            </div>
        );
    }

}

export default ResponsavelTecnicoInit