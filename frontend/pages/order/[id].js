import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import OrderStatus from "../../components/OrderStatus";
import { useCart } from "../../context/CartContext";
export default function OrderPage() {
  const { query } = useRouter();
  const { clearCart } = useCart();
  useEffect(() => {
    if (query.id) clearCart();
  }, [query.id, clearCart]);
  return (
    <main>
      <Link href="/">Order another meal</Link>
      <OrderStatus orderId={query.id} />
    </main>
  );
}
