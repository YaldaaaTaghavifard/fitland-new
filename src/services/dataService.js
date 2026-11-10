/**
 * FitLand Unified Core Data Service
 * Manages all platform entities in LocalStorage with seed data,
 * relational synchronization, and collision validation.
 */

const STORAGE_PREFIX = "fitland_";

const KEYS = {
  USERS: `${STORAGE_PREFIX}users`,
  CURRENT_USER: `${STORAGE_PREFIX}current_user`,
  MEMBERSHIPS: `${STORAGE_PREFIX}memberships`,
  TRAINERS: `${STORAGE_PREFIX}trainers`,
  CLASSES: `${STORAGE_PREFIX}classes`,
  BOOKINGS: `${STORAGE_PREFIX}bookings`,
  WORKOUT_PLANS: `${STORAGE_PREFIX}workout_plans`,
  NUTRITION_PLANS: `${STORAGE_PREFIX}nutrition_plans`,
  MEASUREMENTS: `${STORAGE_PREFIX}measurements`,
  PRODUCTS: `${STORAGE_PREFIX}products`,
  ORDERS: `${STORAGE_PREFIX}orders`,
  INVOICES: `${STORAGE_PREFIX}invoices`,
  INSTALLMENTS: `${STORAGE_PREFIX}installments`,
  RATINGS: `${STORAGE_PREFIX}ratings`,
  FOLLOW_UPS: `${STORAGE_PREFIX}follow_ups`,
  BMC: `${STORAGE_PREFIX}business_model_canvas`,
};

// Initial Seed Data
const defaultUsers = [
  {
    id: "member-1",
    name: "علی رضایی",
    email: "member@fitland.ir",
    phone: "09120000001",
    password: "123456",
    role: "member",
    createdAt: "2026-10-01",
  },
  {
    id: "trainer-1",
    name: "سارا محمدی",
    email: "trainer@fitland.ir",
    phone: "09120000002",
    password: "123456",
    role: "trainer",
    createdAt: "2026-10-01",
  },
  {
    id: "admin-1",
    name: "مدیر کل فیت‌لند",
    email: "admin@fitland.ir",
    phone: "09120000003",
    password: "123456",
    role: "admin",
    createdAt: "2026-10-01",
  },
];

const defaultPlans = [
  {
    id: "plan-monthly",
    name: "اشتراک ماهانه نقره‌ای",
    nameEn: "Monthly Silver Membership",
    price: 1200000,
    durationDays: 30,
    description: "شروع هدفمند ورزش با دسترسی به سالن و مشاور اولیه",
    descriptionEn: "Kickstart your training with gym access & starter guidance",
    popular: false,
    features: ["دسترسی کامل به سالن", "رزرو ۲ کلاس در ماه", "سنجش اولیه فرم بدنی"],
  },
  {
    id: "plan-quarterly",
    name: "اشتراک سه‌ماهه طلایی (پیشنهاد ویژه)",
    nameEn: "Quarterly Gold Membership (Popular)",
    price: 3200000,
    durationDays: 90,
    description: "بهترین انتخاب برای استمرار و تحول ملموس با برنامه اختصاصی",
    descriptionEn: "Best for consistency and tangible transformation with coach plans",
    popular: true,
    features: [
      "تمام امکانات پلن ماهانه",
      "برنامه تمرینی و تغذیه اختصاصی مربی",
      "رزرو نامحدود کلاس‌های گروهی",
      "امکان پرداخت اقساطی در ۲ تا ۳ قسط",
    ],
  },
  {
    id: "plan-annual",
    name: "اشتراک سالانه الماس VIP",
    nameEn: "Annual Diamond VIP Membership",
    price: 10800000,
    durationDays: 365,
    description: "همراهی یک‌ساله مربی اختصاصی، چکاپ دوره‌ای و هدیه تجهیزات",
    descriptionEn: "1-Year personal coach guidance, periodic reviews & welcome kit",
    popular: false,
    features: [
      "تمام امکانات پلن سه‌ماهه",
      "مربی اختصاصی ۱ به ۱ در طول سال",
      "تخفیف ۲۰٪ در خرید از فروشگاه",
      "امکان پرداخت اقساطی تا ۶ ماه",
    ],
  },
];

const defaultTrainers = [
  {
    id: "trainer-1",
    name: "سارا محمدی",
    nameEn: "Sara Mohammadi",
    email: "trainer@fitland.ir",
    specialty: "فیتنس، فرم‌دهی و اصلاحی",
    specialtyEn: "Fitness & Posture Rehabilitation",
    experience: "۶ سال سابقه مربیگری رسمی",
    experienceEn: "6 years certified coaching",
    rating: 4.9,
    reviewsCount: 38,
    isTopTrainer: true,
    avatarBg: "linear-gradient(135deg, #ff6b35, #ff8c5a)",
  },
  {
    id: "trainer-2",
    name: "آرمان رضایی",
    nameEn: "Arman Rezaei",
    email: "arman@fitland.ir",
    specialty: "هایپرتروفی و بدنسازی سنگین",
    specialtyEn: "Hypertrophy & Strength Training",
    experience: "۸ سال سابقه قهرمانی",
    experienceEn: "8 years competitive bodybuilding",
    rating: 4.8,
    reviewsCount: 45,
    isTopTrainer: false,
    avatarBg: "linear-gradient(135deg, #10b981, #059669)",
  },
  {
    id: "trainer-3",
    name: "نگار احمدی",
    nameEn: "Negar Ahmadi",
    email: "negar@fitland.ir",
    specialty: "یوگا و انعطاف‌پذیری",
    specialtyEn: "Yoga & Flexibility",
    experience: "۵ سال سابقه تدریس بین‌المللی",
    experienceEn: "5 years international yoga instructor",
    rating: 4.9,
    reviewsCount: 29,
    isTopTrainer: false,
    avatarBg: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
  },
];

const defaultClasses = [
  {
    id: "class-1",
    title: "کراس‌فیت و آمادگی انفجاری",
    titleEn: "CrossFit & Explosive Conditioning",
    category: "قدرتی و هوازی",
    categoryEn: "Strength & Cardio",
    trainerId: "trainer-2",
    trainerName: "آرمان رضایی",
    date: "2026-11-12",
    time: "10:00",
    durationMinutes: 60,
    capacity: 12,
    reserved: 9,
    price: 150000,
    description: "تمرینات ترکیبی با هالتر، کتل‌بل و وزن بدن برای ارتقای توان عضلانی و قلبی.",
    descriptionEn: "High-intensity functional movements with barbells, kettlebells and bodyweight.",
  },
  {
    id: "class-2",
    title: "فیتنس و چربی‌سوزی HIIT",
    titleEn: "HIIT Fat Burn & Tone",
    category: "هوازی",
    categoryEn: "Cardio",
    trainerId: "trainer-1",
    trainerName: "سارا محمدی",
    date: "2026-11-12",
    time: "17:30",
    durationMinutes: 50,
    capacity: 15,
    reserved: 11,
    price: 120000,
    description: "فواصل پرشدت برای بیشترین کالری‌سوزی و فرم‌دهی عضلات در کمترین زمان.",
    descriptionEn: "High-intensity intervals for maximum calorie burn and lean muscle toning.",
  },
  {
    id: "class-3",
    title: "یوگا، تنفس و کاهش استرس",
    titleEn: "Vinyasa Yoga & Breathwork",
    category: "انعطاف و آرامش",
    categoryEn: "Flexibility & Mind",
    trainerId: "trainer-3",
    trainerName: "نگار احمدی",
    date: "2026-11-13",
    time: "09:00",
    durationMinutes: 60,
    capacity: 10,
    reserved: 8,
    price: 130000,
    description: "حرکات روان، کشش عمیق و تمرینات تنفسی پرانایاما برای انعطاف و تمرکز ذهن.",
    descriptionEn: "Fluid sequences, deep stretches and pranayama breathwork for total vitality.",
  },
  {
    id: "class-4",
    title: "تمرینات فانکشنال و اصلاحی",
    titleEn: "Functional Core & Posture",
    category: "اصلاحی",
    categoryEn: "Rehabilitation",
    trainerId: "trainer-1",
    trainerName: "سارا محمدی",
    date: "2026-11-14",
    time: "18:00",
    durationMinutes: 55,
    capacity: 12,
    reserved: 6,
    price: 140000,
    description: "تقویت عضلات ثبات‌دهنده ستون فقرات و رفع ناهنجاری‌های نشستن طولانی.",
    descriptionEn: "Strengthen core stabilizers, correct posture and relieve lower back tightness.",
  },
];

const defaultBookings = [
  {
    id: "booking-101",
    memberId: "member-1",
    memberName: "علی رضایی",
    classId: "class-2",
    classTitle: "فیتنس و چربی‌سوزی HIIT",
    trainerId: "trainer-1",
    trainerName: "سارا محمدی",
    date: "2026-11-12",
    time: "17:30",
    status: "confirmed",
    createdAt: "2026-11-05",
  },
];

const defaultProducts = [
  {
    id: "prod-1",
    name: "دمبل متغیر ۱۰ کیلوگرمی پرو",
    nameEn: "Pro Adjustable Dumbbell 10kg",
    category: "تجهیزات",
    categoryEn: "Equipment",
    price: 1850000,
    originalPrice: 2200000,
    stock: 14,
    rating: 4.9,
    reviews: 58,
    badge: "پرفروش",
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80",
    description: "طراحی ارگونومیک با مکانیزم تنظیم سریع وزن از ۲.۵ تا ۱۰ کیلوگرم بدون نیاز به فضای زیاد.",
  },
  {
    id: "prod-2",
    name: "مت یوگا و پیلاتس ضدلغزش TPE",
    nameEn: "Anti-Slip TPE Yoga & Pilates Mat",
    category: "لوازم ورزشی",
    categoryEn: "Accessories",
    price: 650000,
    originalPrice: 780000,
    stock: 25,
    rating: 4.8,
    reviews: 42,
    badge: "پیشنهاد مربی",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format&fit=crop&q=80",
    description: "ضخامت ۶ میلی‌متر با بافت دوطرفه ضدلغزش و متریال دوستدار محیط زیست بدون بو.",
  },
  {
    id: "prod-3",
    name: "شیکر ورزشی مات ضدبو ۷۵۰ میلی‌لیتر",
    nameEn: "Matte Odorless Gym Shaker 750ml",
    category: "لوازم جانبی",
    categoryEn: "Bottles",
    price: 320000,
    originalPrice: 380000,
    stock: 40,
    rating: 4.7,
    reviews: 94,
    badge: "محبوب",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80",
    description: "دارای توپ مخلوط‌کننده فنری استیل، درب پیچی ۱۰۰٪ ضد نشت و بدون BPA.",
  },
  {
    id: "prod-4",
    name: "ست کش‌های لوپ مقاومتی ۵ عددی",
    nameEn: "5-Piece Resistance Loop Band Set",
    category: "تجهیزات",
    categoryEn: "Equipment",
    price: 280000,
    originalPrice: 340000,
    stock: 35,
    rating: 4.9,
    reviews: 67,
    badge: "تخفیف ویژه",
    image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&auto=format&fit=crop&q=80",
    description: "پنج سطح مقاومت از خیلی سبک تا فوق سنگین از لاتکس ۱۰۰٪ طبیعی.",
  },
  {
    id: "prod-5",
    name: "طناب سرعتی بلبرینگی کراس‌فیت",
    nameEn: "CrossFit Bearing Speed Jump Rope",
    category: "لوازم جانبی",
    categoryEn: "Accessories",
    price: 190000,
    originalPrice: 240000,
    stock: 30,
    rating: 4.6,
    reviews: 31,
    badge: "جدید",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    description: "سیم فولادی روکش‌دار با بلبرینگ ۳۶۰ درجه برای پرش‌های دوبل فوق‌سریع.",
  },
  {
    id: "prod-6",
    name: "دستکش چرم بدنسازی با مچ‌بند",
    nameEn: "Leather Gym Gloves with Wrist Wrap",
    category: "لوازم ورزشی",
    categoryEn: "Gear",
    price: 490000,
    originalPrice: 560000,
    stock: 22,
    rating: 4.8,
    reviews: 29,
    badge: "پیشنهاد مربی",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80",
    description: "پدهای ژله‌ای در کف دست برای جذب فشار و مچ‌بند دوبل جهت پایداری مچ حین پرس‌های سنگین.",
  },
];

const defaultInvoices = [
  {
    id: "inv-2026-001",
    memberId: "member-1",
    memberName: "علی رضایی",
    title: "اشتراک سه‌ماهه طلایی فیت‌لند",
    titleEn: "Quarterly Gold Membership",
    totalAmount: 3200000,
    type: "installment", // "full" or "installment"
    downPayment: 1200000,
    downPaymentPaid: true,
    installmentsCount: 2,
    installmentAmount: 1000000,
    status: "active", // active, completed, overdue
    paidTotal: 1200000,
    remainingDebt: 2000000,
    createdAt: "2026-10-01",
    installments: [
      {
        id: "inst-1",
        number: 1,
        amount: 1000000,
        dueDate: "2026-11-01",
        status: "paid",
        paidAt: "2026-11-01",
        receiptId: "REC-994821",
      },
      {
        id: "inst-2",
        number: 2,
        amount: 1000000,
        dueDate: "2026-12-01",
        status: "pending",
        paidAt: null,
        receiptId: null,
      },
    ],
  },
];

const defaultBMC = {
  customerSegments: [
    "اعضای باشگاه به‌عنوان کاربران نهایی (B2C)",
    "مدیران و صاحبان باشگاه به‌عنوان مشتریان قراردادی اصلی (B2B)",
    "مربیان شخصی و مربیان کلاس‌های گروهی به‌عنوان کاربران حرفه‌ای",
    "در مرحله توسعه: باشگاه‌های چندشعبه‌ای و مجموعه‌های ورزشی",
  ],
  valuePropositions: [
    "یکپارچه‌سازی عضویت، رزرو، برنامه تمرینی و سوابق پیشرفت در یک محیط",
    "کنترل ظرفیت و قواعد تداخل رزرو برای کاهش خطاهای هماهنگی",
    "پنل‌های جداگانه عضو، مربی و مدیر با اطلاعات متناسب با نقش",
    "پیگیری اعضای فاقد فعالیت ثبت‌شده؛ بدون ادعای تشخیص غیبت فیزیکی",
    "فروشگاه و شبیه‌سازی اقساط در محدوده نسخه آزمایشی",
  ],
  channels: [
    "وب‌سایت و وب‌اپلیکیشن واکنش‌گرا",
    "فروش و معرفی مستقیم به مدیران باشگاه",
    "معرفی از طریق مربیان و باشگاه‌های همکار",
    "محتوای آموزشی، جست‌وجوی ارگانیک و شبکه‌های اجتماعی",
  ],
  customerRelationships: [
    "پنل خودخدمت برای مشاهده عضویت، برنامه و رزرو",
    "پشتیبانی و ثبت درخواست از مسیرهای تعریف‌شده سامانه",
    "پیگیری اعضای فاقد فعالیت ثبت‌شده توسط مربی یا مدیر",
    "دریافت بازخورد و ارزیابی خدمات مربیان",
  ],
  revenueStreams: [
    "مدل اصلی پیشنهادی: اشتراک نرم‌افزاری دوره‌ای باشگاه‌ها (B2B)",
    "کارمزد رزرو خدمات، فقط در صورت توافق قراردادی با باشگاه/مربی",
    "اشتراک ویژه خدمات دیجیتال برای اعضا، پس از اعتبارسنجی تمایل به پرداخت",
    "فروش محصول یا کمیسیون فروشگاه به‌عنوان جریان مکمل",
  ],
  keyResources: [
    "سورس نرم‌افزار، معماری و داده‌های ساختاریافته پلتفرم",
    "شبکه باشگاه‌ها و مربیان همکار؛ در مرحله جذب و اعتبارسنجی",
    "محتوای آموزشی و مدل داده برنامه‌ها و رزروها",
    "برند، اعتماد کاربران، زیرساخت میزبانی و پشتیبانی",
  ],
  keyActivities: [
    "توسعه، نگهداری، آزمون و ایمن‌سازی پلتفرم",
    "جذب، آموزش و پشتیبانی باشگاه‌ها و مربیان",
    "مدیریت قواعد رزرو، عضویت، سفارش و گزارش‌ها",
    "پایش بازخورد کاربران و سنجش شاخص‌های جذب و نگهداشت",
  ],
  keyPartnerships: [
    "باشگاه‌های ورزشی برای اجرای پایلوت و ارائه خدمات حضوری",
    "مربیان و متخصصان ورزشی برای تولید و ارائه خدمات تخصصی",
    "تأمین‌کنندگان تجهیزات ورزشی برای فروشگاه",
    "ارائه‌دهندگان میزبانی، پیام‌رسانی و خدمات فنی؛ در صورت اتصال واقعی",
  ],
  costStructure: [
    "هزینه توسعه، نگهداری و آزمون نرم‌افزار",
    "هزینه میزبانی، دامنه، پشتیبان‌گیری و امنیت",
    "هزینه بازاریابی، فروش و جذب باشگاه (CAC)",
    "هزینه پشتیبانی، آموزش و عملیات اجرایی",
    "هزینه تأمین، بسته‌بندی و ارسال کالا در صورت فعال بودن فروشگاه",
  ],
};

function read(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
  // Dispatch custom storage event for in-tab reactive updates
  window.dispatchEvent(new Event("fitland_data_change"));
}

export const dataService = {
  // Initialization
  init() {
    if (!localStorage.getItem(KEYS.USERS)) write(KEYS.USERS, defaultUsers);
    if (!localStorage.getItem(KEYS.TRAINERS)) write(KEYS.TRAINERS, defaultTrainers);
    if (!localStorage.getItem(KEYS.CLASSES)) write(KEYS.CLASSES, defaultClasses);
    if (!localStorage.getItem(KEYS.BOOKINGS)) write(KEYS.BOOKINGS, defaultBookings);
    if (!localStorage.getItem(KEYS.PRODUCTS)) write(KEYS.PRODUCTS, defaultProducts);
    if (!localStorage.getItem(KEYS.INVOICES)) write(KEYS.INVOICES, defaultInvoices);
    if (!localStorage.getItem(KEYS.BMC)) write(KEYS.BMC, defaultBMC);
  },

  // Users & Auth
  getUsers() {
    return read(KEYS.USERS, defaultUsers);
  },

  addUser(user) {
    const users = this.getUsers();
    const newUser = {
      ...user,
      id: user.id || `user-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    users.push(newUser);
    write(KEYS.USERS, users);
    return newUser;
  },

  findUserByEmail(email) {
    const users = this.getUsers();
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },

  // Plans
  getPlans() {
    return defaultPlans;
  },

  getPlanById(id) {
    return defaultPlans.find((p) => p.id === id);
  },

  // Trainers
  getTrainers() {
    return read(KEYS.TRAINERS, defaultTrainers);
  },

  getTrainerById(id) {
    const trainers = this.getTrainers();
    return trainers.find((t) => t.id === id);
  },

  rateTrainer(trainerId, ratingScore) {
    const trainers = this.getTrainers();
    const updated = trainers.map((t) => {
      if (t.id === trainerId) {
        const totalScore = t.rating * t.reviewsCount + ratingScore;
        const newCount = t.reviewsCount + 1;
        return {
          ...t,
          reviewsCount: newCount,
          rating: Number((totalScore / newCount).toFixed(1)),
        };
      }
      return t;
    });
    write(KEYS.TRAINERS, updated);
    return true;
  },

  setTopTrainer(trainerId) {
    const trainers = this.getTrainers();
    const updated = trainers.map((t) => ({
      ...t,
      isTopTrainer: t.id === trainerId,
    }));
    write(KEYS.TRAINERS, updated);
    return true;
  },

  // Classes & Scheduling with Collision Check
  getClasses() {
    return read(KEYS.CLASSES, defaultClasses);
  },

  getClassById(id) {
    const classes = this.getClasses();
    return classes.find((c) => c.id === id);
  },

  // Bookings with collision avoidance
  getBookings() {
    return read(KEYS.BOOKINGS, defaultBookings);
  },

  getMemberBookings(memberId) {
    const bookings = this.getBookings();
    return bookings.filter((b) => b.memberId === memberId);
  },

  getTrainerBookings(trainerId) {
    const bookings = this.getBookings();
    return bookings.filter((b) => b.trainerId === trainerId);
  },

  bookClass(memberId, memberName, classId) {
    const classes = this.getClasses();
    const cls = classes.find((c) => c.id === classId);
    if (!cls) {
      return { success: false, message: "کلاس یافت نشد." };
    }

    if (cls.reserved >= cls.capacity) {
      return { success: false, message: "ظرفیت این کلاس تکمیل است." };
    }

    const bookings = this.getBookings();

    // Check collision: user cannot book two classes at the same date and time
    const collision = bookings.find(
      (b) =>
        b.memberId === memberId &&
        b.date === cls.date &&
        b.time === cls.time &&
        b.status === "confirmed"
    );

    if (collision) {
      return {
        success: false,
        isCollision: true,
        message: `تداخل زمانی! شما در تاریخ ${cls.date} ساعت ${cls.time} کلاس «${collision.classTitle}» را رزرو کرده‌اید.`,
      };
    }

    // Check duplicate
    const alreadyBooked = bookings.find(
      (b) =>
        b.memberId === memberId &&
        b.classId === classId &&
        b.status === "confirmed"
    );
    if (alreadyBooked) {
      return { success: false, message: "شما قبلاً این کلاس را رزرو کرده‌اید." };
    }

    // Book it
    const newBooking = {
      id: `booking-${Date.now()}`,
      memberId,
      memberName,
      classId,
      classTitle: cls.title,
      trainerId: cls.trainerId,
      trainerName: cls.trainerName,
      date: cls.date,
      time: cls.time,
      status: "confirmed",
      createdAt: new Date().toISOString().slice(0, 10),
    };

    bookings.push(newBooking);
    write(KEYS.BOOKINGS, bookings);

    // Update class reservation count
    cls.reserved += 1;
    write(KEYS.CLASSES, classes);

    return { success: true, booking: newBooking };
  },

  cancelBooking(bookingId) {
    const bookings = this.getBookings();
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, message: "رزرو پیدا نشد." };

    booking.status = "cancelled";
    write(KEYS.BOOKINGS, bookings);

    // Decrement class count
    const classes = this.getClasses();
    const cls = classes.find((c) => c.id === booking.classId);
    if (cls && cls.reserved > 0) {
      cls.reserved -= 1;
      write(KEYS.CLASSES, classes);
    }

    return { success: true };
  },

  // Products & Store
  getProducts() {
    return read(KEYS.PRODUCTS, defaultProducts);
  },

  getProductById(id) {
    const prods = this.getProducts();
    return prods.find((p) => p.id === id || String(p.id) === String(id));
  },

  updateProductStock(productId, delta) {
    const prods = this.getProducts();
    const p = prods.find((item) => item.id === productId || String(item.id) === String(productId));
    if (p) {
      p.stock = Math.max(0, p.stock + delta);
      write(KEYS.PRODUCTS, prods);
    }
  },

  // Invoices, Mock Payments & Installment Engine
  getInvoices() {
    return read(KEYS.INVOICES, defaultInvoices);
  },

  getMemberInvoices(memberId) {
    const invoices = this.getInvoices();
    return invoices.filter((inv) => inv.memberId === memberId);
  },

  /**
   * Create an invoice with optional installment plan
   */
  createInvoice({
    memberId,
    memberName,
    title,
    titleEn,
    totalAmount,
    type = "full", // "full" | "installment"
    installmentsCount = 1,
    downPaymentPercent = 30,
  }) {
    const invoices = this.getInvoices();
    const invoiceId = `INV-${Date.now().toString().slice(-6)}`;
    const today = new Date();

    let downPayment = totalAmount;
    let installments = [];
    let paidTotal = 0;
    let remainingDebt = totalAmount;

    if (type === "installment" && installmentsCount > 1) {
      downPayment = Math.round((totalAmount * downPaymentPercent) / 100);
      const remainingAmount = totalAmount - downPayment;
      const perInstallment = Math.round(remainingAmount / installmentsCount);

      for (let i = 1; i <= installmentsCount; i++) {
        const dueDate = new Date(today);
        dueDate.setMonth(today.getMonth() + i);
        installments.push({
          id: `inst-${invoiceId}-${i}`,
          number: i,
          amount: perInstallment,
          dueDate: dueDate.toISOString().slice(0, 10),
          status: "pending",
          paidAt: null,
          receiptId: null,
        });
      }
    }

    const newInvoice = {
      id: invoiceId,
      memberId,
      memberName,
      title,
      titleEn,
      totalAmount,
      type,
      downPayment,
      downPaymentPaid: false,
      installmentsCount: type === "installment" ? installmentsCount : 0,
      installmentAmount: type === "installment" && installments.length > 0 ? installments[0].amount : 0,
      status: "pending",
      paidTotal: 0,
      remainingDebt: totalAmount,
      createdAt: today.toISOString().slice(0, 10),
      installments,
    };

    invoices.unshift(newInvoice);
    write(KEYS.INVOICES, invoices);
    return newInvoice;
  },

  /**
   * Simulate mock payment for full invoice or down payment
   */
  payInvoiceDownPayment(invoiceId) {
    const invoices = this.getInvoices();
    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) return { success: false, message: "فاکتور یافت نشد." };

    inv.downPaymentPaid = true;
    inv.paidTotal += inv.downPayment;
    inv.remainingDebt = Math.max(0, inv.totalAmount - inv.paidTotal);
    inv.status = inv.remainingDebt === 0 ? "completed" : "active";
    inv.paidAt = new Date().toISOString().slice(0, 10);
    inv.receiptId = `REC-${Math.floor(100000 + Math.random() * 900000)}`;

    write(KEYS.INVOICES, invoices);
    return { success: true, invoice: inv };
  },

  /**
   * Pay a single installment
   */
  payInstallment(invoiceId, installmentId) {
    const invoices = this.getInvoices();
    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) return { success: false, message: "فاکتور یافت نشد." };

    const inst = inv.installments?.find((it) => it.id === installmentId);
    if (!inst) return { success: false, message: "قسط یافت نشد." };

    inst.status = "paid";
    inst.paidAt = new Date().toISOString().slice(0, 10);
    inst.receiptId = `REC-${Math.floor(100000 + Math.random() * 900000)}`;

    inv.paidTotal += inst.amount;
    inv.remainingDebt = Math.max(0, inv.totalAmount - inv.paidTotal);
    if (inv.remainingDebt === 0) {
      inv.status = "completed";
    }

    write(KEYS.INVOICES, invoices);
    return { success: true, invoice: inv };
  },

  // Business Model Canvas
  getBMC() {
    return read(KEYS.BMC, defaultBMC);
  },

  updateBMC(updatedBMC) {
    write(KEYS.BMC, updatedBMC);
    return updatedBMC;
  },

  resetBMC() {
    write(KEYS.BMC, defaultBMC);
    return defaultBMC;
  },

  // Reset demo data
  resetDemoData() {
    write(KEYS.USERS, defaultUsers);
    write(KEYS.TRAINERS, defaultTrainers);
    write(KEYS.CLASSES, defaultClasses);
    write(KEYS.BOOKINGS, defaultBookings);
    write(KEYS.PRODUCTS, defaultProducts);
    write(KEYS.INVOICES, defaultInvoices);
    write(KEYS.BMC, defaultBMC);
  },
};

// Auto initialize once on load
dataService.init();
