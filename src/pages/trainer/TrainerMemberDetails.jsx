
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  UserRound,
  Dumbbell,
  CalendarDays,
  Activity,
  ClipboardList,
  Plus,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { trainerService } from "../../services/trainerService";

export default function TrainerMemberDetails() {
  const { memberId } = useParams();
  const { user } = useAuth();
  const trainerId = user?.id || "trainer-1";

  const [member, setMember] = useState(null);
  const [followUps, setFollowUps] = useState([]);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const refresh = useCallback(() => {
    const assigned = trainerService.getAssignedMembers(trainerId);
    setMember(assigned.find((item) => item.id === memberId) || null);
    setFollowUps(
      trainerService
        .getFollowUps(trainerId)
        .filter((item) => item.memberId === memberId)
    );
  }, [trainerId, memberId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function addNote(event) {
    event.preventDefault();
    setError("");

    if (!title.trim() || !note.trim()) {
      setError("عنوان و متن یادداشت را وارد کنید.");
      return;
    }

    trainerService.addFollowUp(trainerId, {
      memberId,
      title: title.trim(),
      note: note.trim(),
      date: new Date().toISOString().slice(0, 10),
    });

    setTitle("");
    setNote("");
    refresh();
  }

  function completeFollowUp(id) {
    trainerService.updateFollowUp(trainerId, id, "completed");
    refresh();
  }

  if (!member) {
    return (
      <div className="trainer-empty">
        <h2>پرونده عضو پیدا نشد</h2>
        <p>ممکن است این عضو به حساب مربی اختصاص داده نشده باشد.</p>
        <Link to="/trainer/members">بازگشت به اعضا</Link>
      </div>
    );
  }

  const activeBookings = member.bookings.filter(
    (item) => item.status === "confirmed"
  );

  return (
    <section className="trainer-page">
      <Link className="trainer-back-link" to="/trainer/members">
        <ArrowRight size={17} />
        بازگشت به فهرست اعضا
      </Link>

      <div className="trainer-member-profile">
        <div className="trainer-member-avatar large">
          <UserRound size={32} />
        </div>

        <div>
          <span>پرونده عضو</span>
          <h1>{member.name}</h1>
          <p>{member.email} ـ {member.phone || "شماره ثبت نشده"}</p>
        </div>
      </div>

      <div className="trainer-summary-grid">
        <div className="trainer-summary-card">
          <Dumbbell />
          <span>حرکات تکمیل‌شده</span>
          <strong>{member.completedExercises.length}</strong>
        </div>

        <div className="trainer-summary-card">
          <CalendarDays />
          <span>رزرو فعال</span>
          <strong>{activeBookings.length}</strong>
        </div>

        <div className="trainer-summary-card">
          <Activity />
          <span>برنامه تمرینی</span>
          <strong>{member.trainingPlan ? "فعال" : "ندارد"}</strong>
        </div>
      </div>

      <div className="trainer-detail-grid">
        <article className="trainer-panel-card">
          <div className="trainer-panel-heading">
            <Dumbbell />
            <h2>برنامه تمرینی فعلی</h2>
          </div>

          {member.trainingPlan ? (
            <>
              <h3>{member.trainingPlan.title}</h3>
              <p>مربی: {member.trainingPlan.trainer}</p>
              <p>تعداد روزهای تمرین: {member.trainingPlan.days?.length || 0}</p>
            </>
          ) : (
            <p>برای این عضو هنوز برنامه تمرینی ثبت نشده است.</p>
          )}

          <Link
            className="trainer-action-link"
            to={`/trainer/members/${member.id}/training`}
          >
            ویرایش برنامه تمرینی
          </Link>
        </article>

        <article className="trainer-panel-card">
          <div className="trainer-panel-heading">
            <Activity />
            <h2>برنامه تغذیه فعلی</h2>
          </div>

          {member.nutritionPlan ? (
            <>
              <h3>{member.nutritionPlan.title}</h3>
              <p>تنظیم‌کننده: {member.nutritionPlan.trainer}</p>
              <p>تعداد وعده‌ها: {member.nutritionPlan.meals?.length || 0}</p>
            </>
          ) : (
            <p>برای این عضو هنوز برنامه تغذیه ثبت نشده است.</p>
          )}

          <Link
            className="trainer-action-link"
            to={`/trainer/members/${member.id}/nutrition`}
          >
            ویرایش برنامه تغذیه
          </Link>
        </article>
      </div>

      <article className="trainer-panel-card">
        <div className="trainer-panel-heading">
          <CalendarDays />
          <h2>رزروهای عضو</h2>
        </div>

        {member.bookings.length === 0 ? (
          <p>رزروی برای این عضو ثبت نشده است.</p>
        ) : (
          <div className="trainer-simple-list">
            {member.bookings.map((booking) => (
              <div className="trainer-simple-row" key={booking.id}>
                <div>
                  <strong>{booking.title}</strong>
                  <span>{booking.date} ـ {booking.time}</span>
                </div>
                <span className={`trainer-mini-status ${booking.status}`}>
                  {booking.status === "confirmed" ? "تأیید شده" : "لغو شده"}
                </span>
              </div>
            ))}
          </div>
        )}
      </article>

      <article className="trainer-panel-card">
        <div className="trainer-panel-heading">
          <ClipboardList />
          <h2>یادداشت‌ها و پیگیری‌ها</h2>
        </div>

        <form className="trainer-followup-form" onSubmit={addNote}>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="عنوان پیگیری"
          />

          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="توضیحات و اقدام موردنیاز..."
            rows="3"
          />

          {error && <p className="trainer-form-error">{error}</p>}

          <button className="trainer-primary-button" type="submit">
            <Plus size={17} />
            ثبت پیگیری
          </button>
        </form>

        <div className="trainer-followup-list">
          {followUps.length === 0 ? (
            <p>هنوز یادداشتی ثبت نشده است.</p>
          ) : (
            followUps.map((item) => (
              <div className="trainer-followup-item" key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.note}</p>
                  <span>{item.date}</span>
                </div>

                {item.status === "completed" ? (
                  <span className="trainer-completed">
                    <CheckCircle2 size={16} />
                    انجام شد
                  </span>
                ) : (
                  <button
                    type="button"
                    className="trainer-complete-button"
                    onClick={() => completeFollowUp(item.id)}
                  >
                    تکمیل پیگیری
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </article>
    </section>
  );
}
