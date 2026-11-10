
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  Plus,
  Trash2,
  Save,
  Dumbbell,
  Utensils,
} from "lucide-react";
import { trainerService } from "../../services/trainerService";

function newExercise() {
  return {
    id: Date.now(),
    name: "",
    sets: 3,
    reps: "12",
    rest: 60,
  };
}

export default function TrainerPlanEditor({ type = "training" }) {
  const { memberId } = useParams();
  const { user } = useAuth();
  const trainerId = user?.id || "trainer-1";

  const [member, setMember] = useState(null);
  const [message, setMessage] = useState("");

  const [trainingTitle, setTrainingTitle] = useState("");
  const [days, setDays] = useState([]);

  const [nutritionTitle, setNutritionTitle] = useState("");
  const [meals, setMeals] = useState([]);

  const isTraining = type === "training";

  useEffect(() => {
    const found = trainerService
      .getAssignedMembers(trainerId)
      .find((item) => item.id === memberId);
    setMember(found || null);

    if (isTraining) {
      const plan = found?.trainingPlan;

      setTrainingTitle(plan?.title || "برنامه تمرینی جدید");
      setDays(
        plan?.days?.length
          ? plan.days
          : [
              {
                id: `day-${Date.now()}`,
                name: "شنبه",
                focus: "تمرین عمومی",
                exercises: [newExercise()],
              },
            ]
      );
    } else {
      const plan = found?.nutritionPlan;

      setNutritionTitle(plan?.title || "برنامه تغذیه جدید");
      setMeals(
        plan?.meals?.length
          ? plan.meals
          : [
              {
                id: `meal-${Date.now()}`,
                name: "صبحانه",
                time: "08:00",
                foods: [],
                note: "",
              },
            ]
      );
    }
  }, [memberId, isTraining, trainerId]);

  function updateDay(dayId, field, value) {
    setDays((current) =>
      current.map((day) =>
        day.id === dayId ? { ...day, [field]: value } : day
      )
    );
  }

  function updateExercise(dayId, exerciseId, field, value) {
    setDays((current) =>
      current.map((day) =>
        day.id === dayId
          ? {
              ...day,
              exercises: day.exercises.map((exercise) =>
                exercise.id === exerciseId
                  ? { ...exercise, [field]: value }
                  : exercise
              ),
            }
          : day
      )
    );
  }

  function addDay() {
    setDays((current) => [
      ...current,
      {
        id: `day-${Date.now()}`,
        name: "روز جدید",
        focus: "تمرین جدید",
        exercises: [newExercise()],
      },
    ]);
  }

  function removeDay(dayId) {
    setDays((current) => current.filter((day) => day.id !== dayId));
  }

  function addMeal() {
    setMeals((current) => [
      ...current,
      {
        id: `meal-${Date.now()}`,
        name: "وعده جدید",
        time: "12:00",
        foods: [],
        note: "",
      },
    ]);
  }

  function updateMeal(mealId, field, value) {
    setMeals((current) =>
      current.map((meal) =>
        meal.id === mealId ? { ...meal, [field]: value } : meal
      )
    );
  }

  function savePlan(event) {
    event.preventDefault();

    if (!member) return;

    if (isTraining) {
      if (!trainingTitle.trim() || days.length === 0) {
        setMessage("عنوان برنامه و حداقل یک روز تمرین لازم است.");
        return;
      }

      const invalidExercise = days.some((day) =>
        day.exercises.some((exercise) => !exercise.name.trim())
      );

      if (invalidExercise) {
        setMessage("نام تمام حرکات تمرینی را وارد کنید.");
        return;
      }

      trainerService.updateTrainingPlan(memberId, {
        title: trainingTitle,
        trainer: "مربی فیت‌لند",
        startDate: new Date().toISOString().slice(0, 10),
        endDate: "",
        days,
      });
    } else {
      if (!nutritionTitle.trim() || meals.length === 0) {
        setMessage("عنوان برنامه و حداقل یک وعده لازم است.");
        return;
      }

      trainerService.updateNutritionPlan(memberId, {
        title: nutritionTitle,
        trainer: "مربی فیت‌لند",
        meals: meals.map((meal) => ({
          ...meal,
          foods: Array.isArray(meal.foods)
            ? meal.foods
            : String(meal.foods || "")
                .split(",")
                .map((food) => food.trim())
                .filter(Boolean),
        })),
        description: "این برنامه توسط مربی فیت‌لند ثبت شده است.",
      });
    }

    setMessage("برنامه با موفقیت ذخیره شد.");
  }

  if (!member) {
    return (
      <div className="trainer-empty">
        <h2>عضو پیدا نشد</h2>
        <Link to="/trainer/members">بازگشت</Link>
      </div>
    );
  }

  return (
    <section className="trainer-page">
      <Link
        className="trainer-back-link"
        to={`/trainer/members/${memberId}`}
      >
        <ArrowRight size={17} />
        بازگشت به پرونده عضو
      </Link>

      <div className="trainer-page-heading">
        <div>
          <span>{isTraining ? "TRAINING EDITOR" : "NUTRITION EDITOR"}</span>
          <h1>{isTraining ? "ویرایش برنامه تمرینی" : "ویرایش برنامه تغذیه"}</h1>
          <p>عضو: {member.name}</p>
        </div>

        <div className="trainer-heading-icon">
          {isTraining ? <Dumbbell /> : <Utensils />}
        </div>
      </div>

      <form className="trainer-editor" onSubmit={savePlan}>
        <label>
          عنوان برنامه
          <input
            value={isTraining ? trainingTitle : nutritionTitle}
            onChange={(event) =>
              isTraining
                ? setTrainingTitle(event.target.value)
                : setNutritionTitle(event.target.value)
            }
            required
          />
        </label>

        {isTraining ? (
          <>
            {days.map((day) => (
              <article className="trainer-editor-card" key={day.id}>
                <div className="trainer-editor-card-heading">
                  <h3>روز تمرین</h3>
                  <button
                    type="button"
                    className="trainer-icon-danger"
                    onClick={() => removeDay(day.id)}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                <div className="trainer-editor-fields">
                  <label>
                    نام روز
                    <input
                      value={day.name}
                      onChange={(event) =>
                        updateDay(day.id, "name", event.target.value)
                      }
                    />
                  </label>

                  <label>
                    گروه تمرینی
                    <input
                      value={day.focus}
                      onChange={(event) =>
                        updateDay(day.id, "focus", event.target.value)
                      }
                    />
                  </label>
                </div>

                {day.exercises.map((exercise) => (
                  <div className="trainer-exercise-editor" key={exercise.id}>
                    <label>
                      نام حرکت
                      <input
                        value={exercise.name}
                        onChange={(event) =>
                          updateExercise(
                            day.id,
                            exercise.id,
                            "name",
                            event.target.value
                          )
                        }
                        required
                      />
                    </label>

                    <label>
                      ست
                      <input
                        type="number"
                        min="1"
                        value={exercise.sets}
                        onChange={(event) =>
                          updateExercise(
                            day.id,
                            exercise.id,
                            "sets",
                            Number(event.target.value)
                          )
                        }
                      />
                    </label>

                    <label>
                      تکرار
                      <input
                        value={exercise.reps}
                        onChange={(event) =>
                          updateExercise(
                            day.id,
                            exercise.id,
                            "reps",
                            event.target.value
                          )
                        }
                      />
                    </label>

                    <label>
                      استراحت (ثانیه)
                      <input
                        type="number"
                        min="0"
                        value={exercise.rest}
                        onChange={(event) =>
                          updateExercise(
                            day.id,
                            exercise.id,
                            "rest",
                            Number(event.target.value)
                          )
                        }
                      />
                    </label>
                  </div>
                ))}

                <button
                  type="button"
                  className="trainer-secondary-button"
                  onClick={() =>
                    updateDay(day.id, "exercises", [
                      ...day.exercises,
                      newExercise(),
                    ])
                  }
                >
                  <Plus size={16} />
                  افزودن حرکت
                </button>
              </article>
            ))}

            <button
              type="button"
              className="trainer-secondary-button"
              onClick={addDay}
            >
              <Plus size={16} />
              افزودن روز تمرینی
            </button>
          </>
        ) : (
          <>
            {meals.map((meal) => (
              <article className="trainer-editor-card" key={meal.id}>
                <div className="trainer-editor-card-heading">
                  <h3>وعده غذایی</h3>
                  <button
                    type="button"
                    className="trainer-icon-danger"
                    onClick={() =>
                      setMeals((current) =>
                        current.filter((item) => item.id !== meal.id)
                      )
                    }
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                <div className="trainer-editor-fields">
                  <label>
                    نام وعده
                    <input
                      value={meal.name}
                      onChange={(event) =>
                        updateMeal(meal.id, "name", event.target.value)
                      }
                    />
                  </label>

                  <label>
                    ساعت
                    <input
                      type="time"
                      value={meal.time}
                      onChange={(event) =>
                        updateMeal(meal.id, "time", event.target.value)
                      }
                    />
                  </label>
                </div>

                <label>
                  مواد غذایی (با کاما جدا کنید)
                  <input
                    value={
                      Array.isArray(meal.foods)
                        ? meal.foods.join(", ")
                        : meal.foods
                    }
                    onChange={(event) =>
                      updateMeal(meal.id, "foods", event.target.value)
                    }
                  />
                </label>

                <label>
                  توضیحات مربی
                  <textarea
                    rows="2"
                    value={meal.note || ""}
                    onChange={(event) =>
                      updateMeal(meal.id, "note", event.target.value)
                    }
                  />
                </label>
              </article>
            ))}

            <button
              type="button"
              className="trainer-secondary-button"
              onClick={addMeal}
            >
              <Plus size={16} />
              افزودن وعده
            </button>
          </>
        )}

        {message && <div className="trainer-editor-message">{message}</div>}

        <button className="trainer-primary-button" type="submit">
          <Save size={17} />
          ذخیره برنامه
        </button>
      </form>
    </section>
  );
}
