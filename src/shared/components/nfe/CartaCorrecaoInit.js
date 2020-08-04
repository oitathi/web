import React, { Component } from 'react';
import CartaCorrecaoChave from './cartaCorrecao/cartaCorrecaoChave';
import Menu from '../menu';

class CartaCorrecaoInit extends Component {
    render() {
        return (
            <div>
                <div>
                    <Menu />
                </div>
                <div className="container-fluid px-5">
                    <CartaCorrecaoChave />
                </div>
            </div>
        );
    }

}

export default CartaCorrecaoInit