import { useState } from "react";
import { useRouter } from "next/router";
import { createOrder } from "../lib/api";
import { useCart } from "../context/CartContext";
import { checkoutSchema } from "../schemas/checkoutSchema";

export default function CheckoutForm() {
  const { items, clearCart } = useCart();
  const router = useRouter();
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  async function submit(event) {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    const form = new FormData(event.currentTarget);
    const customer = Object.fromEntries(form);
    try {
      await checkoutSchema.validate(customer, { abortEarly: false });
      if (!items.length) return setError("Add an item before checkout.");
      const order = await createOrder({
        items: items.map((item) => ({
          menuItemId: item._id,
          quantity: item.quantity,
        })),
        customer,
      });
      clearCart();
      router.push(`/order/${order._id}`);
    } catch (validationOrRequestError) {
      if (validationOrRequestError.name === "ValidationError") {
        const nextFieldErrors = validationOrRequestError.inner.reduce(
          (errors, fieldError) => ({ ...errors, [fieldError.path]: fieldError.message }),
          {},
        );
        setFieldErrors(nextFieldErrors);
      } else {
        setError(validationOrRequestError.message);
      }
    }
  }
  return (
    <form onSubmit={submit}>
      <h2>Delivery details</h2>
      {error && <p role="alert">{error}</p>}
      <label>
        Name
        <input name="name" aria-describedby="name-error" />
        {fieldErrors.name && <span id="name-error" className="field-error">{fieldErrors.name}</span>}
      </label>
      <label>
        Address
        <textarea name="address" aria-describedby="address-error" />
        {fieldErrors.address && <span id="address-error" className="field-error">{fieldErrors.address}</span>}
      </label>
      <label>
        Phone
        <input name="phone" aria-describedby="phone-error" />
        {fieldErrors.phone && <span id="phone-error" className="field-error">{fieldErrors.phone}</span>}
      </label>
      <button type="submit">Place order</button>
    </form>
  );
}
