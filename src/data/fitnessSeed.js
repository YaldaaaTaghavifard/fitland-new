export const initialFitnessData = {
  "member-1": {
    trainingPlan: {
      id: "training-1",
      title: "برنامه عضله‌سازی و افزایش قدرت",
      trainerName: "سارا محمدی",
      startDate: "2026-10-01",
      endDate: "2026-11-30",
      description:
        "برنامه نمونه برای افزایش قدرت و تقویت عضلات. شدت تمرین باید متناسب با شرایط و توانایی فرد تنظیم شود.",

      days: [
        {
          id: "day-1",
          title: "روز اول",
          focus: "سینه و پشت بازو",
          exercises: [
            {
              id: "ex-1",
              name: "پرس سینه",
              sets: 4,
              reps: "10 تا 12",
              rest: 90,
              description: "اجرای کنترل‌شده حرکت و حفظ فرم صحیح بدن.",
            },
            {
              id: "ex-2",
              name: "پرس بالا سینه دمبل",
              sets: 3,
              reps: "10",
              rest: 75,
              description: "از وزنه متناسب با توانایی خود استفاده کن.",
            },
            {
              id: "ex-3",
              name: "پشت بازو سیم‌کش",
              sets: 3,
              reps: "12",
              rest: 60,
              description: "آرنج‌ها را نزدیک بدن نگه دار.",
            },
          ],
        },
        {
          id: "day-2",
          title: "روز دوم",
          focus: "زیربغل و جلو بازو",
          exercises: [
            {
              id: "ex-4",
              name: "لت سیم‌کش",
              sets: 4,
              reps: "12",
              rest: 90,
              description: "حرکت را بدون تاب دادن بدن انجام بده.",
            },
            {
              id: "ex-5",
              name: "قایقی",
              sets: 3,
              reps: "12",
              rest: 75,
              description: "کشش و انقباض عضلات را کنترل کن.",
            },
            {
              id: "ex-6",
              name: "جلو بازو دمبل",
              sets: 3,
              reps: "10",
              rest: 60,
              description: "از حرکت اضافی شانه جلوگیری کن.",
            },
          ],
        },
        {
          id: "day-3",
          title: "روز سوم",
          focus: "پا و شکم",
          exercises: [
            {
              id: "ex-7",
              name: "اسکوات",
              sets: 4,
              reps: "10",
              rest: 120,
              description: "فرم صحیح حرکت را در اولویت قرار بده.",
            },
            {
              id: "ex-8",
              name: "پرس پا",
              sets: 3,
              reps: "12",
              rest: 90,
              description: "دامنه حرکت را متناسب با توانایی خود انتخاب کن.",
            },
            {
              id: "ex-9",
              name: "کرانچ",
              sets: 3,
              reps: "15",
              rest: 45,
              description: "حرکت را آرام و کنترل‌شده انجام بده.",
            },
          ],
        },
      ],
    },

    nutritionPlan: {
      id: "nutrition-1",
      title: "برنامه غذایی روزانه",
      trainerName: "سارا محمدی",
      description:
        "نمونه آموزشی برنامه غذایی؛ مقدار و ترکیب غذا باید با شرایط فرد و نظر متخصص تغذیه تنظیم شود.",

      meals: [
        {
          id: "meal-1",
          name: "صبحانه",
          time: "07:30",
          foods: [
            "نان سبوس‌دار",
            "تخم‌مرغ",
            "شیر",
            "یک عدد میوه",
          ],
          note: "صبحانه متعادل و متناسب با برنامه روزانه.",
        },
        {
          id: "meal-2",
          name: "میان‌وعده اول",
          time: "10:30",
          foods: [
            "یک عدد میوه",
            "مقداری مغزها",
          ],
          note: "میان‌وعده سبک.",
        },
        {
          id: "meal-3",
          name: "ناهار",
          time: "13:30",
          foods: [
            "برنج",
            "مرغ یا حبوبات",
            "سبزیجات",
          ],
          note: "ترکیبی از منابع پروتئین و کربوهیدرات.",
        },
        {
          id: "meal-4",
          name: "میان‌وعده دوم",
          time: "16:30",
          foods: [
            "ماست",
            "میوه",
          ],
          note: "میان‌وعده متناسب با زمان تمرین.",
        },
        {
          id: "meal-5",
          name: "شام",
          time: "20:00",
          foods: [
            "پروتئین انتخابی",
            "سالاد",
            "نان یا سیب‌زمینی",
          ],
          note: "وعده متعادل و متناسب با نیاز فرد.",
        },
      ],
    },

    measurements: [
      {
        id: "measurement-1",
        date: "2026-10-01",
        weight: 78,
        height: 178,
        waist: 88,
        arm: 32,
        chest: 98,
        thigh: 55,
        notes: "اولین اندازه‌گیری نمونه",
      },
      {
        id: "measurement-2",
        date: "2026-10-15",
        weight: 77.5,
        height: 178,
        waist: 87,
        arm: 32.5,
        chest: 98.5,
        thigh: 55.5,
        notes: "اندازه‌گیری نمونه دوم",
      },
      {
        id: "measurement-3",
        date: "2026-10-30",
        weight: 77,
        height: 178,
        waist: 86,
        arm: 33,
        chest: 99,
        thigh: 56,
        notes: "اندازه‌گیری نمونه سوم",
      },
    ],
  },
};