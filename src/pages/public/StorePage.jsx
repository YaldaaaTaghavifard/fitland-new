
import { ShoppingBag, Search } from "lucide-react";
import { useState } from "react";

const products = [
  { id: 1, name: "دمبل قابل تنظیم", category: "تجهیزات", price: 1850000, emoji: "🏋️" },
  { id: 2, name: "مت یوگا", category: "لوازم ورزشی", price: 650000, emoji: "🧘" },
  { id: 3, name: "قمقمه ورزشی", category: "لوازم جانبی", price: 320000, emoji: "🥤" },
  { id: 4, name: "کش تمرینی", category: "تجهیزات", price: 280000, emoji: "💪" },
  { id: 5, name: "طناب ورزشی", category: "لوازم جانبی", price: 190000, emoji: "🪢" },
  { id: 6, name: "دستکش بدنسازی", category: "لوازم ورزشی", price: 490000, emoji: "🧤" }
];

function StorePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("همه");
  const [cart, setCart] = useState([]);

  const categories = ["همه", "تجهیزات", "لوازم ورزشی", "لوازم جانبی"];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.includes(search);
    const matchesCategory =
      category === "همه" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    setCart((current) => [...current, product]);
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("fa-IR").format(price);

  return (
    <div className="page-container">
      <section className="page-hero">
        <span className="eyebrow">فروشگاه فیت‌لند</span>
        <h1>تجهیزات موردنیازت را پیدا کن</h1>
        <p>محصولات ورزشی موردنیاز برای تمرین بهتر.</p>
      </section>

      <div className="store-toolbar">
        <div className="search-box">
          <Search size={19} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جست‌وجوی محصول..."
          />
        </div>

        <div className="cart-counter">
          <ShoppingBag size={20} />
          سبد خرید: {cart.length}
        </div>
      </div>

      <div className="category-list">
        {categories.map((item) => (
          <button
            key={item}
            className={category === item ? "active-category" : ""}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <section className="product-grid">
        {filteredProducts.map((product) => (
          <article className="product-card" key={product.id}>
            <div className="product-image">{product.emoji}</div>
            <span className="product-category">{product.category}</span>
            <h3>{product.name}</h3>
            <strong>{formatPrice(product.price)} تومان</strong>
            <button
              className="primary-button"
              onClick={() => addToCart(product)}
            >
              افزودن به سبد خرید
            </button>
          </article>
        ))}
      </section>

      {filteredProducts.length === 0 && (
        <p className="empty-state">محصولی با این مشخصات پیدا نشد.</p>
      )}

      <p className="demo-notice">
        این فروشگاه نسخه آزمایشی است؛ سفارش و پرداخت واقعی انجام نمی‌شود.
      </p>
    </div>
  );
}

export default StorePage;
