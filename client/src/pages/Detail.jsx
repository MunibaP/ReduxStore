import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import Cart from '../components/Cart';
import { useSelector, useDispatch } from 'react-redux';
import {
  removeFromCart,
  updateCartQuantity,
  addToCart,
  updateProducts,
} from '../utils/storeSlice';
import { QUERY_PRODUCTS } from '../utils/queries';
import { idbPromise } from '../utils/helpers';
import spinner from '../assets/spinner.gif';

function Detail() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [currentProduct, setCurrentProduct] = useState({});

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  const { products, cart } = useSelector((state) => state.store);
  // const products = useSelector(state => state.products.items);
  // const cart = useSelector(state => state.cart.items);

  useEffect(() => {
    // already in global store
    if (products.length) {
      setCurrentProduct(products.find((product) => product._id === id));
    }
    // retrieved from server
    else if (data) {
      dispatch(updateProducts({products: products}));

      data.products.forEach(product => {
        idbPromise('products', 'put', product);
      });
    }
    // get cache from idb
    else if (!loading) {
      idbPromise('products', 'get').then((indexedProducts) => {
        dispatch(updateProducts({products: indexedProducts}));
      });
    }
  }, [products, data, loading, dispatch, id]);

  const addToCartRedux = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === id);
    if (itemInCart) {
      dispatch(updateCartQuantity({
        _id: id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
      }));

      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
      });

    } else {
      dispatch(addToCart({product: { ...currentProduct, purchaseQuantity: 1 }}));
      idbPromise('cart', 'put', { ...currentProduct, purchaseQuantity: 1 });
    }
  };

  const removeFromCartRedux = () => {
    dispatch(removeFromCart({_id: currentProduct._id}));

    idbPromise('cart', 'delete', { ...currentProduct });
  };

  return (
    <>
      {currentProduct && cart ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{' '}
            <button onClick={addToCartRedux}>Add to Cart</button>
            <button
              disabled={!cart.find((p) => p._id === currentProduct._id)}
              onClick={removeFromCartRedux}
            >
              Remove from Cart
            </button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
      <Cart />
    </>
  );
}

export default Detail;
