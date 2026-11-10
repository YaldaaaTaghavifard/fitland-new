
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const result = login(email, password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate(
      result.user.role === "admin"
        ? "/admin"
        : result.user.role === "trainer"
        ? "/trainer"
        : "/member"
    );
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo"><Dumbbell size={30} /></div>
        <h1>خوش برگشتی!</h1>
        <p>برای ورود به حساب فیت‌لند اطلاعاتت را وارد کن.</p>

        <form onSubmit={handleSubmit}>
          <label>ایمیل</label>
          <div className="auth-input">
            <Mail size={18} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
            />
          </div>

          <label>رمز عبور</label>
          <div className="auth-input">
            <LockKeyhole size={18} />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="رمز عبور"
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button className="primary-button" type="submit">
            ورود به حساب
          </button>
        </form>

        <div className="auth-bottom">
          حساب کاربری نداری؟
          <Link to="/register"> ثبت‌نام کن</Link>
        </div>

        <div className="demo-accounts">
          <strong>حساب‌های آزمایشی</strong>
          <p>عضو: member@fitland.ir</p>
          <p>مربی: trainer@fitland.ir</p>
          <p>مدیر: admin@fitland.ir</p>
          <small>رمز عبور هر سه حساب: 123456</small>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
