import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { updateCategories, updateCurrentCategory} from '../../utils/storeSlice';
import { QUERY_CATEGORIES } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';

function CategoryMenu() {
  
  const dispatch = useDispatch();

  const Reduxcategories = useSelector((state) => state.store.categories);

  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  useEffect(() => {
    if (categoryData) {
      dispatch(updateCategories(categoryData.categories));

      categoryData.categories.forEach((category) => {
        idbPromise('categories', 'put', category);
      });

      // } else if (!loading) {
      //  idbPromise('categories', 'get');
      // if (cachedCategories) {
      //   dispatch(updateCategories(cachedCategories));
    }
  }, [categoryData, loading, dispatch]);

  const handleClick = (id) => {
    dispatch(updateCurrentCategory({currentCategory: id}));
  };

  return (
    <div>
      <h2>Choose a Category:</h2>
      {Reduxcategories.map((item) => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
      <button
        onClick={() => {
          handleClick('');
        }}
      >
        All
      </button>
    </div>
  );
}

export default CategoryMenu;
