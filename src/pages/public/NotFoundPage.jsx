import { Link } from "react-router-dom";
import { ArrowRight, SearchX } from "lucide-react";

function NotFoundPage() {
  return (
    <section className="not-found-page">
      <SearchX size={64} />

      <h1>۴۰۴</h1>

      <h2>صفحه موردنظر پیدا نشد!</h2>

      <p>
        ممکن است آدرس واردشده اشتباه باشد یا صفحه هنوز ساخته نشده باشد.
      </p>

      <Link to="/" className="btn btn-primary">
        <ArrowRight size={18} />
        بازگشت به صفحه اصلی
      </Link>
    </section>
  );
}

export default NotFoundPage;