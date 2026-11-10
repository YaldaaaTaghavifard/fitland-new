# سند معماری سیستم (System Architecture)
## سامانه تندرستی و باشگاهی هوشمند فیت‌لند (FitLand)
**دانشگاه یزد — دانشکده مهندسی کامپیوتر**  
**پروژه کارشناسی مهندسی نرم‌افزار**  
**طراح و توسعه‌دهنده:** یلدا تقوی‌فرد  

---

## ۱. نمای کلی معماری (Architectural Overview)

فیت‌لند از الگوی معماری کلاینت‌محور مدرن تک‌صفحه‌ای (Single Page Application - SPA) بر پایه **React 19** و ابزار ساخت فوق سریع **Vite** بهره می‌برد. معماری نرم‌افزار به صورت لایه‌ای (Layered Architecture) تفکیک شده است تا قابلیت نگهداری، آزمون‌پذیری و توسعه آسان تضمین گردد:

```
+-------------------------------------------------------------------+
|                        Presentation Layer                         |
|  - Public Pages (Home, About, Plans, Trainers, Classes, Store)    |
|  - Academic Case (/business-case) & Scenario Runner Modal         |
|  - Member / Trainer / Admin Role Dashboards                       |
|  - Mock Payment & Installment Modal                               |
+-------------------------------------------------------------------+
                                  |
+-------------------------------------------------------------------+
|                         Context Layer                             |
|  - LanguageContext (Central i18n, RTL/LTR, Number/Currency Format) |
|  - AuthContext (Session management, RBAC guard)                   |
|  - ThemeContext (Dark / Light Theme State)                        |
+-------------------------------------------------------------------+
                                  |
+-------------------------------------------------------------------+
|                         Services Layer                            |
|  - dataService (CRUD, Inventory, Collision Booking, Invoices)     |
|  - scenarioService (12 Given/When/Then automated tests)           |
|  - trainerService & memberService (Domain specific logic)         |
+-------------------------------------------------------------------+
                                  |
+-------------------------------------------------------------------+
|                      Storage & Persistence Layer                  |
|  - Browser LocalStorage with Schemas & Integrity Guard            |
|  - Initial Seed Hydration & Reset Engine                          |
+-------------------------------------------------------------------+
```

---

## ۲. لایه مدیریت حالت و زمینه‌ها (Context Architecture)

### ۲.۱. سیستم بین‌المللی‌سازی متمرکز (`LanguageContext`)
- **کلیدهای ترجمه:** دو ماژول متمرکز `/src/translations/fa.js` و `/src/translations/en.js`.
- **انتقال بدون ریلود:** هوک `useLanguage()` وضعیت زبان (`fa` یا `en`) را تغییر می‌دهد. با این تغییر، خصوصیات `dir` و `lang` روی تگ ریشه `<html>` به‌صورت واکنشی (Reactive) تنظیم می‌شوند.
- **تغییر تایپوگرافی:** در حالت فارسی فونت اختصاصی `Vazirmatn` با اعداد فارسی اعمال می‌شود و در حالت انگلیسی فونت استاندارد `Inter` با اعداد لاتین.
- **فرمت‌کننده‌های ارزی:** توابع `formatCurrency` و `formatNumber` متناسب با زبان فعال خروجی تولید می‌کنند.

### ۲.۲. مدیریت احراز هویت و دسترسی (`AuthContext` & `ProtectedRoute`)
- **کنترل دسترسی مبتنی بر نقش (RBAC):** سه نقش `member`، `trainer` و `admin`.
- **محافظت از مسیرها:** کامپوننت `ProtectedRoute` با ارزیابی نقش کاربر، از دسترسی غیرمجاز جلوگیری کرده و کاربر را به `/unauthorized` یا `/login` هدایت می‌کند.

---

## ۳. لایه سرویس‌ها و منطق تجاری (Business Services Layer)

### ۳.۱. موتور داده متمرکز (`dataService.js`)
یک Singleton با مسئولیت‌های زیر:
- **مدیریت کلاس‌ها و رزروها:** رهگیری صندلی‌های باقی‌مانده و بررسی عدم تداخل زمانی (`checkCollision`).
- **مدیریت اقساط و فاکتورها:** محاسبه پیش‌پرداخت، مبلغ هر قسط، زمان‌بندی سررسید، پرداخت انفرادی اقساط و کاهش مانده بدهی.
- **مدیریت موجودی انبار:** بررسی موجودی در زمان خرید و کسر بلادرنگ تعداد کالا در صورت پرداخت موفق.
- **مدیریت بوم مدل کسب‌وکار (BMC):** امکان خواندن، اضافه کردن آیتم، حذف آیتم و بازنشانی بلوک‌های نه‌گانه.

### ۳.۲. موتور ارزیابی خودکار سناریوها (`scenarioService.js`)
- پیاده‌سازی ۱۲ سناریوی کاربری و تجاری به صورت کدهای تستی قابل اجرا در محیط کلاینت.
- هر سناریو شامل توصیف `given`، `when` و `then` و یک تابع `run()` غیرهمگام است که مستقیماً `dataService` را فراخوانی نموده، شروط صحت را با assertion بررسی می‌کند و نتیجه بولی همراه با لاگ متنی ثبت می‌نماید.

---

## ۴. ساختار کامپوننت‌ها و سلسله‌مراتب مسیرها

```
App
├── Routes
│   ├── PublicLayout
│   │   ├── Navbar (LanguageToggle, ThemeToggle, Navigation)
│   │   ├── Outlet
│   │   │   ├── HomePage
│   │   │   ├── AboutPage
│   │   │   ├── PlansPage (MockPaymentModal)
│   │   │   ├── TrainersPage (StarRating)
│   │   │   ├── ClassesPage & ClassDetailsPage (BookingEngine)
│   │   │   ├── StorePage & ProductDetailsPage (InstallmentCheckout)
│   │   │   ├── BusinessCasePage (BMC, Calculator, ScenarioRunner)
│   │   │   ├── ContactPage
│   │   │   └── FaqPage
│   │   └── Footer
│   │
│   ├── Auth Pages (/login, /register, /forgot-password)
│   │
│   ├── ProtectedRoute [member]
│   │   └── DashboardLayout
│   │       ├── MemberDashboard
│   │       ├── MemberProfile / Training / Nutrition / Measurements
│   │       └── MemberBookings & MemberPayments (Connected to dataService)
│   │
│   ├── ProtectedRoute [trainer]
│   │   └── DashboardLayout
│   │       ├── TrainerDashboard
│   │       ├── TrainerMembers & Details
│   │       ├── TrainerPlanEditor
│   │       └── TrainerCalendar & Reports
│   │
│   └── ProtectedRoute [admin]
│       └── DashboardLayout
│           └── AdminDashboard (Users, Memberships, Products)
```

---

## ۵. راهبرد سازگاری cross-platform و Apple Silicon (M1)

- پروژه از هیچ باینری بومی (Native C++ add-ons) وابسته به معماری x86 استفاده نمی‌کند.
- بسته‌های npm همگی سازگار با موتور V8 و پردازنده‌های سری M اپل هستند.
- اجرای پروژه نیازمند هیچ ابزار اضافی غیر از Node.js نسخه 18 یا بالاتر نبوده و با دستورات ساده `npm install` و `npm run dev` در ترمینال macOS اجرا می‌شود.
