import { useMemo, useState } from "react";
import {
  Activity,
  Plus,
  Scale,
  Ruler,
  Trash2,
  TrendingUp,
  Info,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useAuth } from "../../context/AuthContext";
import { fitnessService } from "../../services/fitnessService";

const initialForm = {
  date: new Date().toISOString().slice(0, 10),
  weight: "",
  height: "",
  waist: "",
  arm: "",
  chest: "",
  thigh: "",
  notes: "",
};

const measurementFields = [
  { key: "weight", label: "وزن", unit: "کیلوگرم" },
  { key: "height", label: "قد", unit: "سانتی‌متر" },
  { key: "waist", label: "دور کمر", unit: "سانتی‌متر" },
  { key: "arm", label: "دور بازو", unit: "سانتی‌متر" },
  { key: "chest", label: "دور سینه", unit: "سانتی‌متر" },
  { key: "thigh", label: "دور ران", unit: "سانتی‌متر" },
];

function toPersianDate(date) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("fa-IR").format(
    new Date(`${date}T12:00:00`)
  );
}

function formatValue(value) {
  return new Intl.NumberFormat("fa-IR", {
    maximumFractionDigits: 1,
  }).format(Number(value));
}

export default function MemberMeasurements() {
  const auth = useAuth();
  const memberId =
    auth.user?.id || auth.currentUser?.id || "member-1";

  const [records, setRecords] = useState(() =>
    fitnessService.getMeasurements(memberId)
  );

  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [chartMetric, setChartMetric] = useState("weight");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const sortedRecords = useMemo(
    () => [...records].sort((a, b) => a.date.localeCompare(b.date)),
    [records]
  );

  const latest = sortedRecords[sortedRecords.length - 1];
  const previous = sortedRecords[sortedRecords.length - 2];

  const chartData = useMemo(
    () =>
      sortedRecords.map((record) => ({
        date: record.date,
        label: toPersianDate(record.date),
        value: Number(record[chartMetric]),
      })).filter((item) => Number.isFinite(item.value) && item.value > 0),
    [sortedRecords, chartMetric]
  );

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const numericFields = [
      "weight",
      "height",
      "waist",
      "arm",
      "chest",
      "thigh",
    ];

    for (const key of numericFields) {
      const value = Number(form[key]);

      if (!Number.isFinite(value) || value <= 0) {
        setError("لطفاً تمام اندازه‌ها را با عدد معتبر و بزرگ‌تر از صفر وارد کن.");
        return;
      }
    }

    if (!form.date) {
      setError("تاریخ اندازه‌گیری را انتخاب کن.");
      return;
    }

    const duplicate = records.some((item) => item.date === form.date);

    if (duplicate) {
      setError("برای این تاریخ قبلاً اندازه‌گیری ثبت شده است.");
      return;
    }

    const result = fitnessService.addMeasurement(memberId, {
      ...form,
      weight: Number(form.weight),
      height: Number(form.height),
      waist: Number(form.waist),
      arm: Number(form.arm),
      chest: Number(form.chest),
      thigh: Number(form.thigh),
    });

    if (!result.success) {
      setError("ثبت اندازه‌گیری انجام نشد.");
      return;
    }

    setRecords(fitnessService.getMeasurements(memberId));
    setForm(initialForm);
    setShowForm(false);
    setMessage("اندازه‌گیری جدید با موفقیت ثبت شد.");
  }

  function handleDelete(id) {
    if (deleteConfirmId !== id) {
      setDeleteConfirmId(id);
      return;
    }

    const result = fitnessService.deleteMeasurement(memberId, id);

    if (result.success) {
      setRecords(fitnessService.getMeasurements(memberId));
      setMessage("اندازه‌گیری حذف شد.");
    }
    setDeleteConfirmId(null);
  }

  function getDifference(current, old) {
    if (current == null || old == null) return null;

    return Number(current) - Number(old);
  }

  const weightDifference =
    latest && previous
      ? getDifference(latest.weight, previous.weight)
      : null;

  return (
    <div className="fitness-page">
      <div className="fitness-page-heading">
        <div>
          <span className="member-eyebrow">پیگیری پیشرفت</span>
          <h1>اندازه‌گیری بدن</h1>
          <p>سوابق اندازه‌گیری و تغییرات خود را ثبت و بررسی کن.</p>
        </div>

        <button
          type="button"
          className="member-primary-button"
          onClick={() => {
            setShowForm((current) => !current);
            setError("");
            setMessage("");
          }}
        >
          <Plus size={18} />
          ثبت اندازه‌گیری
        </button>
      </div>

      {message && (
        <div className="measurement-message success">{message}</div>
      )}

      {error && (
        <div className="measurement-message error">{error}</div>
      )}

      {showForm && (
        <section className="fitness-content-card">
          <div className="fitness-section-title">
            <div>
              <h2>اندازه‌گیری جدید</h2>
              <p>اطلاعات را با دقت وارد کن.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="measurement-form-grid">
              <label>
                تاریخ اندازه‌گیری
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </label>

              {measurementFields.map((field) => (
                <label key={field.key}>
                  {field.label} ({field.unit})
                  <input
                    type="number"
                    name={field.key}
                    value={form[field.key]}
                    onChange={handleChange}
                    min="0.1"
                    step="0.1"
                    placeholder={`مقدار ${field.label}`}
                    required
                  />
                </label>
              ))}

              <label className="measurement-notes-field">
                توضیحات
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="توضیحات اختیاری..."
                />
              </label>
            </div>

            <div className="measurement-form-actions">
              <button type="submit" className="member-primary-button">
                <Plus size={17} />
                ثبت اطلاعات
              </button>

              <button
                type="button"
                className="measurement-cancel-button"
                onClick={() => setShowForm(false)}
              >
                انصراف
              </button>
            </div>
          </form>
        </section>
      )}

      <div className="measurement-summary-grid">
        <div className="measurement-summary-card">
          <div className="measurement-summary-icon">
            <Scale size={23} />
          </div>
          <span>آخرین وزن ثبت‌شده</span>
          <strong>
            {latest ? `${formatValue(latest.weight)} کیلوگرم` : "—"}
          </strong>
          <small>
            {latest ? toPersianDate(latest.date) : "هنوز ثبت نشده"}
          </small>
        </div>

        <div className="measurement-summary-card">
          <div className="measurement-summary-icon">
            <Ruler size={23} />
          </div>
          <span>آخرین دور کمر</span>
          <strong>
            {latest ? `${formatValue(latest.waist)} سانتی‌متر` : "—"}
          </strong>
          <small>بر اساس آخرین اندازه‌گیری</small>
        </div>

        <div className="measurement-summary-card">
          <div className="measurement-summary-icon">
            <Activity size={23} />
          </div>
          <span>تعداد اندازه‌گیری‌ها</span>
          <strong>{formatValue(records.length)}</strong>
          <small>سوابق ذخیره‌شده</small>
        </div>

        <div className="measurement-summary-card">
          <div className="measurement-summary-icon">
            <TrendingUp size={23} />
          </div>
          <span>تغییر وزن نسبت به رکورد قبل</span>
          <strong>
            {weightDifference == null
              ? "—"
              : `${weightDifference > 0 ? "+" : ""}${formatValue(weightDifference)} کیلوگرم`}
          </strong>
          <small>فقط مقایسه دو رکورد آخر</small>
        </div>
      </div>

      <section className="fitness-content-card">
        <div className="fitness-section-title">
          <div>
            <h2>نمودار تغییرات</h2>
            <p>روند اندازه‌گیری‌های ثبت‌شده در طول زمان</p>
          </div>
        </div>

        <div className="measurement-chart-controls">
          <label htmlFor="chartMetric">شاخص موردنظر:</label>

          <select
            id="chartMetric"
            value={chartMetric}
            onChange={(event) => setChartMetric(event.target.value)}
          >
            {measurementFields.map((field) => (
              <option key={field.key} value={field.key}>
                {field.label}
              </option>
            ))}
          </select>
        </div>

        {chartData.length >= 2 ? (
          <div className="measurement-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid
                  stroke="var(--border-color)"
                  strokeDasharray="4 4"
                />

                <XAxis
                  dataKey="label"
                  stroke="var(--text-secondary)"
                  tick={{ fontSize: 11 }}
                />

                <YAxis
                  stroke="var(--text-secondary)"
                  tick={{ fontSize: 11 }}
                  domain={["auto", "auto"]}
                />

                <Tooltip
                  formatter={(value) => [value, "مقدار"]}
                  labelFormatter={(label) => `تاریخ: ${label}`}
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "12px",
                    color: "var(--text-primary)",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#ff6b35"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="fitness-empty compact">
            برای نمایش نمودار، حداقل دو اندازه‌گیری معتبر از این شاخص ثبت کن.
          </div>
        )}
      </section>

      <section className="fitness-content-card">
        <div className="fitness-section-title">
          <div>
            <h2>تاریخچه اندازه‌گیری‌ها</h2>
            <p>تمام سوابق ثبت‌شده شما</p>
          </div>
        </div>

        <div className="member-table-wrapper">
          <table className="member-table measurement-table">
            <thead>
              <tr>
                <th>تاریخ</th>
                <th>وزن</th>
                <th>قد</th>
                <th>دور کمر</th>
                <th>دور بازو</th>
                <th>دور سینه</th>
                <th>دور ران</th>
                <th>عملیات</th>
              </tr>
            </thead>

            <tbody>
              {[...sortedRecords].reverse().map((record) => (
                <tr key={record.id}>
                  <td>{toPersianDate(record.date)}</td>
                  <td>{formatValue(record.weight)} کیلوگرم</td>
                  <td>{formatValue(record.height)} سانتی‌متر</td>
                  <td>{formatValue(record.waist)}</td>
                  <td>{formatValue(record.arm)}</td>
                  <td>{formatValue(record.chest)}</td>
                  <td>{formatValue(record.thigh)}</td>
                  <td>
                    <button
                      type="button"
                      className="measurement-delete-button"
                      onClick={() => handleDelete(record.id)}
                      title={deleteConfirmId === record.id ? "کلیک مجدد برای تأیید حذف" : "حذف اندازه‌گیری"}
                      style={deleteConfirmId === record.id ? { background: "var(--danger)", color: "#fff", padding: "0 8px", width: "auto" } : undefined}
                    >
                      {deleteConfirmId === record.id ? "تأیید حذف" : <Trash2 size={16} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {records.length === 0 && (
          <div className="fitness-empty compact">
            هنوز اندازه‌گیری ثبت نشده است.
          </div>
        )}
      </section>

      <div className="fitness-note">
        <Info size={18} />
        <p>
          تغییرات وزن و اندازه‌های بدن به‌تنهایی نشان‌دهنده سلامت یا کیفیت
          پیشرفت نیستند. این نمودار فقط اطلاعات ثبت‌شده را نمایش می‌دهد.
        </p>
      </div>
    </div>
  );
}