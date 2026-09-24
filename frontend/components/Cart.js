import { useCart } from "../context/CartContext";
export default function Cart() {
  const { items, setQuantity, removeItem } = useCart();
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  if (!items.length) return <p>Your cart is empty.</p>;
  return (
    <section className="cart">
      <h2>Your cart</h2>
      {items.map((item) => (
        <div className="cart-item" key={item._id}>
          <span>{item.name}</span>
          <input
            aria-label={`${item.name} quantity`}
            type="number"
            min="1"
            value={item.quantity}
            onChange={(event) =>
              setQuantity(item._id, Number(event.target.value))
            }
          />
          <span>₹{(item.price * item.quantity).toFixed(2)}</span>
          <button onClick={() => removeItem(item._id)}>Remove</button>
        </div>
      ))}
      <h3>Total: ₹{total.toFixed(2)}</h3>
    </section>
  );
}
