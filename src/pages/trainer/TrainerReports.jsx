
import { useMemo, useState } from "react";
import {
  FileBarChart,
  Users,
  Activity,
  CalendarCheck,
  AlertTriangle,
  Download,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { trainerService } from "../../services/trainerService";

const monthNames = [
  "فروردین", "اردیبهشت", "خرداد", "تیر",
  "مرداد", "شهریور", "مهر", "آبان",
  "آذر", "دی", "بهمن", "اسفند",
];

export default function TrainerReports() {
  const { user } = useAuth();
  const trainerId = user?.id || "trainer-1";

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const report = useMemo(
    () => trainerService.getMonthlyReport(trainerId, year, month),
    [trainerId, year, month]
  );

  const formatNumber = (value) =>
    new Intl.NumberFormat("fa-IR").format(value);

  function downloadCSV() {
    const rows = [
      ["نام عضو", "تعداد حرکت تکمیل‌شده", "تعداد رزرو", "وضعیت فعالیت"],
      ...report.members.map((member) => [
        member.memberName,
        member.completedExercises,
        member.bookings,
        member.hasActivity
          ? "دارای فعالیت ثبت‌شده"
          : "بدون فعالیت ثبت‌شده",
      ]),
    ];

    const csv = "\uFEFF" + rows
      .map((row) =>
        row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `fitland-trainer-report-${year}-${month}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="trainer-page">
      <div className="trainer-page-heading">
        <div>
          <span>MONTHLY PERFORMANCE</span>
          <h1>گزارش عملکرد اعضا</h1>
          <p>بررسی وضعیت فعالیت اعضای اختصاص‌یافته به شما</p>
        </div>

        <div className="trainer-heading-icon">
          <FileBarChart />
        </div>
      </div>

      <article className="trainer-panel-card">
        <div className="trainer-report-filters">
          <label>
            سال میلادی
            <select
              value={year}
              onChange={(event) => setYear(Number(event.target.value))}
            >
              {[2025, 2026, 2027, 2028].map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            ماه
            <select
              value={month}
              onChange={(event) => setMonth(Number(event.target.value))}
            >
              {Array.from({ length: 12 }, (_, index) => index + 1).map((item) => (
                <option key={item} value={item}>
                  {monthNames[item - 1]} ({item})
                </option>
              ))}
            </select>
          </label>

          <button
            className="trainer-secondary-button"
            onClick={downloadCSV}
            type="button"
          >
            <Download size={16} />
            خروجی CSV
          </button>
        </div>
      </article>

      <div className="trainer-summary-grid">
        <div className="trainer-summary-card">
          <Users />
          <span>کل اعضا</span>
          <strong>{formatNumber(report.totalMembers)}</strong>
        </div>

        <div className="trainer-summary-card">
          <Activity />
          <span>دارای فعالیت ثبت‌شده</span>
          <strong>{formatNumber(report.activeMembers)}</strong>
        </div>

        <div className="trainer-summary-card warning">
          <AlertTriangle />
          <span>بدون فعالیت ثبت‌شده</span>
          <strong>{formatNumber(report.inactiveMembers)}</strong>
        </div>

        <div className="trainer-summary-card">
          <CalendarCheck />
          <span>تعداد رزروهای ماه</span>
          <strong>{formatNumber(report.totalBookings)}</strong>
        </div>
      </div>

      <article className="trainer-panel-card">
        <div className="trainer-panel-heading">
          <FileBarChart />
          <h2>جزئیات عملکرد اعضا</h2>
        </div>

        <div className="trainer-report-table-wrapper">
          <table className="trainer-report-table">
            <thead>
              <tr>
                <th>نام عضو</th>
                <th>حرکات تکمیل‌شده</th>
                <th>رزروها</th>
                <th>وضعیت فعالیت</th>
                <th>اقدام</th>
              </tr>
            </thead>

            <tbody>
              {report.members.length === 0 ? (
                <tr>
                  <td colSpan="5">عضوی برای گزارش وجود ندارد.</td>
                </tr>
              ) : (
                report.members.map((member) => (
                  <tr key={member.memberId}>
                    <td>{member.memberName}</td>
                    <td>{formatNumber(member.completedExercises)}</td>
                    <td>{formatNumber(member.bookings)}</td>
                    <td>
                      <span
                        className={
                          member.hasActivity
                            ? "trainer-report-active"
                            : "trainer-report-inactive"
                        }
                      >
                        {member.hasActivity
                          ? "دارای فعالیت ثبت‌شده"
                          : "بدون فعالیت ثبت‌شده"}
                      </span>
                    </td>
                    <td>
                      <a href={`/trainer/members/${member.memberId}`}>
                        مشاهده پرونده
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </article>

      <div className="trainer-report-disclaimer">
        <AlertTriangle size={18} />
        <p>
          «بدون فعالیت ثبت‌شده» به معنی عدم حضور قطعی در باشگاه نیست؛
          فقط نشان می‌دهد در داده‌های قابل مشاهده سامانه برای این بازه
          فعالیتی ثبت نشده است.
        </p>
      </div>
    </section>
  );
}
