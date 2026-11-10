
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Users,
  UserRound,
  ChevronLeft,
  Activity,
  CalendarDays,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { trainerService } from "../../services/trainerService";

export default function TrainerMembers() {
  const { user } = useAuth();
  const trainerId = user?.id || "trainer-1";

  const [members, setMembers] = useState(() =>
    trainerService.getAssignedMembers(trainerId)
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    setMembers(trainerService.getAssignedMembers(trainerId));
  }, [trainerId]);

  const filteredMembers = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return members;

    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(value) ||
        member.email.toLowerCase().includes(value) ||
        member.phone?.includes(value)
    );
  }, [members, search]);

  return (
    <section className="trainer-page">
      <div className="trainer-page-heading">
        <div>
          <span>TRAINER MANAGEMENT</span>
          <h1>اعضای من</h1>
          <p>اعضای اختصاص‌یافته به شما و وضعیت فعالیت آن‌ها</p>
        </div>

        <div className="trainer-heading-icon">
          <Users />
        </div>
      </div>

      <div className="trainer-summary-grid">
        <div className="trainer-summary-card">
          <Users />
          <span>کل اعضا</span>
          <strong>{members.length}</strong>
        </div>

        <div className="trainer-summary-card">
          <Activity />
          <span>دارای برنامه تمرینی</span>
          <strong>
            {members.filter((item) => item.trainingPlan).length}
          </strong>
        </div>

        <div className="trainer-summary-card">
          <CalendarDays />
          <span>دارای رزرو ثبت‌شده</span>
          <strong>
            {members.filter((item) =>
              item.bookings.some((booking) => booking.status === "confirmed")
            ).length}
          </strong>
        </div>
      </div>

      <div className="trainer-toolbar">
        <div>
          <h2>فهرست اعضا</h2>
          <p>برای مشاهده جزئیات، عضو موردنظر را انتخاب کنید.</p>
        </div>

        <div className="trainer-search">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="جست‌وجو با نام، ایمیل یا شماره..."
          />
        </div>
      </div>

      {filteredMembers.length === 0 ? (
        <div className="trainer-empty">
          <Users size={34} />
          <h3>عضوی پیدا نشد</h3>
          <p>عبارت جست‌وجو را تغییر دهید یا اعضای اختصاص‌یافته را بررسی کنید.</p>
        </div>
      ) : (
        <div className="trainer-member-grid">
          {filteredMembers.map((member) => (
            <article className="trainer-member-card" key={member.id}>
              <div className="trainer-member-top">
                <div className="trainer-member-avatar">
                  <UserRound />
                </div>

                <span className="trainer-member-role">عضو فیت‌لند</span>
              </div>

              <h3>{member.name}</h3>
              <p>{member.email}</p>
              <p>{member.phone || "شماره ثبت نشده"}</p>

              <div className="trainer-member-stats">
                <div>
                  <strong>{member.completedExercises.length}</strong>
                  <span>حرکت تکمیل‌شده</span>
                </div>

                <div>
                  <strong>
                    {member.bookings.filter(
                      (item) => item.status === "confirmed"
                    ).length}
                  </strong>
                  <span>رزرو فعال</span>
                </div>
              </div>

              <Link
                className="trainer-member-link"
                to={`/trainer/members/${member.id}`}
              >
                مشاهده پرونده عضو
                <ChevronLeft size={17} />
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
