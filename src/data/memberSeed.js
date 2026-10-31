export const initialMemberData = {
  "member-1": {
    profile: {
      id: "member-1",
      fullName: "علی رضایی",
      email: "member@fitland.ir",
      phone: "09120000001",
      birthDate: "1382-05-12",
      city: "یزد",
      goal: "افزایش قدرت و عضله‌سازی",
      joinedAt: "2026-10-01",
    },

    membership: {
      planName: "برنامه حرفه‌ای",
      startDate: "2026-10-01",
      endDate: "2026-11-30",
      status: "active",
      totalDays: 60,
      price: 1800000,
    },

    payments: [
      {
        id: "payment-1",
        title: "قسط اول اشتراک حرفه‌ای",
        amount: 900000,
        date: "2026-10-01",
        status: "paid",
        method: "پرداخت آزمایشی",
      },
      {
        id: "payment-2",
        title: "قسط دوم اشتراک حرفه‌ای",
        amount: 900000,
        date: "2026-11-01",
        status: "pending",
        method: "پرداخت آزمایشی",
      },
    ],

    bookings: [
      {
        id: "booking-1",
        title: "تمرین بدنسازی",
        trainerName: "سارا محمدی",
        date: "2026-11-02",
        time: "17:00",
        status: "confirmed",
      },
      {
        id: "booking-2",
        title: "تمرین هوازی",
        trainerName: "سارا محمدی",
        date: "2026-11-04",
        time: "18:00",
        status: "pending",
      },
    ],

    activities: [
      {
        id: "activity-1",
        title: "ثبت برنامه تمرینی",
        description: "برنامه تمرینی جدید برای شما ثبت شد.",
        date: "2026-10-28",
        type: "training",
      },
      {
        id: "activity-2",
        title: "ثبت پرداخت",
        description: "پرداخت آزمایشی قسط اول ثبت شد.",
        date: "2026-10-20",
        type: "payment",
      },
      {
        id: "activity-3",
        title: "رزرو جلسه",
        description: "جلسه تمرین شما رزرو شد.",
        date: "2026-10-18",
        type: "booking",
      },
    ],
  },
};