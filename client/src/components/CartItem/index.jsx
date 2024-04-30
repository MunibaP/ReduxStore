import { useDispatch } from 'react-redux';
import { removeFromCart, updateCartQuantity} from '../../utils/storeSlice';
import { idbPromise } from "../../utils/helpers";

const CartItem = ({ item }) => {

  const dispatchRedux = useDispatch();

  const removeFromCartHandler = item => {
    dispatchRedux(removeFromCart({_id: item._id}));
    idbPromise('cart', 'delete', { ...item });
  };

  const onChange = (e) => {
    const value = e.target.value;
    if (value === '0') {
      dispatchRedux(removeFromCart({_id: item._id}));
      idbPromise('cart', 'delete', { ...item });

    } else {
      dispatchRedux(updateCartQuantity({ 
        _id: item._id, 
        purchaseQuantity: parseInt(value)
      }));
      idbPromise('cart', 'put', { ...item, purchaseQuantity: parseInt(value) });
    }
  }

  return (
    <div className="flex-row">
      <div>
        <img
          src={`/images/${item.image}`}
          alt=""
        />
      </div>
      <div>
        <div>{item.name}, ${item.price}</div>
        <div>
          <span>Qty:</span>
          <input
            type="number"
            placeholder="1"
            value={item.purchaseQuantity}
            onChange={onChange}
          />
          <span
            role="img"
            aria-label="trash"
            onClick={() => removeFromCartHandler(item)}
          >
            🗑️
          </span>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
