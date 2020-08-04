import React, { Component } from 'react'
import { 
	Modal, 
    ModalHeader, 
    ModalBody, 
	Spinner 
} from 'reactstrap';

class Loading extends Component{

	render(){
		 return (
            <div >
                <Modal isOpen={true} centered >
                    <ModalHeader>Carregando...</ModalHeader>
                    <ModalBody >
                        <div align='center' className="mt-2 mb-2">
                            <Spinner style={{ width: '4rem', height: '4rem' }} color="dark" />
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        )
    }


}export default Loading;