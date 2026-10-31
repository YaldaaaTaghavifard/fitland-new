import { Dumbbell, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <Dumbbell size={25} />
            <strong>FitLand</strong>
          </div>

          <p>
            فیت‌لند، همراه هوشمند شما در مسیر ورزش،
            سلامتی و پیشرفت.
          </p>
        </div>

        <div className="footer-links">
          <h3>دسترسی سریع</h3>
          <Link to="/">صفحه اصلی</Link>
          <Link to="/about">درباره ما</Link>
          <Link to="/plans">اشتراک‌ها</Link>
          <Link to="/trainers">مربیان</Link>
          <Link to="/store">فروشگاه</Link>
        </div>

        <div className="footer-contact">
          <h3>ارتباط با ما</h3>

          <p><Phone size={16} /> ۰۲۱-۱۲۳۴۵۶۷۸</p>
          <p><Mail size={16} /> info@fitland.ir</p>
          <p><MapPin size={16} /> دانشگاه یزد</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>تمام حقوق این وب‌سایت متعلق به فیت‌لند است.</p>
        <span>© 2026 FitLand</span>
      </div>
    </footer>
  );
}

export default Footer;