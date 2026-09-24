import { useEffect, useState } from "react";
import { getOrder } from "../lib/api";
const states = ["Order Received", "Preparing", "Out for Delivery", "Delivered"];
export default function OrderStatus({ order: initialOrder, orderId }) {
  const [order, setOrder] = useState(initialOrder);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!orderId || order?.status === "Delivered") return undefined;
    const poll = async () => {
      try {
        setOrder(await getOrder(orderId));
      } catch (pollError) {
        setError(pollError.message);
      }
    };
    poll();
    const timer = setInterval(poll, 4000);
    return () => clearInterval(timer);
  }, [orderId, order?.status]);
  if (error) return <p role="alert">{error}</p>;
  if (!order) return <p>Loading your order…</p>;
  return (
    <section>
      <h1>Order status</h1>
      <p className="current-status">{order.status}</p>
      <ol className="steps">
        {states.map((state) => (
          <li
            className={
              states.indexOf(state) <= states.indexOf(order.status)
                ? "active"
                : ""
            }
            key={state}
          >
            {state}
          </li>
        ))}
      </ol>
      <h2>Total: ₹{order.totalPrice.toFixed(2)}</h2>
    </section>
  );
}
