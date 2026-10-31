
import { useState } from "react";
import {
  CalendarDays,
  CreditCard,
  Activity,
  ShoppingBag,
  Crown,
  Clock,
  CheckCircle2,
  XCircle,
  Dumbbell,
} from "lucide-react";

const demoBookings = [
  {
    id: 1,
    title: "تمرین بدنسازی",
    trainer: "سارا محمدی",
    date: "۱۴۰۵/۰۸/۱۰",
    time: "۱۷:۰۰",
    status: "confirmed",
  },
  {
    id: 2,
    title: "تمرین هوازی",
    trainer: "علی احمدی",
    date: "۱۴۰۵/۰۸/۱۲",
    time: "۱۸:۳۰",
    status: "pending",
  },
];

const demoPayments = [
  {
    id: 1,
    title: "اشتراک سه‌ماهه",
    amount: "۲,۴۰۰,۰۰۰ تومان",
    date: "۱۴۰۵/۰۸/۰۱",
    status: "paid",
  },
  {
    id: 2,
    title: "قسط دوم اشتراک",
    amount: "۸۰۰,۰۰۰ تومان",
    date: "۱۴۰۵/۰۹/۰۱",
    status: "pending",
  },
];

function PageHeader({ title, description, icon: Icon }) {
  return (
    <div className="workspace-header">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {Icon && <Icon size={30} />}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="workspace-empty">
      <Dumbbell size={32} />
      <p>{message}</p>
    </div>
  );
}

export function MemberBookings() {
  const [bookings, setBookings] = useState(demoBookings);

  const cancelBooking = (id) => {
    setBookings((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status: "cancelled" }
          : item
      )
    );
  };

  return (
    <div className="workspace-page">
      <PageHeader
        title="رزروهای من"
        description="مشاهده و مدیریت جلسات تمرینی"
        icon={CalendarDays}
      />

      {bookings.length === 0 ? (
        <EmptyState message="هنوز رزروی ثبت نکرده‌اید." />
      ) : (
        <div className="workspace-list">
          {bookings.map((booking) => (
            <div className="workspace-card" key={booking.id}>
              <div>
                <h3>{booking.title}</h3>
                <p>مربی: {booking.trainer}</p>
                <p>{booking.date} - ساعت {booking.time}</p>
              </div>

              <div className="workspace-actions">
                <span className={`status ${booking.status}`}>
                  {booking.status === "confirmed" && "تأیید شده"}
                  {booking.status === "pending" && "در انتظار تأیید"}
                  {booking.status === "cancelled" && "لغو شده"}
                </span>

                {booking.status !== "cancelled" && (
                  <button
                    className="workspace-button danger"
                    onClick={() => cancelBooking(booking.id)}
                  >
                    لغو رزرو
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function MemberPayments() {
  return (
    <div className="workspace-page">
      <PageHeader
        title="پرداخت‌های من"
        description="تاریخچه پرداخت‌ها و اقساط"
        icon={CreditCard}
      />

      <div className="workspace-list">
        {demoPayments.map((payment) => (
          <div className="workspace-card" key={payment.id}>
            <div>
              <h3>{payment.title}</h3>
              <p>{payment.amount}</p>
              <p>{payment.date}</p>
            </div>

            <span className={`status ${payment.status}`}>
              {payment.status === "paid" ? "پرداخت شده" : "پرداخت نشده"}
            </span>
          </div>
        ))}
      </div>

      <p className="workspace-notice">
        این پرداخت‌ها صرفاً نمایشی هستند و هیچ تراکنش بانکی واقعی انجام نمی‌شود.
      </p>
    </div>
  );
}

export function MemberProgress() {
  return (
    <div className="workspace-page">
      <PageHeader
        title="پیشرفت ورزشی"
        description="مرور وضعیت و روند پیشرفت شما"
        icon={Activity}
      />

      <div className="workspace-stats">
        <div className="workspace-card">
          <Activity size={24} />
          <h3>۴ جلسه</h3>
          <p>تمرین تکمیل‌شده</p>
        </div>

        <div className="workspace-card">
          <Dumbbell size={24} />
          <h3>۱۲ ساعت</h3>
          <p>زمان تمرین</p>
        </div>
      </div>

      <EmptyState message="برای نمایش نمودار پیشرفت، ابتدا باید اطلاعات اندازه‌گیری ثبت شود." />
    </div>
  );
}

export function MemberOrders() {
  return (
    <div className="workspace-page">
      <PageHeader
        title="سفارش‌های من"
        description="پیگیری سفارش‌های فروشگاه فیت‌لند"
        icon={ShoppingBag}
      />

      <EmptyState message="هنوز سفارشی ثبت نکرده‌اید." />
    </div>
  );
}

export function MemberMembership() {
  return (
    <div className="workspace-page">
      <PageHeader
        title="اشتراک من"
        description="مشاهده وضعیت و جزئیات عضویت"
        icon={Crown}
      />

      <div className="workspace-card">
        <div>
          <h3>اشتراک سه‌ماهه</h3>
          <p>وضعیت: فعال (داده نمایشی)</p>
          <p>تاریخ پایان: ۱۴۰۵/۱۱/۰۱</p>
        </div>
        <CheckCircle2 size={28} />
      </div>
    </div>
  );
}
