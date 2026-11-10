import { useEffect, useState } from "react";
import { Save, UserRound, Mail, Phone, MapPin, Target } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { memberService } from "../../services/memberService";

const emptyProfile = {
  fullName: "",
  email: "",
  phone: "",
  birthDate: "",
  city: "",
  goal: "",
};

export default function MemberProfile() {
  const { user } = useAuth();
  const memberId = user?.id || "member-1";

  const [formData, setFormData] = useState(emptyProfile);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const profile = memberService.getProfile(memberId);

    if (profile) {
      setFormData({
        ...emptyProfile,
        ...profile,
      });
    }
  }, [memberId]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!formData.fullName.trim()) {
      setError("نام و نام خانوادگی را وارد کن.");
      return;
    }

    if (!/^09\d{9}$/.test(formData.phone)) {
      setError("شماره موبایل باید با 09 شروع شود و ۱۱ رقم داشته باشد.");
      return;
    }

    const result = memberService.updateProfile(memberId, {
      ...formData,
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      city: formData.city.trim(),
      goal: formData.goal.trim(),
    });

    if (!result.success) {
      setError(result.message);
      return;
    }

    setMessage(result.message);
  }

  return (
    <div className="member-page">
      <div className="member-page-heading">
        <div>
          <span className="member-eyebrow">حساب کاربری</span>
          <h1>پروفایل من</h1>
          <p>اطلاعات شخصی و هدف ورزشی خود را مدیریت کن.</p>
        </div>
      </div>

      <section className="member-panel-card member-profile-card">
        <div className="member-profile-heading">
          <div className="member-profile-avatar">
            <UserRound size={32} />
          </div>

          <div>
            <h2>اطلاعات شخصی</h2>
            <p>اطلاعات خود را بررسی و در صورت نیاز ویرایش کن.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="member-profile-form">
          <div className="member-form-grid">
            <label className="member-form-field">
              <span>
                <UserRound size={16} />
                نام و نام خانوادگی
              </span>

              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="مثلاً علی رضایی"
                required
              />
            </label>

            <label className="member-form-field">
              <span>
                <Mail size={16} />
                ایمیل
              </span>

              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                disabled
              />

              <small>ایمیل حساب در این نسخه قابل تغییر نیست.</small>
            </label>

            <label className="member-form-field">
              <span>
                <Phone size={16} />
                شماره موبایل
              </span>

              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="09123456789"
                inputMode="numeric"
                required
              />
            </label>

            <label className="member-form-field">
              <span>
                <UserRound size={16} />
                تاریخ تولد
              </span>

              <input
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                placeholder="مثلاً 1382-05-12"
              />
            </label>

            <label className="member-form-field">
              <span>
                <MapPin size={16} />
                شهر
              </span>

              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="شهر محل سکونت"
              />
            </label>

            <label className="member-form-field">
              <span>
                <Target size={16} />
                هدف ورزشی
              </span>

              <select
                name="goal"
                value={formData.goal}
                onChange={handleChange}
              >
                <option value="">انتخاب هدف</option>
                <option value="کاهش وزن">کاهش وزن</option>
                <option value="افزایش قدرت و عضله‌سازی">
                  افزایش قدرت و عضله‌سازی
                </option>
                <option value="افزایش استقامت">افزایش استقامت</option>
                <option value="حفظ تناسب اندام">حفظ تناسب اندام</option>
                <option value="سلامت عمومی و فعالیت بیشتر">
                  سلامت عمومی و فعالیت بیشتر
                </option>
              </select>
            </label>
          </div>

          {error && (
            <div className="member-form-message error">
              {error}
            </div>
          )}

          {message && (
            <div className="member-form-message success">
              {message}
            </div>
          )}

          <div className="member-form-actions">
            <button type="submit" className="member-primary-button">
              <Save size={18} />
              ذخیره تغییرات
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}