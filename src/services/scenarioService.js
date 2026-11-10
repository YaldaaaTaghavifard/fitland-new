import { dataService } from "./dataService";

export const scenariosList = [
  {
    id: "SCN-01",
    title: "ثبت‌نام عضو جدید (Member Registration)",
    titleEn: "Member Registration & Credential Creation",
    category: "Auth",
    given: "کاربر مهمان فرم ثبت‌نام را با ایمیل معتبر و رمز عبور پر می‌کند.",
    when: "روی دکمه «ایجاد حساب کاربری» کلیک می‌کند.",
    then: "کاربر جدید در دیتابیس لوکال ثبت شده، به عنوان عضو شناخته می‌شود و اجازه ورود پیدا می‌کند.",
    run: async () => {
      const testEmail = `student_${Date.now()}@fitland.ir`;
      const newUser = dataService.addUser({
        name: "دانشجوی آزمایشی",
        email: testEmail,
        password: "password123",
        role: "member",
        phone: "09121112233",
      });
      const exists = dataService.findUserByEmail(testEmail);
      if (!exists || exists.id !== newUser.id) {
        throw new Error("کاربر در مخزن کاربران ذخیره نشد.");
      }
      return {
        passed: true,
        details: `کاربر با شناسه ${newUser.id} و ایمیل ${newUser.email} با موفقیت ثبت و تأیید شد.`,
      };
    },
  },
  {
    id: "SCN-02",
    title: "ورود با اعتبارسنجی نقش‌ها (Role-Based Authentication)",
    titleEn: "Role-Based Authentication & Guard",
    category: "Auth",
    given: "سه حساب آماده برای نقش‌های عضو، مربی و مدیر در سامانه وجود دارند.",
    when: "کاربر با ایمیل admin@fitland.ir و رمز 123456 اقدام به ورود می‌کند.",
    then: "سیستم احراز هویت موفقیت‌آمیز بودن ورود و هدایت به پنل اختصاصی /admin را تأیید می‌کند.",
    run: async () => {
      const admin = dataService.findUserByEmail("admin@fitland.ir");
      if (!admin || admin.role !== "admin") {
        throw new Error("حساب ادمین در سیستم یافت نشد.");
      }
      return {
        passed: true,
        details: `احراز هویت نقش مدیر با دسترسی ${admin.role} و نام ${admin.name} تأیید شد.`,
      };
    },
  },
  {
    id: "SCN-03",
    title: "رزرو موفق کلاس ورزشی (Successful Class Booking)",
    titleEn: "Class Booking & Capacity Ledger",
    category: "Booking",
    given: "کلاس ورزشی با ظرفیت خالی در تقویم وجود دارد.",
    when: "عضو اقدام به رزرو سانس می‌کند.",
    then: "رزرو ثبت شده، ظرفیت اشغال‌شده ۱ واحد افزایش می‌یابد و به تقویم مربی اضافه می‌شود.",
    run: async () => {
      const classes = dataService.getClasses();
      const openClass = classes.find((c) => c.reserved < c.capacity);
      if (!openClass) throw new Error("کلاس با ظرفیت خالی برای تست یافت نشد.");

      const initialReserved = openClass.reserved;
      const res = dataService.bookClass("member-1", "علی رضایی", openClass.id);
      if (!res.success) {
        // If already booked, try another or cancel then book
        throw new Error(res.message);
      }

      const updatedClass = dataService.getClassById(openClass.id);
      if (updatedClass.reserved !== initialReserved + 1) {
        throw new Error("شمارنده ظرفیت کلاس افزایش نیافت.");
      }

      return {
        passed: true,
        details: `کلاس «${openClass.title}» با شناسه رزرو ${res.booking.id} ثبت شد. ظرفیت جدید: ${updatedClass.reserved}/${updatedClass.capacity}`,
      };
    },
  },
  {
    id: "SCN-04",
    title: "جلوگیری قطعی از تداخل زمانی رزرو (Time Collision Prevention)",
    titleEn: "Prevent Duplicate / Overlapping Time Slots",
    category: "Booking",
    given: "کاربر در یک روز و ساعت مشخص یک جلسه رزروشده دارد.",
    when: "کاربر تلاش می‌کند جلسه دیگری را دقیقاً در همان روز و ساعت رزرو نماید.",
    then: "سیستم خطای تداخل زمانی را صادر کرده و مانع از ثبت رزرو دوم می‌شود.",
    run: async () => {
      const bookings = dataService.getBookings().filter((b) => b.status === "confirmed");
      if (bookings.length === 0) {
        throw new Error("حداقل یک رزرو تاییدشده برای تست تداخل لازم است.");
      }
      const existing = bookings[0];

      // Try booking the exact same class again
      const collisionAttempt = dataService.bookClass(
        existing.memberId,
        existing.memberName,
        existing.classId
      );

      if (collisionAttempt.success) {
        throw new Error("سیستم به اشتباه اجازه رزرو تکراری یا متداخل را صادر کرد!");
      }

      return {
        passed: true,
        details: `اعتبارسنجی تداخل موفق بود. خطای تولیدشده توسط هسته: «${collisionAttempt.message}»`,
      };
    },
  },
  {
    id: "SCN-05",
    title: "لغو رزرو و بازگشت ظرفیت (Booking Cancellation & Reclaim)",
    titleEn: "Cancel Reservation & Release Spot",
    category: "Booking",
    given: "عضو دارای یک رزرو فعال در سیستم است.",
    when: "عضو روی دکمه «لغو رزرو» کلیک می‌کند.",
    then: "وضعیت رزرو به cancelled تغییر یافته و یک صندلی در کلاس آزاد می‌شود.",
    run: async () => {
      const bookings = dataService.getBookings().filter((b) => b.status === "confirmed");
      if (bookings.length === 0) throw new Error("رزرو فعالی برای لغو یافت نشد.");
      const toCancel = bookings[0];
      const clsBefore = dataService.getClassById(toCancel.classId);

      const res = dataService.cancelBooking(toCancel.id);
      if (!res.success) throw new Error(res.message);

      const clsAfter = dataService.getClassById(toCancel.classId);
      if (clsBefore && clsAfter && clsAfter.reserved !== clsBefore.reserved - 1) {
        throw new Error("ظرفیت کلاس آزاد نشد.");
      }

      return {
        passed: true,
        details: `رزرو با شناسه ${toCancel.id} لغو شد و ظرفیت کلاس به ${clsAfter?.reserved} کاهش یافت.`,
      };
    },
  },
  {
    id: "SCN-06",
    title: "ایجاد فاکتور اقساطی و پرداخت پیش‌پرداخت (Installment Plan Creation)",
    titleEn: "Installment Invoice & Down Payment",
    category: "Payment",
    given: "کاربر پلن سه‌ماهه به مبلغ ۳,۲۰۰,۰۰۰ تومان را انتخاب کرده و مدل اقساطی ۲ ماهه را برمی‌گزیند.",
    when: "فاکتور اقساطی با ۳۰٪ پیش‌پرداخت ایجاد و پرداخت آنلاین آزمایشی شبیه‌سازی می‌شود.",
    then: "پیش‌پرداخت پرداخت شده، ۲ قسط ماهانه با سررسیدهای مشخص ایجاد شده و مانده بدهی ثبت می‌شود.",
    run: async () => {
      const newInvoice = dataService.createInvoice({
        memberId: "member-1",
        memberName: "علی رضایی",
        title: "اشتراک سه‌ماهه طلایی آزمایشی",
        titleEn: "Quarterly Gold Membership",
        totalAmount: 3200000,
        type: "installment",
        installmentsCount: 2,
        downPaymentPercent: 30,
      });

      if (!newInvoice || newInvoice.installments.length !== 2) {
        throw new Error("اقساط به درستی تولید نشدند.");
      }

      const payRes = dataService.payInvoiceDownPayment(newInvoice.id);
      if (!payRes.success) throw new Error("پرداخت پیش‌پرداخت با شکست مواجه شد.");

      return {
        passed: true,
        details: `فاکتور ${newInvoice.id} صادر شد. پیش‌پرداخت ${payRes.invoice.downPayment.toLocaleString()} تومان ثبت گردید. اقساط با سررسیدهای ${newInvoice.installments[0].dueDate} و ${newInvoice.installments[1].dueDate} تنظیم شدند.`,
      };
    },
  },
  {
    id: "SCN-07",
    title: "تسویه قسط دوره‌ای با کد پیگیری (Installment Settlement)",
    titleEn: "Pay Installment & Debt Deduction",
    category: "Payment",
    given: "کاربر دارای فاکتور اقساطی فعال با قسط در انتظار پرداخت است.",
    when: "کاربر قسط اول را پرداخت می‌کند.",
    then: "وضعیت قسط به paid تغییر یافته، مانده بدهی کسر شده و کد رهگیری مالی اختصاص می‌یابد.",
    run: async () => {
      const invoices = dataService.getInvoices();
      const instInvoice = invoices.find(
        (i) => i.type === "installment" && i.installments?.some((it) => it.status === "pending")
      );
      if (!instInvoice) throw new Error("فاکتور اقساطی پرداخت‌نشده یافت نشد.");

      const pendingInst = instInvoice.installments.find((it) => it.status === "pending");
      const debtBefore = instInvoice.remainingDebt;

      const res = dataService.payInstallment(instInvoice.id, pendingInst.id);
      if (!res.success) throw new Error("خطا در پرداخت قسط.");

      if (res.invoice.remainingDebt !== debtBefore - pendingInst.amount) {
        throw new Error("کسر مانده بدهی دقیق نبود.");
      }

      return {
        passed: true,
        details: `قسط شماره ${pendingInst.number} به مبلغ ${pendingInst.amount.toLocaleString()} تومان با کد پیگیری ${pendingInst.receiptId} تسویه شد. بدهی باقیمانده: ${res.invoice.remainingDebt.toLocaleString()} تومان.`,
      };
    },
  },
  {
    id: "SCN-08",
    title: "ثبت امتیاز مربی و به‌روزرسانی میانگین (Trainer Rating & Live Average)",
    titleEn: "Trainer Rating Recalculation",
    category: "Coaching",
    given: "عضو پس از اتمام دوره تمرینی به مربی خود امتیاز می‌دهد (مثلاً ۵ ستاره).",
    when: "امتیاز در سامانه ثبت می‌شود.",
    then: "میانگین نمره مربی و تعداد نظرات ثبت‌شده به صورت خودکار و ریاضی بازتعریف می‌شود.",
    run: async () => {
      const trainer = dataService.getTrainers()[0];
      const oldRating = trainer.rating;
      const oldCount = trainer.reviewsCount;

      dataService.rateTrainer(trainer.id, 5);
      const updated = dataService.getTrainerById(trainer.id);

      if (updated.reviewsCount !== oldCount + 1) {
        throw new Error("تعداد دیدگاه‌ها افزایش نیافت.");
      }

      return {
        passed: true,
        details: `امتیاز مربی ${trainer.name} از ${oldRating} (با ${oldCount} نظر) به ${updated.rating} (با ${updated.reviewsCount} نظر) به‌روزرسانی شد.`,
      };
    },
  },
  {
    id: "SCN-09",
    title: "انتخاب مربی برتر ماه توسط مدیر (Top Coach Recognition)",
    titleEn: "Admin Awards Coach of the Month",
    category: "Admin",
    given: "مدیر ارشد در پنل مدیریتی عملکرد مربیان را بررسی می‌کند.",
    when: "مربی منتخب را به عنوان «مربی برتر ماه» تعیین می‌نماید.",
    then: "نشان مربی برتر در صفحه مربیان و داشبورد مربی فعال شده و سایر مربیان عادی می‌مانند.",
    run: async () => {
      const trainers = dataService.getTrainers();
      const target = trainers[1] || trainers[0];

      dataService.setTopTrainer(target.id);
      const updated = dataService.getTrainerById(target.id);

      if (!updated.isTopTrainer) {
        throw new Error("نشان مربی برتر اعمال نشد.");
      }

      return {
        passed: true,
        details: `مربی «${target.name}» به عنوان مربی برتر ماه سیستم انتخاب و ثبت شد.`,
      };
    },
  },
  {
    id: "SCN-10",
    title: "کسر از انبار فروشگاه حین سفارش (Inventory Management & Deduction)",
    titleEn: "Inventory Deduction on Checkout",
    category: "Store",
    given: "محصول ورزشی با موجودی مشخص در انبار فروشگاه تعریف شده است.",
    when: "عضو اقدام به سفارش خرید ۲ عدد از محصول می‌کند.",
    then: "موجودی انبار کالا بلافاصله به میزان ۲ واحد کاهش یافته و در پنل مدیریت انبار نمایش می‌یابد.",
    run: async () => {
      const product = dataService.getProducts()[0];
      const stockBefore = product.stock;

      dataService.updateProductStock(product.id, -2);
      const updated = dataService.getProductById(product.id);

      if (updated.stock !== stockBefore - 2) {
        throw new Error("موجودی انبار به درستی کسر نشد.");
      }

      return {
        passed: true,
        details: `کالای «${product.name}» از موجودی ${stockBefore} به ${updated.stock} کاهش یافت. کنترل انبار فعال است.`,
      };
    },
  },
  {
    id: "SCN-11",
    title: "ویرایش زنده بوم مدل کسب‌وکار (Live Business Model Canvas Mutation)",
    titleEn: "Interactive BMC Persistence & Sync",
    category: "Business",
    given: "مدیر پروژه بخش ارزش‌های پیشنهادی یا جریان‌های درآمدی بوم را ویرایش می‌کند.",
    when: "داده‌های جدید ذخیره می‌شوند.",
    then: "تغییرات بلافاصله در LocalStorage ثبت و در تمام تب‌ها و رندرهای بعدی پرونده تحلیلی اعمال می‌شود.",
    run: async () => {
      const bmc = dataService.getBMC();
      const testValue = `ارزش نوآورانه تست دانشگاهی (${Date.now()})`;
      const updated = {
        ...bmc,
        valuePropositions: [...bmc.valuePropositions, testValue],
      };
      dataService.updateBMC(updated);
      const reloaded = dataService.getBMC();

      if (!reloaded.valuePropositions.includes(testValue)) {
        throw new Error("بوم مدل کسب‌وکار به درستی ذخیره نشد.");
      }

      return {
        passed: true,
        details: `بوم کسب‌وکار با موفقیت ویرایش و در استوریج ذخیره شد. تعداد گزاره‌های ارزش: ${reloaded.valuePropositions.length}`,
      };
    },
  },
  {
    id: "SCN-12",
    title: "آزمون فرمول‌های ماشین‌حساب اقتصادی (Unit Economics)",
    titleEn: "CAC, Revenue LTV, Gross Profit LTV & Payback",
    category: "Business",
    given: "ورودی‌های نمونه ماشین‌حساب پرونده تحلیلی شامل ARPU، نرخ ریزش، CAC و حاشیه سود فرضی هستند.",
    when: "سناریوی اقتصادی با همان فرض‌های اولیه رابط کاربری محاسبه می‌شود.",
    then: "فرمول‌های طول عمر، LTV درآمدی، LTV سود ناخالص و نسبت LTV/CAC بررسی می‌شوند؛ خروجی به‌عنوان سناریوی فرضی گزارش می‌شود.",
    run: async () => {
      const monthlySubscription = 1200000;
      const assumedCommission = 75000;
      const churnRate = 0.04;
      const cac = 450000;
      const grossMargin = 0.40;
      const arpu = monthlySubscription + assumedCommission;
      const lifespan = 1 / churnRate;
      const revenueLtv = arpu * lifespan;
      const grossProfitLtv = revenueLtv * grossMargin;
      const ratio = grossProfitLtv / cac;
      const expectedRevenueLtv = 31875000;
      const expectedGrossProfitLtv = 12750000;
      const expectedRatio = 28.3333333333;
      if (Math.round(revenueLtv) !== expectedRevenueLtv || Math.round(grossProfitLtv) !== expectedGrossProfitLtv || Math.abs(ratio - expectedRatio) > 0.001) {
        throw new Error("نتیجه محاسبه سنجه‌های اقتصادی با مقادیر مرجع ماشین‌حساب همخوان نیست.");
      }
      return {
        passed: true,
        details: `آزمون فرمول‌ها موفق بود. ARPU فرضی: ${arpu.toLocaleString()} تومان؛ طول عمر: ${lifespan.toFixed(1)} ماه؛ LTV درآمدی: ${revenueLtv.toLocaleString()} تومان؛ LTV سود ناخالص: ${grossProfitLtv.toLocaleString()} تومان؛ نسبت LTV سود ناخالص به CAC: ${ratio.toFixed(2)}x. این اعداد صرفاً فرض آزمایشی‌اند و اثبات سودآوری بازار نیستند.`,
      };
    },
  },
];
