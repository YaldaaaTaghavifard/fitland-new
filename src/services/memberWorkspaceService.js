
const STORAGE_KEY = "fitland_member_workspace";

const initialData = {
  "member-1": {
    trainingPlan: {
      title: "برنامه قدرتی و تناسب اندام",
      trainer: "سارا محمدی",
      startDate: "2026-10-01",
      endDate: "2026-11-30",
      days: [
        {
          id: "day-1",
          name: "شنبه",
          focus: "پایین‌تنه",
          exercises: [
            { id: 1, name: "اسکوات", sets: 4, reps: "12", rest: 60 },
            { id: 2, name: "لانج", sets: 3, reps: "12", rest: 45 },
            { id: 3, name: "پرس پا", sets: 3, reps: "15", rest: 60 },
          ],
        },
        {
          id: "day-2",
          name: "دوشنبه",
          focus: "بالاتنه",
          exercises: [
            { id: 4, name: "پرس سینه", sets: 3, reps: "12", rest: 60 },
            { id: 5, name: "لت سیم‌کش", sets: 3, reps: "12", rest: 45 },
            { id: 6, name: "جلو بازو دمبل", sets: 3, reps: "15", rest: 45 },
          ],
        },
        {
          id: "day-3",
          name: "چهارشنبه",
          focus: "هوازی و میان‌تنه",
          exercises: [
            { id: 7, name: "تردمیل", sets: 1, reps: "20 دقیقه", rest: 0 },
            { id: 8, name: "پلانک", sets: 3, reps: "30 ثانیه", rest: 30 },
            { id: 9, name: "کرانچ", sets: 3, reps: "15", rest: 30 },
          ],
        },
      ],
    },

    completedExercises: [],

    nutritionPlan: {
      title: "برنامه تغذیه متعادل",
      trainer: "سارا محمدی",
      meals: [
        {
          id: "meal-1",
          time: "۰۸:۰۰",
          name: "صبحانه",
          foods: ["نان سبوس‌دار", "تخم‌مرغ", "پنیر", "گردو"],
          note: "صبحانه را حذف نکنید و آب کافی بنوشید.",
        },
        {
          id: "meal-2",
          time: "۱۰:۳۰",
          name: "میان‌وعده اول",
          foods: ["یک عدد میوه", "چند عدد بادام"],
          note: "میان‌وعده سبک.",
        },
        {
          id: "meal-3",
          time: "۱۳:۳۰",
          name: "ناهار",
          foods: ["مرغ یا حبوبات", "برنج", "سالاد"],
          note: "مقدار مصرف طبق برنامه مربی تنظیم شود.",
        },
        {
          id: "meal-4",
          time: "۱۷:۰۰",
          name: "میان‌وعده دوم",
          foods: ["ماست", "میوه"],
          note: "در صورت نیاز به انرژی قبل از تمرین.",
        },
        {
          id: "meal-5",
          time: "۲۰:۰۰",
          name: "شام",
          foods: ["پروتئین", "سبزیجات", "نان سبوس‌دار"],
          note: "شام متعادل و سبک.",
        },
      ],
      description: "این برنامه نمونه و نمایشی است و باید توسط مربی متناسب با شرایط هر فرد تنظیم شود.",
    },

    classes: [
      {
        id: "class-1",
        title: "تمرین قدرتی",
        trainer: "سارا محمدی",
        date: "2026-11-02",
        time: "۱۰:۰۰",
        capacity: 12,
        reserved: 7,
        status: "active",
      },
      {
        id: "class-2",
        title: "فیتنس و هوازی",
        trainer: "مریم احمدی",
        date: "2026-11-04",
        time: "۱۷:۰۰",
        capacity: 10,
        reserved: 6,
        status: "active",
      },
      {
        id: "class-3",
        title: "یوگا",
        trainer: "نگار رضایی",
        date: "2026-11-06",
        time: "۰۹:۰۰",
        capacity: 8,
        reserved: 8,
        status: "active",
      },
      {
        id: "class-4",
        title: "تمرین انعطاف‌پذیری",
        trainer: "مریم احمدی",
        date: "2026-11-08",
        time: "۱۶:۰۰",
        capacity: 10,
        reserved: 4,
        status: "active",
      },
    ],

    bookings: [
      {
        id: "booking-1",
        classId: "class-1",
        title: "تمرین قدرتی",
        date: "2026-11-02",
        time: "۱۰:۰۰",
        status: "confirmed",
        createdAt: "2026-10-28",
      },
    ],

    invoices: [
      {
        id: "invoice-1",
        title: "اشتراک یک‌ماهه فیت‌لند",
        amount: 1200000,
        date: "2026-10-01",
        dueDate: "2026-10-01",
        status: "paid",
        method: "پرداخت آزمایشی",
      },
      {
        id: "invoice-2",
        title: "قسط دوم اشتراک",
        amount: 600000,
        date: "2026-10-31",
        dueDate: "2026-11-05",
        status: "pending",
        method: "پرداخت آزمایشی",
      },
    ],
  },
};

function readAll() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function writeAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function ensureData() {
  let data = readAll();

  if (!data) {
    data = initialData;
    writeAll(data);
  }

  return data;
}

function getMemberData(memberId) {
  const data = ensureData();

  if (!data[memberId]) {
    data[memberId] = {
      ...initialData["member-1"],
      bookings: [],
      completedExercises: [],
    };
    writeAll(data);
  }

  return data[memberId];
}

function updateMemberData(memberId, updater) {
  const data = ensureData();
  const current = getMemberData(memberId);
  const updated = updater(current);

  data[memberId] = updated;
  writeAll(data);

  return updated;
}

export const memberWorkspaceService = {
  getTrainingPlan(memberId) {
    return getMemberData(memberId).trainingPlan;
  },

  getCompletedExercises(memberId) {
    return getMemberData(memberId).completedExercises || [];
  },

  toggleExercise(memberId, exerciseId) {
    return updateMemberData(memberId, (current) => {
      const completed = current.completedExercises || [];
      const exists = completed.includes(exerciseId);

      return {
        ...current,
        completedExercises: exists
          ? completed.filter((id) => id !== exerciseId)
          : [...completed, exerciseId],
      };
    });
  },

  getNutritionPlan(memberId) {
    return getMemberData(memberId).nutritionPlan;
  },

  getClasses(memberId) {
    return getMemberData(memberId).classes;
  },

  getBookings(memberId) {
    return getMemberData(memberId).bookings;
  },

  bookClass(memberId, classId) {
    return updateMemberData(memberId, (current) => {
      const selectedClass = current.classes.find((item) => item.id === classId);

      if (!selectedClass) {
        return { ...current, bookingError: "کلاس موردنظر پیدا نشد." };
      }

      if (selectedClass.status !== "active") {
        return { ...current, bookingError: "ثبت‌نام این کلاس فعال نیست." };
      }

      if (current.bookings.some(
        (item) => item.classId === classId && item.status === "confirmed"
      )) {
        return { ...current, bookingError: "شما قبلاً این کلاس را رزرو کرده‌اید." };
      }

      if (selectedClass.reserved >= selectedClass.capacity) {
        return { ...current, bookingError: "ظرفیت این کلاس تکمیل شده است." };
      }

      return {
        ...current,
        bookingError: null,
        classes: current.classes.map((item) =>
          item.id === classId
            ? { ...item, reserved: item.reserved + 1 }
            : item
        ),
        bookings: [
          ...current.bookings,
          {
            id: `booking-${Date.now()}`,
            classId,
            title: selectedClass.title,
            date: selectedClass.date,
            time: selectedClass.time,
            status: "confirmed",
            createdAt: new Date().toISOString().slice(0, 10),
          },
        ],
      };
    });
  },

  cancelBooking(memberId, bookingId) {
    return updateMemberData(memberId, (current) => {
      const booking = current.bookings.find((item) => item.id === bookingId);

      if (!booking || booking.status !== "confirmed") {
        return current;
      }

      return {
        ...current,
        bookings: current.bookings.map((item) =>
          item.id === bookingId ? { ...item, status: "cancelled" } : item
        ),
        classes: current.classes.map((item) =>
          item.id === booking.classId
            ? { ...item, reserved: Math.max(0, item.reserved - 1) }
            : item
        ),
      };
    });
  },

  getInvoices(memberId) {
    return getMemberData(memberId).invoices;
  },

  payInvoice(memberId, invoiceId) {
    return updateMemberData(memberId, (current) => ({
      ...current,
      invoices: current.invoices.map((invoice) =>
        invoice.id === invoiceId && invoice.status === "pending"
          ? {
              ...invoice,
              status: "paid",
              paidAt: new Date().toISOString().slice(0, 10),
              method: "پرداخت آزمایشی",
            }
          : invoice
      ),
    }));
  },
};
