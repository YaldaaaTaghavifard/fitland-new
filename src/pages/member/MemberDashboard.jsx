import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  CreditCard,
  Dumbbell,
  Target,
  Clock3,
  ArrowLeft,
  Activity,
  UserRound,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { memberService } from "../../services/memberService";

function formatNumber(value) {
  return new Intl.NumberFormat("fa-IR").format(value || 0);
}

function formatDate(date) {
  if (!date) return "—";

  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

function getMembershipDaysLeft(endDate) {
  if (!endDate) return 0;

  const end = new Date(`${endDate}T23:59:59`);
  const today = new Date();

  const difference = end.getTime() - today.getTime();

  return Math.max(0, Math.ceil(difference / (1000 * 60 * 60 * 24)));
}

function StatCard({ icon: Icon, label, value, description, color }) {
  return (
    <div className="member-stat-card">
      <div className={`member-stat-icon ${color}`}>
        <Icon size={22} />
      </div>

      <div className="member-stat-info">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{description}</small>
      </div>
    </div>
  );
}

function StatusLabel({ status }) {
  const statuses = {
    active: { label: "فعال", className: "status-success" },
    paid: { label: "پرداخت‌شده", className: "status-success" },
    confirmed: { label: "تأییدشده", className: "status-success" },
    pending: { label: "در انتظار", className: "status-warning" },
    expired: { label: "منقضی‌شده", className: "status-danger" },
    cancelled: { label: "لغوشده", className: "status-danger" },
  };

  const current = statuses[status] || {
    label: "نامشخص",
    className: "status-neutral",
  };

  return (
    <span className={`member-status ${current.className}`}>
      {current.label}
    </span>
  );
}

export default function MemberDashboard() {
  const { user } = useAuth();

  const memberId = user?.id || "member-1";

  const memberData = useMemo(
    () => memberService.getMember(memberId),
    [memberId]
  );

  if (!memberData) {
    return (
      <div className="member-empty-state">
        <AlertCircle size={35} />
        <h2>اطلاعات عضو پیدا نشد</h2>
        <p>اطلاعات حساب کاربری شما هنوز در سامانه ثبت نشده است.</p>
      </div>
    );
  }

  const { profile, membership, payments, bookings, activities } = memberData;

  const daysLeft = getMembershipDaysLeft(membership?.endDate);

  const upcomingBookings = [...bookings]
    .filter((booking) => booking.status !== "cancelled")
    .sort((a, b) => {
      return `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
    })
    .slice(0, 3);

  const pendingPayments = payments.filter(
    (payment) => payment.status === "pending"
  );

  const paidPayments = payments.filter(
    (payment) => payment.status === "paid"
  );

  return (
    <div className="member-dashboard">
      <div className="member-welcome">
        <div>
          <span className="member-eyebrow">پنل کاربری فیت‌لند</span>

          <h1>
            سلام {profile.fullName}، خوش اومدی!
          </h1>

          <p>
            اینجا می‌تونی وضعیت اشتراک، برنامه‌ها و روند فعالیتت رو دنبال کنی.
          </p>
        </div>

        <div className="member-welcome-icon">
          <Dumbbell size={34} />
        </div>
      </div>

      <div className="member-stats-grid">
        <StatCard
          icon={CalendarDays}
          label="روزهای باقی‌مانده اشتراک"
          value={`${formatNumber(daysLeft)} روز`}
          description="بر اساس تاریخ پایان اشتراک"
          color="orange"
        />

        <StatCard
          icon={Dumbbell}
          label="رزروهای ثبت‌شده"
          value={formatNumber(bookings.length)}
          description="تمام رزروهای ثبت‌شده"
          color="purple"
        />

        <StatCard
          icon={CreditCard}
          label="پرداخت‌های انجام‌شده"
          value={formatNumber(paidPayments.length)}
          description="تراکنش‌های آزمایشی موفق"
          color="green"
        />

        <StatCard
          icon={Clock3}
          label="اقساط در انتظار"
          value={formatNumber(pendingPayments.length)}
          description="اقساط پرداخت‌نشده"
          color="blue"
        />
      </div>

      <div className="member-dashboard-grid">
        <section className="member-panel-card">
          <div className="member-panel-header">
            <div>
              <h2>وضعیت اشتراک</h2>
              <p>اطلاعات طرح فعلی شما</p>
            </div>

            <StatusLabel status={membership.status} />
          </div>

          <div className="membership-details">
            <div>
              <span>نام طرح</span>
              <strong>{membership.planName}</strong>
            </div>

            <div>
              <span>تاریخ شروع</span>
              <strong>{formatDate(membership.startDate)}</strong>
            </div>

            <div>
              <span>تاریخ پایان</span>
              <strong>{formatDate(membership.endDate)}</strong>
            </div>

            <div>
              <span>مبلغ کل</span>
              <strong>
                {formatNumber(membership.price)} تومان
              </strong>
            </div>
          </div>

          <Link to="/plans" className="member-panel-link">
            مشاهده طرح‌های اشتراک
            <ArrowLeft size={17} />
          </Link>
        </section>

        <section className="member-panel-card">
          <div className="member-panel-header">
            <div>
              <h2>هدف ورزشی من</h2>
              <p>هدف ثبت‌شده در پروفایل</p>
            </div>

            <Target size={23} className="member-orange-icon" />
          </div>

          <div className="member-goal">
            <div className="member-goal-icon">
              <Activity size={28} />
            </div>

            <strong>{profile.goal || "هنوز هدفی ثبت نشده است."}</strong>

            <span>
              برای مشاهده روند پیشرفت، اندازه‌های بدن خود را ثبت کن.
            </span>
          </div>

          <Link to="/member/profile" className="member-panel-link">
            تکمیل اطلاعات شخصی
            <ArrowLeft size={17} />
          </Link>
        </section>
      </div>

      <div className="member-dashboard-grid">
        <section className="member-panel-card">
          <div className="member-panel-header">
            <div>
              <h2>جلسات آینده</h2>
              <p>رزروهای ثبت‌شده شما</p>
            </div>

            <CalendarDays size={23} className="member-orange-icon" />
          </div>

          {upcomingBookings.length > 0 ? (
            <div className="member-booking-list">
              {upcomingBookings.map((booking) => (
                <div className="member-booking-item" key={booking.id}>
                  <div className="member-booking-date">
                    <strong>{formatDate(booking.date)}</strong>
                    <span>{booking.time}</span>
                  </div>

                  <div className="member-booking-info">
                    <strong>{booking.title}</strong>
                    <span>مربی: {booking.trainerName}</span>
                  </div>

                  <StatusLabel status={booking.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className="member-empty-message">
              هنوز جلسه‌ای رزرو نکرده‌ای.
            </div>
          )}

          <Link to="/member/bookings" className="member-panel-link">
            مشاهده همه رزروها
            <ArrowLeft size={17} />
          </Link>
        </section>

        <section className="member-panel-card">
          <div className="member-panel-header">
            <div>
              <h2>فعالیت‌های اخیر</h2>
              <p>آخرین تغییرات حساب کاربری</p>
            </div>

            <Activity size={23} className="member-orange-icon" />
          </div>

          <div className="member-activity-list">
            {activities.slice(0, 4).map((activity) => (
              <div className="member-activity-item" key={activity.id}>
                <div className="member-activity-icon">
                  <CheckCircle2 size={17} />
                </div>

                <div>
                  <strong>{activity.title}</strong>
                  <p>{activity.description}</p>
                  <small>{formatDate(activity.date)}</small>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="member-panel-card member-payment-card">
        <div className="member-panel-header">
          <div>
            <h2>آخرین پرداخت‌ها</h2>
            <p>وضعیت پرداخت‌های ثبت‌شده</p>
          </div>

          <CreditCard size={23} className="member-orange-icon" />
        </div>

        {payments.length > 0 ? (
          <div className="member-table-wrapper">
            <table className="member-table">
              <thead>
                <tr>
                  <th>عنوان</th>
                  <th>مبلغ</th>
                  <th>تاریخ</th>
                  <th>روش</th>
                  <th>وضعیت</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.title}</td>
                    <td>{formatNumber(payment.amount)} تومان</td>
                    <td>{formatDate(payment.date)}</td>
                    <td>{payment.method}</td>
                    <td>
                      <StatusLabel status={payment.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="member-empty-message">
            هنوز پرداختی ثبت نشده است.
          </div>
        )}
      </section>

      <div className="member-dashboard-footer">
        <UserRound size={17} />
        <span>
          اطلاعات این نسخه از سامانه در مرورگر شما ذخیره می‌شود و داده‌های اولیه
          جنبه آزمایشی دارند.
        </span>
      </div>
    </div>
  );
}