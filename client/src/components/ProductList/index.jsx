import { useEffect } from 'react';
import ProductItem from '../ProductItem';
import { useSelector, useDispatch } from 'react-redux';
import { updateProducts } from '../../utils/storeSlice';
import { useQuery } from '@apollo/client';
import { QUERY_PRODUCTS } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import spinner from '../../assets/spinner.gif';

function ProductList() {
  const dispatchRedux = useDispatch();

  const productsRedux = useSelector((state) => state.store.products);
  const currentCategory = useSelector((state) => state.store.currentCategory);

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    if (data) {
      dispatchRedux(updateProducts({products: data.products}));
      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    } else if (!loading) {
      idbPromise('products', 'get').then((products) => {
        dispatchRedux(updateProducts({products: products}));
      });
    }
  }, [data, loading, dispatchRedux]);

  function filterProducts() {
    if (!currentCategory) {
      return productsRedux;
    }

    return productsRedux.filter(
      (product) => product.category._id === currentCategory
    );
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {productsRedux.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You have not added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList;
