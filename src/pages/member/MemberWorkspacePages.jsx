
import { useState } from "react";
import {
  CalendarDays,
  CreditCard,
  Activity,
  ShoppingBag,
  Crown,
  CheckCircle2,
  Dumbbell,
  Clock,
  Printer,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { dataService } from "../../services/dataService";

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
  const { user } = useAuth();
  const { t, isRtl, formatNumber } = useLanguage();
  const [bookings, setBookings] = useState(() => dataService.getBookings());

  const userBookings = bookings.filter((b) => b.memberId === (user?.id || "member-1"));

  const cancelBooking = (id) => {
    dataService.cancelBooking(id);
    setBookings(dataService.getBookings());
  };

  return (
    <div className="workspace-page">
      <PageHeader
        title={t("myBookings")}
        description={isRtl ? "مشاهده، پیگیری و مدیریت جلسات کلاسی رزرو شده" : "View, track and manage your booked class sessions"}
        icon={CalendarDays}
      />

      {userBookings.length === 0 ? (
        <EmptyState message={isRtl ? "هنوز رزروی ثبت نکرده‌اید. از صفحه کلاس‌ها جلسه رزرو کنید." : "No bookings yet. Visit the Classes page to reserve a spot."} />
      ) : (
        <div className="workspace-list">
          {userBookings.map((booking) => (
            <div className="workspace-card" key={booking.id}>
              <div>
                <h3>{booking.classTitle}</h3>
                <p>{isRtl ? `مربی: ${booking.trainerName}` : `Trainer: ${booking.trainerName}`}</p>
                <p>
                  <Clock size={14} style={{ display: "inline", verticalAlign: "middle", marginInlineEnd: 4 }} />
                  {booking.date} - {isRtl ? `ساعت ${booking.time}` : `Time ${booking.time}`}
                </p>
              </div>

              <div className="workspace-actions">
                <span className={`status ${booking.status}`}>
                  {booking.status === "confirmed" && (isRtl ? "تأیید شده" : "Confirmed")}
                  {booking.status === "pending" && (isRtl ? "در انتظار" : "Pending")}
                  {booking.status === "cancelled" && (isRtl ? "لغو شده" : "Cancelled")}
                </span>

                {booking.status !== "cancelled" && (
                  <button
                    className="workspace-button danger"
                    onClick={() => cancelBooking(booking.id)}
                  >
                    {isRtl ? "لغو رزرو" : "Cancel"}
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
  const { user } = useAuth();
  const { t, isRtl, formatCurrency, formatNumber } = useLanguage();
  const [invoices, setInvoices] = useState(() => dataService.getInvoices());

  const userInvoices = invoices.filter((inv) => inv.memberId === (user?.id || "member-1"));

  const handlePayInstallment = (invoiceId, installmentId) => {
    const res = dataService.payInstallment(invoiceId, installmentId);
    if (res.success) {
      setInvoices(dataService.getInvoices());
    }
  };

  return (
    <div className="workspace-page">
      <PageHeader
        title={t("myPayments")}
        description={isRtl ? "تاریخچه پرداخت‌ها، فاکتورهای اقساطی و سررسیدها" : "Payment history, installment schedules and due dates"}
        icon={CreditCard}
      />

      {userInvoices.length === 0 ? (
        <EmptyState message={isRtl ? "هنوز فاکتور یا پرداختی ثبت نشده است." : "No invoices or payments registered yet."} />
      ) : (
        <div className="workspace-list">
          {userInvoices.map((inv) => (
            <div className="workspace-card" key={inv.id} style={{ flexDirection: "column", alignItems: "stretch", gap: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16 }}>{isRtl ? inv.title : inv.titleEn || inv.title}</h3>
                  <small style={{ color: "var(--text-secondary)" }}>
                    {t("invoiceNumber")}: {inv.id} | {inv.date}
                  </small>
                </div>
                <div style={{ textAlign: isRtl ? "left" : "right" }}>
                  <strong style={{ fontSize: 16, color: "var(--primary)" }}>{formatCurrency(inv.totalAmount)}</strong>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    {isRtl ? `پیش‌پرداخت: ${formatCurrency(inv.downPayment)}` : `Down Payment: ${formatCurrency(inv.downPayment)}`}
                  </div>
                </div>
              </div>

              {inv.installments && inv.installments.length > 0 && (
                <div style={{ background: "var(--surface-secondary)", padding: "12px 16px", borderRadius: 12 }}>
                  <strong style={{ fontSize: 13, display: "block", marginBottom: 8 }}>
                    {t("installmentsSchedule")} ({formatNumber(inv.installments.length)} {isRtl ? "قسط" : "installments"}):
                  </strong>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {inv.installments.map((inst) => (
                      <div
                        key={inst.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: 12.5,
                          padding: "6px 0",
                          borderBottom: "1px dashed var(--border-color)",
                        }}
                      >
                        <span>{isRtl ? `قسط ${inst.number}` : `Installment ${inst.number}`} ({inst.dueDate})</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <strong>{formatCurrency(inst.amount)}</strong>
                          <span className={`status-pill ${inst.status}`}>
                            {inst.status === "paid" ? (isRtl ? "پرداخت شده ✓" : "Paid ✓") : (isRtl ? "در انتظار سررسید" : "Pending")}
                          </span>
                          {inst.status === "pending" && (
                            <button
                              type="button"
                              className="chic-btn chic-btn-primary btn-sm"
                              style={{ padding: "4px 10px", fontSize: 11 }}
                              onClick={() => handlePayInstallment(inv.id, inst.id)}
                            >
                              {isRtl ? "پرداخت قسط" : "Pay"}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "var(--text-secondary)" }}>
                <span>{isRtl ? `مانده بدهی: ${formatCurrency(inv.remainingDebt)}` : `Remaining: ${formatCurrency(inv.remainingDebt)}`}</span>
                <button
                  type="button"
                  style={{ background: "transparent", border: "none", color: "var(--primary)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 700 }}
                  onClick={() => window.print()}
                >
                  <Printer size={14} />
                  <span>{t("printInvoice")}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="workspace-notice">
        {t("paymentNotice")}
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
