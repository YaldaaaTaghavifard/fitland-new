import { useState } from "react";
import {
  Dumbbell,
  Clock3,
  CalendarDays,
  UserRound,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { fitnessService } from "../../services/fitnessService";

export default function MemberTraining() {
  const auth = useAuth();
  const memberId =
    auth.user?.id || auth.currentUser?.id || "member-1";

  const plan = fitnessService.getTrainingPlan(memberId);
  const [activeDay, setActiveDay] = useState(0);
  const [expandedExercise, setExpandedExercise] = useState(null);

  if (!plan) {
    return (
      <div className="fitness-empty">
        <Dumbbell size={42} />
        <h2>هنوز برنامه تمرینی ندارید</h2>
        <p>پس از ثبت برنامه توسط مربی، اینجا می‌توانید آن را مشاهده کنید.</p>
      </div>
    );
  }

  const selectedDay = plan.days[activeDay];

  return (
    <div className="fitness-page">
      <div className="fitness-page-heading">
        <div>
          <span className="member-eyebrow">برنامه ورزشی</span>
          <h1>برنامه تمرینی من</h1>
          <p>برنامه تمرینی اختصاص‌یافته به حساب شما</p>
        </div>

        <div className="fitness-heading-icon">
          <Dumbbell size={30} />
        </div>
      </div>

      <section className="fitness-plan-banner">
        <div>
          <span className="fitness-plan-label">برنامه فعال</span>
          <h2>{plan.title}</h2>
          <p>{plan.description}</p>

          <div className="fitness-plan-meta">
            <span>
              <UserRound size={16} />
              مربی: {plan.trainerName}
            </span>

            <span>
              <CalendarDays size={16} />
              شروع: {plan.startDate}
            </span>
          </div>
        </div>
      </section>

      <section className="fitness-content-card">
        <div className="fitness-section-title">
          <div>
            <h2>روزهای تمرینی</h2>
            <p>برای مشاهده حرکات هر روز، آن را انتخاب کن.</p>
          </div>
        </div>

        <div className="training-day-tabs">
          {plan.days.map((day, index) => (
            <button
              key={day.id}
              type="button"
              className={activeDay === index ? "active" : ""}
              onClick={() => {
                setActiveDay(index);
                setExpandedExercise(null);
              }}
            >
              <span>{day.title}</span>
              <small>{day.focus}</small>
            </button>
          ))}
        </div>

        {selectedDay && (
          <div className="training-day-content">
            <div className="training-day-heading">
              <div>
                <span>تمرکز این جلسه</span>
                <h3>{selectedDay.focus}</h3>
              </div>

              <span className="exercise-count">
                {selectedDay.exercises.length} حرکت
              </span>
            </div>

            <div className="exercise-list">
              {selectedDay.exercises.map((exercise, index) => {
                const expanded = expandedExercise === exercise.id;

                return (
                  <article className="exercise-item" key={exercise.id}>
                    <div className="exercise-main">
                      <div className="exercise-number">
                        {index + 1}
                      </div>

                      <div className="exercise-information">
                        <h4>{exercise.name}</h4>

                        <div className="exercise-meta">
                          <span>{exercise.sets} ست</span>
                          <span>{exercise.reps} تکرار</span>
                          <span>
                            <Clock3 size={13} />
                            {exercise.rest} ثانیه استراحت
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="exercise-expand-button"
                        onClick={() =>
                          setExpandedExercise(expanded ? null : exercise.id)
                        }
                        aria-label="نمایش توضیحات حرکت"
                      >
                        {expanded ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </button>
                    </div>

                    {expanded && (
                      <div className="exercise-description">
                        <Info size={16} />
                        <p>{exercise.description}</p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <div className="fitness-note">
        <Info size={18} />
        <p>
          این برنامه نمونه آموزشی است. در صورت وجود درد، آسیب یا محدودیت جسمی،
          اجرای حرکات باید با نظر مربی واجد صلاحیت و متخصص مربوطه تنظیم شود.
        </p>
      </div>
    </div>
  );
}