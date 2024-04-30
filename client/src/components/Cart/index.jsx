import { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useLazyQuery } from '@apollo/client';
import { QUERY_CHECKOUT } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import CartItem from '../CartItem';
import Auth from '../../utils/auth';
// Importing Redux hooks
import { useSelector, useDispatch } from 'react-redux';
// Importing Redux actions from slice
import { toggleCart, addMultipleToCart } from '../../utils/storeSlice';
import './style.css';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const Cart = () => {
  // Using useSelector to access cart state
  const cartRedux = useSelector((state) => state.store.cart);
  const cartOpen = useSelector((state) => state.store.cartOpen);
  // Using useDispatch to dispatch actions
  const dispatchRedux = useDispatch();
  const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);

  useEffect(() => {
    if (data) {
      stripePromise.then((res) => {
        res.redirectToCheckout({ sessionId: data.checkout.session });
      });
    }
  }, [data]);

  useEffect(() => {
    async function getCart() {
      const cart = await idbPromise('cart', 'get');
      dispatchRedux(addMultipleToCart({products: [...cart] }));
    }

    if (!cartRedux.length) {
      getCart();
    }
  }, [cartRedux.length, dispatchRedux]);

  function toggleCartRedux() {
    dispatchRedux(toggleCart());
  }

  function calculateTotal() {
    let sum = 0;
    cartRedux.forEach((item) => {
      sum += item.price * item.purchaseQuantity;
    });
    return sum.toFixed(2);
  }

  function submitCheckout() {
    const productIds = [];

    cartRedux.forEach((item) => {
      for (let i = 0; i < item.purchaseQuantity; i++) {
        productIds.push(item._id);
      }
    });

    getCheckout({
      variables: { products: productIds },
    });
  }

  if (!cartOpen) {
    return (
      <div className="cart-closed" onClick={toggleCartRedux}>
        <span role="img" aria-label="trash">
          🛒
        </span>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="close" onClick={toggleCartRedux}>
        [close]
      </div>
      <h2>Shopping Cart</h2>
      {cartRedux.length ? (
        <div>
          {cartRedux.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}

          <div className="flex-row space-between">
            <strong>Total: ${calculateTotal()}</strong>

            {Auth.loggedIn() ? (
              <button onClick={submitCheckout}>Checkout</button>
            ) : (
              <span>(log in to check out)</span>
            )}
          </div>
        </div>
      ) : (
        <h3>
          <span role="img" aria-label="shocked">
            😱
          </span>
          You have not added anything to your cart yet!
        </h3>
      )}
    </div>
  );
};

export default Cart;
