import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Search,
  Star,
  Check,
  Plus,
  Minus,
  Trash2,
  X,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Eye,
} from "lucide-react";

const initialProducts = [
  {
    id: 1,
    name: "دمبل متغیر ۱۲ حالته حرفه‌ای",
    category: "تجهیزات",
    price: 1850000,
    originalPrice: 2200000,
    badge: "پرفروش",
    rating: 4.9,
    reviews: 58,
    specs: "تنظیم وزن سریع ۲.۵ تا ۲۴ کیلوگرم با روکش ضدزنگ و ارگونومیک",
    image: "https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=700&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    name: "مت یوگا TPE دولایه ضدلغزش",
    category: "لوازم ورزشی",
    price: 650000,
    originalPrice: 780000,
    badge: "پیشنهاد مربی",
    rating: 4.8,
    reviews: 42,
    specs: "ضخامت ۸ میلی‌متر، متریال آنتی‌باکتریال و کاملاً ضدلغزش",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=700&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    name: "شیکر و قمقمه مات ورزشی ۷۰۰ml",
    category: "لوازم جانبی",
    price: 320000,
    originalPrice: 390000,
    badge: "تخفیف ویژه",
    rating: 4.7,
    reviews: 31,
    specs: "دوجداره عایق، بدون نشتی به همراه توری همزن استیل ضدزنگ",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=700&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    name: "پک ۵ عددی کش‌های مقاومتی لوپ",
    category: "تجهیزات",
    price: 280000,
    originalPrice: 340000,
    badge: "محبوب",
    rating: 4.9,
    reviews: 64,
    specs: "۵ سطح کشسانی مختلف از سبک تا سنگین با کیف مخصوص حمل",
    image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=700&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    name: "طناب ورزشی سرعتی بلبرینگی",
    category: "لوازم جانبی",
    price: 190000,
    originalPrice: null,
    badge: "ارسال سریع",
    rating: 4.6,
    reviews: 19,
    specs: "سیم فولادی روکش‌دار با قابلیت تنظیم طول و چرخش ۳۶۰ درجه",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=700&auto=format&fit=crop&q=80",
  },
  {
    id: 6,
    name: "دستکش بدنسازی چرم تنفسی با مچ‌بند",
    category: "لوازم ورزشی",
    price: 490000,
    originalPrice: 590000,
    badge: "کیفیت برتر",
    rating: 4.8,
    reviews: 27,
    specs: "پد ژله‌ای ضدتاول کف دست همراه مچ‌بند کشی بلند حمایتی",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=700&auto=format&fit=crop&q=80",
  },
  {
    id: 7,
    name: "فوم رولر ماساژ عضلانی ریکاوری",
    category: "تجهیزات",
    price: 520000,
    originalPrice: null,
    badge: "جدید",
    rating: 4.7,
    reviews: 15,
    specs: "طراحی برجسته ارگونومیک مناسب رفع گرفتگی و تسریع ریکاوری",
    image: "https://images.unsplash.com/photo-1600881333168-2ef49b341f30?w=700&auto=format&fit=crop&q=80",
  },
  {
    id: 8,
    name: "مچ‌بند هوشمند ورزشی ضدآب",
    category: "لوازم جانبی",
    price: 2450000,
    originalPrice: 2890000,
    badge: "فناوری روز",
    rating: 4.9,
    reviews: 83,
    specs: "سنجش ضربان قلب، کالری‌سنج و پایش هوشمند حرکات ورزشی",
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=700&auto=format&fit=crop&q=80",
  },
];

const categories = ["همه", "تجهیزات", "لوازم ورزشی", "لوازم جانبی"];

function formatPrice(price) {
  return new Intl.NumberFormat("fa-IR").format(price);
}

function StorePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("همه");
  const [sortBy, setSortBy] = useState("popular");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [orderCompleted, setOrderCompleted] = useState(false);

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });

    setAddedItemIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1600);
  };

  const updateQuantity = (id, delta) => {
    setCart((current) =>
      current
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCart((current) => current.filter((item) => item.id !== id));
  };

  const cartTotalCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartTotalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        const matchesSearch =
          product.name.includes(search) ||
          product.specs.includes(search) ||
          product.category.includes(search);
        const matchesCategory =
          category === "همه" || product.category === category;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return b.reviews - a.reviews;
      });
  }, [search, category, sortBy]);

  const handleCheckout = () => {
    setOrderCompleted(true);
    setCart([]);
    setTimeout(() => {
      setOrderCompleted(false);
      setIsCartOpen(false);
    }, 2500);
  };

  return (
    <div className="store-page-wrapper">
      {/* Hero Banner */}
      <section className="store-hero">
        <div className="container store-hero-inner">
          <div className="store-hero-badge">
            <Sparkles size={16} />
            <span>تجهیزات اورجینال و استاندارد تناسب اندام</span>
          </div>
          <h1>
            فروشگاه تخصصی <span>فیت‌لند</span>
          </h1>
          <p>
            مجموعه‌ای منتخب از بهترین تجهیزات ورزشی، اکسسوری و ملزومات تمرین برای
            ارتقای سطح عملکرد شما در خانه و باشگاه.
          </p>

          <div className="store-perks-strip">
            <div className="perk-item">
              <Truck size={18} />
              <span>ارسال سریع سراسر کشور</span>
            </div>
            <div className="perk-divider" />
            <div className="perk-item">
              <ShieldCheck size={18} />
              <span>ضمانت اصالت و سلامت فیزیکی</span>
            </div>
            <div className="perk-divider" />
            <div className="perk-item">
              <RotateCcw size={18} />
              <span>۷ روز ضمانت بازگشت وجه</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container store-main-content">
        {/* Toolbar */}
        <div className="store-toolbar-modern">
          <div className="store-search-wrap">
            <Search size={19} className="search-icon" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جست‌وجوی نام کالا یا مشخصات (دمبل، مت، شیکر...)"
            />
            {search && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearch("")}
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="store-toolbar-actions">
            <div className="store-sort-box">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="store-sort-select"
              >
                <option value="popular">مرتب‌سازی: پرفروش‌ترین</option>
                <option value="rating">مرتب‌سازی: بالاترین امتیاز</option>
                <option value="price-low">مرتب‌سازی: ارزان‌ترین</option>
                <option value="price-high">مرتب‌سازی: گران‌ترین</option>
              </select>
            </div>

            <button
              type="button"
              className="store-cart-trigger-btn"
              onClick={() => setIsCartOpen(true)}
              aria-label="مشاهده سبد خرید"
            >
              <ShoppingBag size={20} />
              <span>سبد خرید</span>
              <span className="cart-badge-count">
                {new Intl.NumberFormat("fa-IR").format(cartTotalCount)}
              </span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="store-category-bar">
          {categories.map((item) => (
            <button
              key={item}
              className={`store-cat-chip ${category === item ? "active" : ""}`}
              onClick={() => setCategory(item)}
            >
              {item}
              <span className="cat-count">
                {new Intl.NumberFormat("fa-IR").format(
                  item === "همه"
                    ? initialProducts.length
                    : initialProducts.filter((p) => p.category === item).length
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <section className="store-products-grid">
          {filteredProducts.map((product) => {
            const isAdded = addedItemIds[product.id];
            const isFav = wishlist.includes(product.id);

            return (
              <article className="chic-product-card" key={product.id}>
                {/* Image Container */}
                <div className="product-media-box">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="product-photo"
                  />

                  {product.badge && (
                    <span className="product-flag-badge">{product.badge}</span>
                  )}

                  <button
                    type="button"
                    className={`product-wish-btn ${isFav ? "active" : ""}`}
                    onClick={() => toggleWishlist(product.id)}
                    title={isFav ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
                  >
                    <Heart size={16} fill={isFav ? "currentColor" : "none"} />
                  </button>

                  <button
                    type="button"
                    className="product-quick-view-btn"
                    onClick={() => setQuickViewProduct(product)}
                    title="مشاهده سریع"
                  >
                    <Eye size={16} />
                    <span>مشاهده جزئیات</span>
                  </button>
                </div>

                {/* Card Details */}
                <div className="product-body">
                  <div className="product-meta-row">
                    <span className="product-cat-tag">{product.category}</span>
                    <div className="product-rating">
                      <Star size={14} className="star-icon" fill="currentColor" />
                      <span>{new Intl.NumberFormat("fa-IR", { minimumFractionDigits: 1 }).format(product.rating)}</span>
                      <small>({new Intl.NumberFormat("fa-IR").format(product.reviews)})</small>
                    </div>
                  </div>

                  <h3 className="product-headline">
                    <Link to={`/store/${product.id}`}>{product.name}</Link>
                  </h3>
                  <p className="product-subtext">{product.specs}</p>

                  <div className="product-footer-row">
                    <div className="product-pricing">
                      {product.originalPrice && (
                        <span className="product-old-price">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                      <div className="product-final-price">
                        <strong>{formatPrice(product.price)}</strong>
                        <span>تومان</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`product-buy-button ${isAdded ? "added" : ""}`}
                      onClick={() => addToCart(product)}
                    >
                      {isAdded ? (
                        <>
                          <Check size={18} />
                          <span>اضافه شد</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={18} />
                          <span>خرید</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {filteredProducts.length === 0 && (
          <div className="store-empty-results">
            <ShoppingBag size={48} className="empty-icon" />
            <h3>محصولی با این مشخصات یافت نشد</h3>
            <p>عبارت جست‌وجو را تغییر دهید یا فیلتر دسته‌بندی را روی «همه» بگذارید.</p>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setSearch("");
                setCategory("همه");
              }}
            >
              پاک‌سازی فیلترها
            </button>
          </div>
        )}

        <div className="store-safety-note">
          <ShieldCheck size={20} />
          <span>
            کلیه سفارش‌ها در این سامانه جنبه آزمایشی و ارائه‌ای دارد و تراکنش مالی واقعی انجام نمی‌شود.
          </span>
        </div>
      </div>

      {/* Cart Drawer / Modal */}
      {isCartOpen && (
        <div className="cart-backdrop" onClick={() => setIsCartOpen(false)}>
          <div
            className="cart-drawer-panel"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="cart-drawer-header">
              <div className="cart-header-title">
                <ShoppingBag size={22} />
                <h2>سبد خرید شما</h2>
                <span className="cart-count-chip">
                  {new Intl.NumberFormat("fa-IR").format(cartTotalCount)} کالا
                </span>
              </div>
              <button
                type="button"
                className="cart-close-btn"
                onClick={() => setIsCartOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            {orderCompleted ? (
              <div className="cart-success-state">
                <div className="success-icon-wrap">
                  <Check size={36} />
                </div>
                <h3>سفارش آزمایشی با موفقیت ثبت شد!</h3>
                <p>از خرید شما در نسخه نمایشی فیت‌لند متشکریم.</p>
              </div>
            ) : cart.length === 0 ? (
              <div className="cart-empty-body">
                <ShoppingBag size={52} className="empty-cart-icon" />
                <p>سبد خرید شما در حال حاضر خالی است.</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setIsCartOpen(false)}
                >
                  مشاهده کاتالوگ محصولات
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items-scroll">
                  {cart.map((item) => (
                    <div className="cart-line-item" key={item.id}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-item-thumb"
                      />
                      <div className="cart-item-info">
                        <h4>{item.name}</h4>
                        <div className="cart-item-price-unit">
                          {formatPrice(item.price)} تومان
                        </div>

                        <div className="cart-qty-row">
                          <div className="cart-qty-counter">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus size={14} />
                            </button>
                            <span>
                              {new Intl.NumberFormat("fa-IR").format(item.quantity)}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <button
                            type="button"
                            className="cart-delete-item-btn"
                            onClick={() => removeFromCart(item.id)}
                            title="حذف کالا"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-drawer-footer">
                  <div className="cart-shipping-notice">
                    <Truck size={16} />
                    <span>ارسال رایگان ویژه سفارش‌های فیت‌لند</span>
                  </div>

                  <div className="cart-total-row">
                    <span>مبلغ قابل پرداخت:</span>
                    <strong>{formatPrice(cartTotalPrice)} تومان</strong>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary cart-checkout-btn"
                    onClick={handleCheckout}
                  >
                    تکمیل سفارش و تسویه‌حساب آزمایشی
                    <ArrowRight size={18} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div
          className="modal-backdrop"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="quick-view-card"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <button
              type="button"
              className="modal-close-button"
              onClick={() => setQuickViewProduct(null)}
            >
              <X size={20} />
            </button>

            <div className="quick-view-grid">
              <div className="quick-view-gallery">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="quick-view-main-image"
                />
              </div>

              <div className="quick-view-details">
                <span className="product-cat-tag">
                  {quickViewProduct.category}
                </span>
                <h2>{quickViewProduct.name}</h2>

                <div className="product-rating" style={{ margin: "10px 0 16px" }}>
                  <Star size={16} className="star-icon" fill="currentColor" />
                  <strong>
                    {new Intl.NumberFormat("fa-IR", { minimumFractionDigits: 1 }).format(quickViewProduct.rating)}
                  </strong>
                  <span>
                    ({new Intl.NumberFormat("fa-IR").format(quickViewProduct.reviews)} دیدگاه کاربران)
                  </span>
                </div>

                <p className="quick-view-desc">{quickViewProduct.specs}</p>

                <div className="quick-view-features">
                  <div>
                    <Check size={16} color="var(--primary)" />
                    <span>ارسال سریع اکسپرس در بسته‌بندی ایمن</span>
                  </div>
                  <div>
                    <Check size={16} color="var(--primary)" />
                    <span>تست و اصالت فیزیکی قبل از ارسال</span>
                  </div>
                  <div>
                    <Check size={16} color="var(--primary)" />
                    <span>پشتیبانی و مشاوره رایگان تمرینی</span>
                  </div>
                </div>

                <div className="quick-view-price-box">
                  <div className="product-final-price">
                    <strong>{formatPrice(quickViewProduct.price)}</strong>
                    <span>تومان</span>
                  </div>
                  {quickViewProduct.originalPrice && (
                    <span className="product-old-price">
                      {formatPrice(quickViewProduct.originalPrice)} تومان
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: "100%", padding: "14px", marginTop: "16px" }}
                  onClick={() => {
                    addToCart(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                >
                  <ShoppingBag size={18} />
                  افزودن به سبد خرید
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StorePage;
