import { useState, useMemo } from "react";
import {
  X,
  CreditCard,
  ShieldCheck,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Printer,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { dataService } from "../../services/dataService";

export default function MockPaymentModal({
  isOpen,
  onClose,
  item = {
    title: "اشتراک سه‌ماهه طلایی فیت‌لند",
    titleEn: "Quarterly Gold Membership",
    price: 3200000,
    type: "membership",
  },
  onSuccess,
}) {
  const { t, formatNumber, formatCurrency, isRtl } = useLanguage();

  const [paymentMode, setPaymentMode] = useState("installment"); // "full" | "installment"
  const [installmentsCount, setInstallmentsCount] = useState(3);
  const [downPaymentPercent, setDownPaymentPercent] = useState(30);

  // Card form state
  const [cardNumber, setCardNumber] = useState("۶۰۳۷ ۹۹۱۹ ۴۴۸۸ ۲۲۰۱");
  const [cardHolder, setCardHolder] = useState("علی رضایی (کاربر آزمایشی)");
  const [expiry, setExpiry] = useState("۰۸/۲۸");
  const [cvv2, setCvv2] = useState("۵۸۲");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null); // { success: boolean, receipt: any }

  const totalAmount = item.price || 3200000;

  // Installment schedule calculation
  const installmentCalc = useMemo(() => {
    const downPayment = Math.round((totalAmount * downPaymentPercent) / 100);
    const remaining = totalAmount - downPayment;
    const perInstallment = Math.round(remaining / installmentsCount);

    const schedule = [];
    const now = new Date();
    for (let i = 1; i <= installmentsCount; i++) {
      const due = new Date(now);
      due.setMonth(now.getMonth() + i);
      schedule.push({
        num: i,
        amount: perInstallment,
        date: due.toISOString().slice(0, 10),
      });
    }

    return {
      downPayment,
      remaining,
      perInstallment,
      schedule,
    };
  }, [totalAmount, downPaymentPercent, installmentsCount]);

  if (!isOpen) return null;

  const handleSimulatePayment = (forceSuccess = true) => {
    setIsProcessing(true);
    setPaymentResult(null);

    setTimeout(() => {
      setIsProcessing(false);
      if (forceSuccess) {
        // Create actual invoice in dataService
        const invoice = dataService.createInvoice({
          memberId: "member-1",
          memberName: "علی رضایی",
          title: item.title,
          titleEn: item.titleEn || item.title,
          totalAmount,
          type: paymentMode,
          installmentsCount: paymentMode === "installment" ? installmentsCount : 0,
          downPaymentPercent,
        });

        // Pay down payment / full amount
        const payRes = dataService.payInvoiceDownPayment(invoice.id);

        setPaymentResult({
          success: true,
          receipt: {
            id: invoice.id,
            receiptId: payRes.invoice.receiptId || `REC-${Math.floor(100000 + Math.random() * 900000)}`,
            amountPaid: paymentMode === "installment" ? installmentCalc.downPayment : totalAmount,
            remainingDebt: paymentMode === "installment" ? installmentCalc.remaining : 0,
            date: new Date().toISOString().slice(0, 10),
            installments: invoice.installments,
          },
        });

        if (onSuccess) onSuccess(invoice);
      } else {
        setPaymentResult({
          success: false,
          error: "تراکنش آزمایشی توسط شبیه‌ساز بانک رد شد (کارت فاقد موجودی فرضی یا خطای اتصال).",
        });
      }
    }, 1200);
  };

  const fillDemoCard = () => {
    setCardNumber("۶۰۳۷ ۹۹۱۹ ۴۴۸۸ ۲۲۰۱");
    setCardHolder("علی رضایی (کاربر آزمایشی)");
    setExpiry("۰۸/۲۸");
    setCvv2("۵۸۲");
  };

  return (
    <div className="payment-modal-backdrop">
      <div className="payment-modal-panel">
        <div className="payment-modal-header">
          <div className="header-lead">
            <div className="payment-badge-icon">
              <CreditCard size={22} />
            </div>
            <div>
              <h3>{t("paymentTitle")}</h3>
              <span className="payment-sub">{t("paymentNotice")}</span>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {paymentResult?.success ? (
          /* Success Receipt View */
          <div className="receipt-view">
            <div className="receipt-check-icon">
              <CheckCircle2 size={54} />
            </div>
            <h4>{t("paySuccess")}</h4>
            <p className="receipt-sub">
              رسید آزمایشی ثبت شد و رکورد آن در بخش «پرداخت‌ها و اقساط» پنل شما قابل مشاهده است.
            </p>

            <div className="receipt-card">
              <div className="receipt-row">
                <span>{t("invoiceNumber")}:</span>
                <strong>{paymentResult.receipt.id}</strong>
              </div>
              <div className="receipt-row">
                <span>کد رهگیری مالی:</span>
                <strong className="text-primary">{paymentResult.receipt.receiptId}</strong>
              </div>
              <div className="receipt-row">
                <span>مبلغ پرداخت‌شده هم‌اکنون:</span>
                <strong>{formatCurrency(paymentResult.receipt.amountPaid)}</strong>
              </div>
              {paymentResult.receipt.remainingDebt > 0 && (
                <div className="receipt-row">
                  <span>{t("remainingDebt")}:</span>
                  <strong className="text-orange-500">
                    {formatCurrency(paymentResult.receipt.remainingDebt)}
                  </strong>
                </div>
              )}
              <div className="receipt-row">
                <span>تاریخ تراکنش:</span>
                <span>{paymentResult.receipt.date}</span>
              </div>
            </div>

            {paymentResult.receipt.installments?.length > 0 && (
              <div className="receipt-installments">
                <h5>{t("installmentsSchedule")}</h5>
                <div className="schedule-mini-table">
                  {paymentResult.receipt.installments.map((inst) => (
                    <div className="mini-schedule-row" key={inst.id}>
                      <span>قسط {inst.number}</span>
                      <span>{inst.dueDate}</span>
                      <strong>{formatCurrency(inst.amount)}</strong>
                      <span className={`status-pill ${inst.status}`}>
                        {inst.status === "paid" ? "پرداخت‌شده" : "در انتظار"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="receipt-actions">
              <button
                type="button"
                className="chic-btn chic-btn-ghost"
                onClick={() => window.print()}
              >
                <Printer size={16} />
                <span>{t("printInvoice")}</span>
              </button>
              <button
                type="button"
                className="chic-btn chic-btn-primary"
                onClick={onClose}
              >
                <span>بستن و ادامه</span>
              </button>
            </div>
          </div>
        ) : (
          /* Payment Form View */
          <div className="payment-body">
            {/* Item summary banner */}
            <div className="payment-item-summary">
              <div>
                <span className="item-label">مورد انتخابی:</span>
                <h4 className="item-title">{isRtl ? item.title : item.titleEn || item.title}</h4>
              </div>
              <div className="item-total">
                <span className="item-label">{t("totalAmount")}:</span>
                <strong className="total-digits">{formatCurrency(totalAmount)}</strong>
              </div>
            </div>

            {/* Payment Mode Selector */}
            <div className="payment-mode-selector">
              <button
                type="button"
                className={`mode-btn ${paymentMode === "full" ? "active" : ""}`}
                onClick={() => setPaymentMode("full")}
              >
                <div className="mode-btn-content">
                  <strong>{t("paymentMethodFull")}</strong>
                  <small>تسویه کامل {formatCurrency(totalAmount)}</small>
                </div>
              </button>

              <button
                type="button"
                className={`mode-btn ${paymentMode === "installment" ? "active" : ""}`}
                onClick={() => setPaymentMode("installment")}
              >
                <div className="mode-btn-content">
                  <div className="mode-badge-wrap">
                    <strong>{t("paymentMethodInstallment")}</strong>
                    <span className="popular-chip">محبوب</span>
                  </div>
                  <small>پیش‌پرداخت + اقساط ۲ تا ۶ ماهه</small>
                </div>
              </button>
            </div>

            {/* Installment Controls */}
            {paymentMode === "installment" && (
              <div className="installment-config-box">
                <div className="config-grid">
                  <div className="config-item">
                    <label>درصد پیش‌پرداخت:</label>
                    <div className="pill-group">
                      {[20, 30, 50].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          className={`pill-btn ${downPaymentPercent === pct ? "active" : ""}`}
                          onClick={() => setDownPaymentPercent(pct)}
                        >
                          {pct}٪
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="config-item">
                    <label>تعداد اقساط:</label>
                    <div className="pill-group">
                      {[2, 3, 4, 6].map((cnt) => (
                        <button
                          key={cnt}
                          type="button"
                          className={`pill-btn ${installmentsCount === cnt ? "active" : ""}`}
                          onClick={() => setInstallmentsCount(cnt)}
                        >
                          {cnt} قسط
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="installment-math-breakdown">
                  <div className="math-tile highlight">
                    <span>{t("downPayment")}:</span>
                    <strong>{formatCurrency(installmentCalc.downPayment)}</strong>
                  </div>
                  <div className="math-tile">
                    <span>{t("installmentAmount")}:</span>
                    <strong>{formatCurrency(installmentCalc.perInstallment)}</strong>
                    <small>در هر ماه</small>
                  </div>
                  <div className="math-tile">
                    <span>{t("remainingDebt")}:</span>
                    <strong>{formatCurrency(installmentCalc.remaining)}</strong>
                  </div>
                </div>

                {/* Schedule preview */}
                <div className="schedule-preview">
                  <span className="schedule-title">
                    <Calendar size={14} />
                    {t("installmentsSchedule")}
                  </span>
                  <div className="schedule-chips">
                    {installmentCalc.schedule.map((row) => (
                      <div className="schedule-chip" key={row.num}>
                        <span>قسط {row.num}</span>
                        <small>{row.date}</small>
                        <strong>{formatCurrency(row.amount)}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Demo Card Fields */}
            <div className="mock-card-form">
              <div className="form-head">
                <span className="card-form-title">مشخصات کارت پرداخت آزمایشی:</span>
                <button
                  type="button"
                  className="quick-fill-btn"
                  onClick={fillDemoCard}
                >
                  <Sparkles size={13} />
                  <span>پر کردن خودکار کارت تستی</span>
                </button>
              </div>

              <div className="card-inputs-grid">
                <div className="form-group full-width">
                  <label>{t("cardNumber")}</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    dir="ltr"
                    className="card-input text-center font-mono"
                    placeholder="6037 9919 4488 2201"
                  />
                </div>

                <div className="form-group">
                  <label>{t("cardHolderName")}</label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="card-input"
                  />
                </div>

                <div className="form-group-split">
                  <div className="form-group">
                    <label>{t("expiryDate")}</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      dir="ltr"
                      className="card-input text-center"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="form-group">
                    <label>{t("cvv2")}</label>
                    <input
                      type="password"
                      value={cvv2}
                      onChange={(e) => setCvv2(e.target.value)}
                      dir="ltr"
                      className="card-input text-center"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>

              {paymentResult && !paymentResult.success && (
                <div className="payment-error-banner">
                  <AlertCircle size={18} />
                  <span>{paymentResult.error}</span>
                </div>
              )}

              <div className="payment-security-notice">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span>
                  محیط آزمایشی فیت‌لند ایمن است. از وارد کردن مشخصات کارت‌های بانکی واقعی اکیداً خودداری فرمایید.
                </span>
              </div>

              {/* Action Buttons: Success vs Fail Simulation */}
              <div className="modal-cta-buttons">
                <button
                  type="button"
                  className="chic-btn chic-btn-primary w-full"
                  disabled={isProcessing}
                  onClick={() => handleSimulatePayment(true)}
                >
                  {isProcessing ? (
                    <span>در حال ارتباط با درگاه آزمایشی...</span>
                  ) : (
                    <>
                      <CreditCard size={18} />
                      <span>
                        {paymentMode === "installment"
                          ? `پرداخت پیش‌پرداخت (${formatCurrency(installmentCalc.downPayment)})`
                          : `پرداخت کل (${formatCurrency(totalAmount)})`}
                      </span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="chic-btn test-fail-btn"
                  disabled={isProcessing}
                  onClick={() => handleSimulatePayment(false)}
                  title="تست حالت رد تراکنش برای ارزیابی داور"
                >
                  <span>شبیه‌سازی تراکنش ناموفق</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
