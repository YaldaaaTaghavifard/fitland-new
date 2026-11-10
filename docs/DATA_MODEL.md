# سند مدل داده و پایگاه داده (Data Model Specification)
## سامانه هوشمند فیت‌لند (FitLand)
**دانشگاه یزد — دانشکده مهندسی کامپیوتر**  
**پروژه درس مهندسی نرم‌افزار / پایگاه داده**  
**دانشجو:** یلدا تقوی‌فرد  

---

## ۱. نمای کلی و راهبرد پایدارسازی (Persistence Strategy)

در این نسخه از سامانه، به منظور عملکرد کاملاً خودمختار و بدون نیاز به نصب پایگاه‌های داده سنگین (RDBMS) در هنگام داوری و دفاع، از یک **لایه شبیه‌ساز رابطه‌ای در LocalStorage مرورگر** با مدل داده شیءگرا و مکانیزم‌های حفظ جامعیت ارجاعی (Referential Integrity) استفاده شده است. تمامی داده‌ها در کلید `fitland_master_db_v2` ذخیره و مدیریت می‌شوند.

---

## ۲. موجودیت‌های داده و ساختار فیلدها (Entities & Schemas)

### ۲.۱. موجودیت کاربر (`User`)
```typescript
interface User {
  id: string;               // کلید اصلی (مانند 'member-1', 'trainer-1', 'admin-1')
  name: string;             // نام و نام خانوادگی
  email: string;            // پست الکترونیک (منحصربه‌فرد)
  phone: string;            // شماره تماس ۱۱ رقمی
  role: 'member' | 'trainer' | 'admin';
  avatar?: string;
  joinDate: string;         // فرمت YYYY-MM-DD
}
```

### ۲.۲. موجودیت مربی (`Trainer`)
```typescript
interface Trainer {
  id: string;               // کلید اصلی
  name: string;
  nameEn: string;
  specialty: string;        // تخصص (مانند بدنسازی، کراس‌فیت، پیلاتس)
  specialtyEn: string;
  rating: number;           // میانگین امتیاز ستاره‌ای (مثلاً 4.9)
  reviewsCount: number;     // تعداد کل بازخوردها
  activeStudents: number;   // تعداد شاگردان فعال
  image: string;            // آدرس تصویر
  bio: string;
  bioEn: string;
  badges: string[];
}
```

### ۲.۳. موجودیت کلاس ورزشی (`ClassSession`)
```typescript
interface ClassSession {
  id: string;               // کلید اصلی (مانند 'cls-1')
  title: string;
  titleEn: string;
  trainerId: string;        // کلید خارجی به Trainer
  trainerName: string;
  category: string;         // دسته‌بندی کلاس
  date: string;             // تاریخ برگزاری (YYYY-MM-DD)
  time: string;             // ساعت برگزاری (مانند '17:00 - 18:30')
  capacity: number;         // ظرفیت کل سالن
  reserved: number;         // تعداد صندلی‌های رزروشده
  price: number;            // هزینه هر سانس (تومان)
  description: string;
}
```

### ۲.۴. موجودیت رزرو کلاس (`Booking`)
```typescript
interface Booking {
  id: string;               // کلید اصلی (مانند 'bkg-1718293021')
  memberId: string;         // کلید خارجی به User
  memberName: string;
  classId: string;          // کلید خارجی به ClassSession
  classTitle: string;
  trainerId: string;
  trainerName: string;
  date: string;             // تاریخ سانس
  time: string;             // بازه ساعت سانس
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}
```

### ۲.۵. موجودیت کالا در فروشگاه (`Product`)
```typescript
interface Product {
  id: number | string;      // شناسه کالا
  name: string;
  nameEn: string;
  category: string;
  price: number;            // قیمت جاری (تومان)
  originalPrice?: number;   // قیمت قبل از تخفیف
  stock: number;            // تعداد موجودی انبار
  rating: number;
  reviews: number;
  badge?: string;
  specs: string;
  image: string;
}
```

### ۲.۶. موجودیت فاکتور و تقسیط (`Invoice` & `Installment`)
```typescript
interface Installment {
  id: string;               // شناسه قسط (مانند 'inst-1')
  number: number;           // شماره قسط (۱ تا ۶)
  amount: number;           // مبلغ قسط به تومان
  dueDate: string;          // تاریخ سررسید (YYYY-MM-DD)
  status: 'paid' | 'pending';
  paidAt?: string;
}

interface Invoice {
  id: string;               // شناسه فاکتور (مانند 'INV-1001')
  receiptId: string;        // کد رهگیری مالی آزمایشی
  memberId: string;
  memberName: string;
  title: string;
  titleEn: string;
  totalAmount: number;
  type: 'full' | 'installment';
  downPayment: number;      // مبلغ پیش‌پرداخت
  remainingDebt: number;    // مانده بدهی تسویه‌نشده
  date: string;
  status: 'active' | 'settled' | 'cancelled';
  installments: Installment[];
}
```

---

## ۳. قواعد جامعیت و انقیادها (Integrity Constraints)

1. **قاعده پیشگیری از تداخل زمانی (Collision Avoidance Constraint):**
   در جدول `Booking`، هیچ دو رکوردی برای یک `memberId` مجاز نیستند که `date` و `time` یکسان داشته باشند مگر آنکه وضعیت حداقل یکی از آنها `cancelled` باشد:
   $$\forall b_1, b_2 \in \text{Bookings}: (b_1.memberId = b_2.memberId \land b_1.date = b_2.date \land b_1.time = b_2.time \land b_1.status \neq \text{'cancelled'} \land b_2.status \neq \text{'cancelled'}) \implies b_1.id = b_2.id$$

2. **قاعده کنترل سقف ظرفیت کلاس (Capacity Constraint):**
   تعداد رزروهای تاییدشده یک کلاس هرگز نباید از فیلد `capacity` آن تجاوز کند:
   $$\text{ClassSession.reserved} \le \text{ClassSession.capacity}$$

3. **قاعده توازن مالی اقساط (Financial Balance Invariant):**
   مجموع پیش‌پرداخت به علاوه تمامی اقساط باید دقیقاً برابر با مبلغ کل فاکتور باشد:
   $$\text{Invoice.downPayment} + \sum_{i \in \text{installments}} i.amount = \text{Invoice.totalAmount}$$

4. **قاعده انبارداری و کسر موجودی (Stock Conservation Invariant):**
   هنگام ثبت موفق سفارش کالا با تعداد $q$، موجودی جدید انبار برابر خواهد بود با:
   $$\text{stock}_{new} = \max(0, \text{stock}_{old} - q)$$
