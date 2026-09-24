import Link from "next/link";
import MenuItemCard from "../components/MenuItemCard";
import { useCart } from "../context/CartContext";
import { usePaginatedMenu } from "../hooks/usePaginatedMenu";
export default function Home() {
  const { items: menu, error, loadingMore, hasMore, loadMore } = usePaginatedMenu();
  const { addItem, items } = useCart();
  return (
    <main>
      <header>
        <div>
          <p className="eyebrow">Freshly made, at your door</p>
          <h1>Good food, no waiting.</h1>
        </div>
        <Link href="/cart">
          Cart ({items.reduce((total, item) => total + item.quantity, 0)})
        </Link>
      </header>
      <h2>Menu</h2>
      {error && <p role="alert">{error}</p>}
      {!error && !menu.length && <p>No menu items found</p>}
      <div className="menu-grid">
        {menu.map((item) => (
          <MenuItemCard key={item._id} item={item} onAdd={addItem} />
        ))}
      </div>
      {hasMore && (
        <button type="button" onClick={loadMore} disabled={loadingMore}>
          {loadingMore ? "Loading..." : "Load more"}
        </button>
      )}
    </main>
  );
}
