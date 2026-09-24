import Link from "next/link";
import Cart from "../components/Cart";
import CheckoutForm from "../components/CheckoutForm";
export default function CartPage() {
  return (
    <main>
      <Link href="/">← Continue browsing</Link>
      <Cart />
      <CheckoutForm />
    </main>
  );
}
