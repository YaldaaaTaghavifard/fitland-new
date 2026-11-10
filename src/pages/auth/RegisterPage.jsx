
import { Link, useNavigate } from "react-router-dom";
import { UserRound, Mail, Phone, LockKeyhole, UserCheck, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "member"
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!/^09\d{9}$/.test(form.phone)) {
      setError("شماره موبایل باید ۱۱ رقم و با 09 شروع شود.");
      return;
    }

    if (form.password.length < 6) {
      setError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
      return;
    }

    const result = register(form);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/member");
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-logo"><UserRound size={30} /></div>
        <h1>ساخت حساب کاربری</h1>
        <p>به خانواده فیت‌لند بپیوند.</p>

        <form onSubmit={handleSubmit}>
          <label>نام و نام خانوادگی</label>
          <div className="auth-input">
            <UserRound size={18} />
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="نام کامل"
            />
          </div>

          <label>ایمیل</label>
          <div className="auth-input">
            <Mail size={18} />
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="example@email.com"
            />
          </div>

          <label>شماره موبایل</label>
          <div className="auth-input">
            <Phone size={18} />
            <input
              name="phone"
              required
              value={form.phone}
              onChange={handleChange}
              placeholder="09123456789"
            />
          </div>

          <label>رمز عبور</label>
          <div className="auth-input">
            <LockKeyhole size={18} />
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="حداقل ۶ کاراکتر"
            />
          </div>

          <label>نوع حساب</label>
          <div className="auth-input auth-select-wrapper">
            <UserCheck size={18} />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="auth-select"
            >
              <option value="member">عضو باشگاه</option>
              <option value="trainer">مربی</option>
            </select>
            <ChevronDown size={16} className="auth-select-arrow" />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button className="primary-button" type="submit">
            ثبت‌نام
          </button>
        </form>

        <div className="auth-bottom">
          قبلاً ثبت‌نام کرده‌ای؟
          <Link to="/login"> وارد شو</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
