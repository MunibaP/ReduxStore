import { createSlice } from '@reduxjs/toolkit';

export const storeSlice = createSlice({
  name: 'store',
  initialState: {
    products: [],
    cart: [],
    cartOpen: false,
    categories: [],
    currentCategory: '',
  },

  reducers: {
    updateProducts: (state, action) => {
      state.products = action.payload.products;
    },
    addToCart: (state, action) => {
      state.cartOpen = true;
      state.cart.push(action.payload.product);
    },
    addMultipleToCart: (state, action) => {
      state.cart.push(...action.payload.products);
    },
    updateCartQuantity: (state, action) => {
      state.cartOpen = true;
      state.cart = state.cart.map((item) => {
        if (item._id === action.payload._id) {
          item.purchaseQuantity = action.payload.purchaseQuantity;
        }
        return item;
      });
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item._id !== action.payload._id);
    },
    toggleCart: (state) => {
      state.cartOpen = !state.cartOpen;
    },
    updateCategories: (state, action) => {
      state.categories = action.payload;
    },
    updateCurrentCategory: (state, action) => {
      state.currentCategory = action.payload.currentCategory;
    },
  },
});

export const {
  updateProducts,
  addToCart,
  addMultipleToCart,
  updateCartQuantity,
  removeFromCart,
  toggleCart,
  updateCategories,
  updateCurrentCategory,
} = storeSlice.actions;

export default storeSlice.reducer;
