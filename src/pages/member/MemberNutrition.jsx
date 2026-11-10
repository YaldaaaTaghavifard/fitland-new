import {
  Apple,
  Clock3,
  Utensils,
  UserRound,
  Info,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { fitnessService } from "../../services/fitnessService";

export default function MemberNutrition() {
  const auth = useAuth();
  const memberId =
    auth.user?.id || auth.currentUser?.id || "member-1";

  const plan = fitnessService.getNutritionPlan(memberId);

  if (!plan) {
    return (
      <div className="fitness-empty">
        <Apple size={42} />
        <h2>هنوز برنامه غذایی ندارید</h2>
        <p>پس از ثبت برنامه توسط مربی، اینجا می‌توانید آن را مشاهده کنید.</p>
      </div>
    );
  }

  return (
    <div className="fitness-page">
      <div className="fitness-page-heading">
        <div>
          <span className="member-eyebrow">تغذیه و سبک زندگی</span>
          <h1>برنامه غذایی من</h1>
          <p>وعده‌های غذایی ثبت‌شده برای شما</p>
        </div>

        <div className="fitness-heading-icon">
          <Apple size={30} />
        </div>
      </div>

      <section className="fitness-plan-banner nutrition-banner">
        <div>
          <span className="fitness-plan-label">برنامه ثبت‌شده</span>
          <h2>{plan.title}</h2>
          <p>{plan.description}</p>

          <div className="fitness-plan-meta">
            <span>
              <UserRound size={16} />
              تنظیم‌کننده: {plan.trainerName}
            </span>

            <span>
              <Utensils size={16} />
              {plan.meals.length} وعده غذایی
            </span>
          </div>
        </div>
      </section>

      <section className="fitness-content-card">
        <div className="fitness-section-title">
          <div>
            <h2>وعده‌های روزانه</h2>
            <p>ترتیب وعده‌ها و توضیحات هرکدام</p>
          </div>
        </div>

        <div className="nutrition-meal-list">
          {plan.meals.map((meal, index) => (
            <article className="nutrition-meal" key={meal.id}>
              <div className="nutrition-meal-index">
                {index + 1}
              </div>

              <div className="nutrition-meal-content">
                <div className="nutrition-meal-header">
                  <div>
                    <h3>{meal.name}</h3>
                    <span>
                      <Clock3 size={14} />
                      {meal.time}
                    </span>
                  </div>
                </div>

                <div className="nutrition-food-list">
                  {meal.foods.map((food, foodIndex) => (
                    <span key={`${meal.id}-${foodIndex}`}>
                      <Apple size={14} />
                      {food}
                    </span>
                  ))}
                </div>

                <p className="nutrition-meal-note">{meal.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="fitness-note">
        <Info size={18} />
        <p>
          این برنامه صرفاً نمونه آموزشی است و جایگزین برنامه تخصصی تغذیه یا
          توصیه پزشکی نیست. نیازهای غذایی افراد باید به‌صورت اختصاصی ارزیابی شود.
        </p>
      </div>
    </div>
  );
}