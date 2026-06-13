import { createContext, useContext, useState } from "react";

const CartContext = createContext({
  cartCount: 0,
  cartItems: [],
  addToCart: () => {},
  decreaseQty: () => {},
  clearCart: () => {},
});

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const decreaseQty = (id) => {
    setCartItems((prev) => {
      return prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0);
    });
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartCount, cartItems, addToCart, decreaseQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
