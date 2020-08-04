import React, { Component } from 'react';
import axiosAuth from '../../helpers/axios-auth';
import { getConfig } from '../../helpers/axios-config';
import Highlight from 'react-highlight'
import Menu from '../menu';
import { Link } from 'react-router-dom';
import {Button, Alert} from 'reactstrap';


const config = require('config');

class ShowDocument extends Component {

	constructor(props) {
		super(props)
		const chaveAcesso =  this.props.location.chaveAcesso;
		const previous = this.props.location.previous;

		this.state = {
			chaveAcesso: chaveAcesso,
			previous: previous,
            documento:'',
            temErro: false,
			alert: {
                visible: false,
                message: "Documento não encontrado",
                level: "danger"
            }
		}

		this.getDocumento= this.getDocumento.bind(this);

		
	}

	componentDidMount() {
        this.getDocumento();
    }

	render(){
		return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="form-group">
                            <div className="form">
                            	<Link to={this.state.previous}><Button color="danger" size="sm">Voltar</Button></Link>
							</div>
                        </div>
                        {this.renderAlert()}
                        {this.renderXml()}
                    </div>
                </div>
            </div>
        )
    }

    renderAlert() {
        return (
            <Alert color={this.state.alert.level} isOpen={this.state.alert.visible} toggle={this.onDismiss}>
                {this.state.alert.message}
            </Alert>
        )
    }
	
	renderXml(){
		const xml = this.state.documento;
		if(!this.state.temErro){
			return (
				<div>
					<Highlight className='xml'>{xml}</Highlight>
				</div>
			)
		}
	}
	
	 getDocumento(){
		let chaveAcesso = this.state.chaveAcesso;
		const url = `${config.endpoint['fazemu-nfe']}/nfe/${chaveAcesso}/xml`;
		axiosAuth.get(url, getConfig())
         .then(response => {
              this.setState({
					documento: response.data,
				})
            }).catch(response => {
				this.setState({
					temErro:true,
					alert: {
                		visible: true,
                		message: "Documento não encontrado",
                		level: "danger"
            		}
				})
            });
    }



}export default ShowDocument