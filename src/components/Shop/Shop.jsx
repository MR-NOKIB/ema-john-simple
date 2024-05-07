/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import './Shop.css'
import Product from '../Product/Product';
import Cart from '../Cart/Cart';
import { addToDb, getShoppingCart } from '../../utilities/fakedb';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        fetch('products.json')
            .then(res => res.json())
            .then(data => setProducts(data))
    }, []);

    useEffect(() => {
        const storedCart = getShoppingCart();
        const savedCart = [];
        // step 1: get id
        for (const id in storedCart) {
            // step 2: get the product using id'
            const addedProduct = products.find(product => product.id === id);

            if (addedProduct) {
                //step 3: get the quantity of the product
                const quantity = storedCart[id]
                addedProduct.quantity = quantity;
                //  add the added product to the saved cart
                savedCart.push(addedProduct);
            }
            // step 5: set the cart
            setCart(savedCart); 

        }
    }, [products]);

    const handelAddToCart = (product) => {
        let newCart = [];
        // const newCart = [...cart, product];
        const exist = cart.find(pd => pd.id === product.id);
        if(!exist){
            product.quantity = 1;
            newCart = [...cart, product]
        }
        else{
            exist.quantity = exist.quantity + 1;
            const remaining = cart.filter(pd => pd.id !== product.id);
            newCart = [...remaining, exist];
        }
        setCart(newCart)
        addToDb(product.id)
    }

    return (
        <div className='shop-container'>
            <div className="product-container">
                {
                    products.map(product => <Product
                        handelAddToCart={handelAddToCart}
                        product={product}
                        key={product.id}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart cart={cart}></Cart>
            </div>
        </div>
    );
};

export default Shop;