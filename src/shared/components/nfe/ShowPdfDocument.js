import React, { Component } from 'react';
import Menu from '../menu';
import { Link } from 'react-router-dom';
import { Alert,Button} from 'reactstrap';
import axiosAuth from '../../helpers/axios-auth';
import { getConfigBlob } from '../../helpers/axios-config';
import { Document, Page } from 'react-pdf';


const config = require('config');

class ShowPdfDocument extends Component {

	constructor(props) {
		super(props)
		const chaveAcesso =  this.props.location.chaveAcesso;
		const previous = this.props.location.previous;

		this.state = {
			chaveAcesso: chaveAcesso,
			previous: previous,
			documento:'',
			numPages: null,
			pageNumber: 1,
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
	
	onDocumentLoadSuccess = ({ numPages }) => {
    	this.setState({ numPages });
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
						{this.renderPdf()}
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
	
	renderPdf(){
		const pdf= this.state.documento;
		const { pageNumber, numPages } = this.state;
		if(!this.state.temErro){
			return (
				<div>
					<Document file={pdf}  onLoadSuccess={this.onDocumentLoadSuccess}>
						<Page  scale={96/48} pageNumber={pageNumber} />
					</Document>
					<p>Page {pageNumber} of {numPages}</p>
				</div>
			)
		}
	}
	
	 getDocumento(){
		 var chaveAcesso = this.state.chaveAcesso;
		 var configuracao = getConfigBlob(null, 'multipart/form-data');
		 const url = `${config.endpoint['fazemu-nfe']}/nfe/${chaveAcesso}/danfe`;		
		 axiosAuth.get(url, configuracao)
        	.then(response => {
            	console.log("response salvar", response.data);
            	var blob = new Blob([response.data], {type: "application/pdf"});
            	var url = window.URL.createObjectURL(blob);
              	this.setState({
					documento: url,
					temErro:false
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



}export default ShowPdfDocument