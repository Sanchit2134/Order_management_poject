import Link from "next/link";
import { useRouter } from "next/router";
import OrderStatus from "../../components/OrderStatus";
export default function OrderPage() {
  const { query } = useRouter();
  return (
    <main>
      <Link href="/">Order another meal</Link>
      <OrderStatus orderId={query.id} />
    </main>
  );
}
