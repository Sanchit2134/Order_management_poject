import { createContext, useContext, useMemo, useState } from "react";
const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const addItem = (item) =>
    setItems((current) => {
      const found = current.find((entry) => entry._id === item._id);
      return found
        ? current.map((entry) =>
            entry._id === item._id
              ? { ...entry, quantity: entry.quantity + 1 }
              : entry,
          )
        : [...current, { ...item, quantity: 1 }];
    });
  const setQuantity = (id, quantity) =>
    setItems((current) =>
      quantity < 1
        ? current.filter((item) => item._id !== id)
        : current.map((item) =>
            item._id === id ? { ...item, quantity } : item,
          ),
    );
  const removeItem = (id) =>
    setItems((current) => current.filter((item) => item._id !== id));
  const value = useMemo(
    () => ({ items, addItem, setQuantity, removeItem }),
    [items],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export const useCart = () => useContext(CartContext);
