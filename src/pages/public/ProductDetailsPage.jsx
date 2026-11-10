import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  CreditCard,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { dataService } from "../../services/dataService";
import MockPaymentModal from "../../components/common/MockPaymentModal";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { t, formatCurrency, formatNumber, isRtl } = useLanguage();

  const product = dataService.getProductById(id);
  const [added, setAdded] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  if (!product) {
    return (
      <div className="page-container text-center py-16">
        <h2>کالای موردنظر یافت نشد.</h2>
        <Link to="/store" className="chic-btn chic-btn-primary mt-4">
          بازگشت به فروشگاه
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="page-container product-details-page">
      <div className="back-link-wrapper">
        <Link to="/store" className="back-link">
          {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          <span>بازگشت به فروشگاه</span>
        </Link>
      </div>

      <div className="product-details-grid">
        {/* Media Frame */}
        <div className="product-gallery-frame">
          <img
            src={product.image}
            alt={product.name}
            className="product-gallery-img"
          />
          {product.badge && (
            <span className="product-flag-badge">{product.badge}</span>
          )}
        </div>

        {/* Details & Purchase */}
        <div className="product-info-col">
          <span className="product-cat-label">{product.category}</span>
          <h1 className="product-main-name">
            {isRtl ? product.name : product.nameEn || product.name}
          </h1>

          <div className="product-rating-row">
            <div className="stars-cluster">
              {"★".repeat(Math.round(product.rating))}
            </div>
            <strong>{formatNumber(product.rating)}</strong>
            <span>({formatNumber(product.reviews)} دیدگاه خریداران تاییدشده)</span>
          </div>

          <div className="product-pricing-box">
            <div className="prices-group">
              <strong className="current-price">
                {formatCurrency(product.price)}
              </strong>
              {product.originalPrice && (
                <span className="old-strikethrough-price">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="stock-status in-stock">
              ✓ موجود در انبار مرکزی ({formatNumber(product.stock)} عدد)
            </span>
          </div>

          <p className="product-long-desc">{product.description}</p>

          <div className="product-specs-list">
            <h4>مشخصات و استانداردهای کیفی:</h4>
            <ul>
              <li><strong>متریال:</strong> درجه ۱ صادراتی، بدون بو و حساسیت پوستی</li>
              <li><strong>گارانتی:</strong> ۶ ماه تعویض بی‌قیدوشرط فیت‌لند</li>
              <li><strong>ارسال:</strong> ارسال فوری ۲ ساعته در شهر یزد / ۲ روزه سراسر کشور</li>
              <li><strong>امکان خرید اقساطی:</strong> بله، در اقساط ۲ تا ۴ ماهه بدون سود</li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="product-actions-group">
            <button
              type="button"
              className="chic-btn chic-btn-ghost btn-lg"
              onClick={handleAddToCart}
            >
              {added ? (
                <>
                  <Check size={18} className="text-emerald-500" />
                  <span className="text-emerald-500">{t("addedToCart")}</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  <span>{t("addToCart")}</span>
                </>
              )}
            </button>

            <button
              type="button"
              className="chic-btn chic-btn-primary btn-lg"
              onClick={() => setIsPaymentModalOpen(true)}
            >
              <CreditCard size={18} />
              <span>خرید فوری (نقدی یا اقساطی)</span>
            </button>
          </div>

          <div className="trust-features-strip">
            <div className="trust-feat-item">
              <Truck size={18} />
              <span>ارسال سریع و مطمئن</span>
            </div>
            <div className="trust-feat-item">
              <ShieldCheck size={18} />
              <span>تضمین اصالت کالا</span>
            </div>
            <div className="trust-feat-item">
              <RotateCcw size={18} />
              <span>۷ روز ضمانت بازگشت</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mock Payment Modal */}
      <MockPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        item={{
          title: product.name,
          titleEn: product.nameEn,
          price: product.price,
          type: "product",
        }}
        onSuccess={() => {
          dataService.updateProductStock(product.id, -1);
        }}
      />
    </div>
  );
}
