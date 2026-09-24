export default function MenuItemCard({ item, onAdd }) {
  return (
    <article className="card">
      <img src={item.imageUrl} alt={item.name} />
      <div>
        <h2>{item.name}</h2>
        <p>{item.description}</p>
        <div className="box">
          <div className="price">₹{item.price.toFixed(2)}</div>
          <button onClick={() => onAdd(item)}>Add to cart</button>
        </div>
      </div>
    </article>
  );
}
