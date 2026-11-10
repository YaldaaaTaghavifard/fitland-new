
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock,
  Plus,
  Trash2,
  Users,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { trainerService } from "../../services/trainerService";

export default function TrainerCalendar() {
  const { user } = useAuth();
  const trainerId = user?.id || "trainer-1";

  const [availability, setAvailability] = useState(() => trainerService.getAvailability(trainerId));
  const [bookings, setBookings] = useState(() => trainerService.getAllBookings(trainerId));
  const [date, setDate] = useState("");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("10:00");
  const [message, setMessage] = useState("");

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const refresh = useCallback(() => {
    setAvailability(trainerService.getAvailability(trainerId));
    setBookings(trainerService.getAllBookings(trainerId));
  }, [trainerId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function addSlot(event) {
    event.preventDefault();
    setMessage("");

    if (!date || start >= end) {
      setMessage("تاریخ و بازه زمانی معتبر وارد کنید.");
      return;
    }

    if (date < new Date().toISOString().slice(0, 10)) {
      setMessage("امکان ثبت زمان آزاد در تاریخ گذشته وجود ندارد.");
      return;
    }

    const result = trainerService.addAvailability(trainerId, {
      date,
      start,
      end,
    });

    if (!result.success) {
      setMessage(result.message);
      return;
    }

    setMessage("بازه زمانی با موفقیت اضافه شد.");
    refresh();
  }

  function removeSlot(slotId) {
    const result = trainerService.removeAvailability(trainerId, slotId);

    setMessage(
      result.success ? "بازه زمانی حذف شد." : result.message
    );

    refresh();
  }

  return (
    <section className="trainer-page">
      <div className="trainer-page-heading">
        <div>
          <span>TRAINER CALENDAR</span>
          <h1>تقویم و زمان‌بندی</h1>
          <p>مدیریت زمان‌های آزاد و مشاهده رزروهای اعضا</p>
        </div>

        <div className="trainer-heading-icon">
          <CalendarDays />
        </div>
      </div>

      <div className="trainer-summary-grid">
        <div className="trainer-summary-card">
          <Clock />
          <span>بازه‌های آزاد</span>
          <strong>{availability.length}</strong>
        </div>

        <div className="trainer-summary-card">
          <CalendarDays />
          <span>کل رزروهای اعضا</span>
          <strong>{bookings.length}</strong>
        </div>

        <div className="trainer-summary-card">
          <Users />
          <span>رزروهای تأییدشده</span>
          <strong>
            {bookings.filter((item) => item.status === "confirmed").length}
          </strong>
        </div>
      </div>

      <article className="trainer-panel-card">
        <div className="trainer-panel-heading">
          <Plus />
          <h2>افزودن زمان آزاد</h2>
        </div>

        <form className="trainer-availability-form" onSubmit={addSlot}>
          <label>
            تاریخ
            <input
              type="date"
              value={date}
              min={todayStr}
              onChange={(event) => setDate(event.target.value)}
              required
            />
          </label>

          <label>
            ساعت شروع
            <input
              type="time"
              value={start}
              onChange={(event) => setStart(event.target.value)}
              required
            />
          </label>

          <label>
            ساعت پایان
            <input
              type="time"
              value={end}
              onChange={(event) => setEnd(event.target.value)}
              required
            />
          </label>

          <button className="trainer-primary-button" type="submit">
            <Plus size={16} />
            ثبت زمان آزاد
          </button>
        </form>

        {message && <div className="trainer-editor-message">{message}</div>}
      </article>

      <article className="trainer-panel-card">
        <div className="trainer-panel-heading">
          <Clock />
          <h2>زمان‌های آزاد من</h2>
        </div>

        {availability.length === 0 ? (
          <p>هنوز زمان آزادی ثبت نکرده‌اید.</p>
        ) : (
          <div className="trainer-simple-list">
            {availability
              .slice()
              .sort((a, b) =>
                `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`)
              )
              .map((slot) => (
                <div className="trainer-simple-row" key={slot.id}>
                  <div>
                    <strong>{slot.date}</strong>
                    <span>{slot.start} تا {slot.end}</span>
                  </div>

                  <button
                    type="button"
                    className="trainer-icon-danger"
                    onClick={() => removeSlot(slot.id)}
                    title="حذف بازه آزاد"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
          </div>
        )}
      </article>

      <article className="trainer-panel-card">
        <div className="trainer-panel-heading">
          <CalendarDays />
          <h2>رزروهای اعضا</h2>
        </div>

        {bookings.length === 0 ? (
          <p>رزروی برای اعضای شما ثبت نشده است.</p>
        ) : (
          <div className="trainer-simple-list">
            {bookings.map((booking) => (
              <div className="trainer-simple-row" key={booking.id}>
                <div>
                  <strong>{booking.title}</strong>
                  <span>
                    عضو: {booking.memberName} ـ {booking.date} ـ {booking.time}
                  </span>
                </div>

                <span className="trainer-mini-status">
                  {booking.status === "confirmed" ? (
                    <>
                      <CheckCircle2 size={14} />
                      تأیید شده
                    </>
                  ) : (
                    "لغو شده"
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}
