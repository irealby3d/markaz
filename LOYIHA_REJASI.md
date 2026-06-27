# 🏗️ Markazlashgan Boshqaruv Platformasi — Loyiha Rejasi

> **Loyiha kodi:** `AKA-CENTRAL-HUB`  
> **Versiya:** 1.0.0  
> **Sana:** 2026-06  
> **Muallif:** aka-FinGo  

---

## 📋 Mundarija

1. [Loyiha Maqsadi](#1-loyiha-maqsadi)
2. [Mavjud Repositoriyalar Tahlili](#2-mavjud-repositoriyalar-tahlili)
3. [Umumiy Arxitektura](#3-umumiy-arxitektura)
4. [Foydalanuvchi Rollari](#4-foydalanuvchi-rollari)
5. [Modullar va Funksiyalar](#5-modullar-va-funksiyalar)
6. [Texnologiyalar Stacki](#6-texnologiyalar-stacki)
7. [Ma'lumotlar Bazasi Sxemasi](#7-malumotlar-bazasi-sxemasi)
8. [API Dizayni](#8-api-dizayni)
9. [Telegram Web App Integratsiyasi](#9-telegram-web-app-integratsiyasi)
10. [UI/UX Ko'rsatmalari](#10-uiux-korsatmalari)
11. [Rivojlanish Bosqichlari (Roadmap)](#11-rivojlanish-bosqichlari-roadmap)
12. [Deployment Rejasi](#12-deployment-rejasi)
13. [Xavfsizlik](#13-xavfsizlik)

---

## 1. Loyiha Maqsadi

Mavjud 4 ta alohida GitHub repositoriyasini **yagona markazlashgan platforma**ga birlashtirish. Platforma ikki yo'nalishda ishlaydi:

| Yo'nalish | Foydalanuvchi | Interfeys |
|---|---|---|
| **Admin Panel** | IT admin, menejerlar | Web + Mobile (Responsive) + Telegram Web App |
| **User Panel** | Xodimlar, ishchilar | Telegram Web App (asosiy) |

### Muammo va Yechim

```
MUAMMO:
  4 ta alohida bot/vosita → tarqoq boshqaruv → ineffektivlik

YECHIM:
  Yagona API Gateway → Markaziy Backend → 4 modul birlashadi
  Telegram Web App → barcha foydalanuvchilar bitta joydan kiradi
```

---

## 2. Mavjud Repositoriyalar Tahlili

### 📦 aka-FinGo/ish-haqi-bot
- **Maqsad:** Xodimlar ish haqi va avanslarini hisoblash, qayd etish
- **Asosiy funksiyalar:** Oylik maosh, avans berish, ushlab qolishlar, hisobotlar
- **Platformaga qo'shilish turi:** To'liq integratsiya, alohida modul sifatida

### 📦 aka-FinGo/module_fl
- **Maqsad:** LDSP qoldiqlarini boshqarish (Floor/furniture material)
- **Asosiy funksiyalar:** Inventar ko'rish, material qo'shish, sarflovni belgilash
- **Platformaga qo'shilish turi:** To'liq integratsiya, LDSP modul sifatida

### 📦 aka-FinGo/Rest
- **Maqsad:** Buyurtmalar boshqaruvi (REST API backend yoki Orders system)
- **Asosiy funksiyalar:** Buyurtmalar ro'yxati, holat yangilash, yangi buyurtma
- **Platformaga qo'shilish turi:** Asosiy buyurtmalar moduli

### 📦 aka-FinGo/GiblabMerger
- **Maqsad:** CNC stankolar uchun XML/G-code fayllarni birlashtirish
- **Asosiy funksiyalar:** Fayl yuklash, birlashtirish, yuklab olish
- **Platformaga qo'shilish turi:** Maxsus asbob moduli

---

## 3. Umumiy Arxitektura

```
┌─────────────────────────────────────────────────────────────┐
│                    FOYDALANUVCHI QATLAMI                    │
├───────────────────┬─────────────────┬───────────────────────┤
│  Telegram Web App │   Admin Web UI  │   Mobile (PWA/TWA)    │
│  (User + Admin)   │  (Full desktop) │   (iOS/Android)       │
└────────┬──────────┴────────┬────────┴───────────────────────┘
         │                   │
         ▼                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY (nginx)                      │
│            JWT Auth  |  Rate Limiting  |  CORS              │
└─────────────────────────┬───────────────────────────────────┘
                           │
         ┌─────────────────┼────────────────────┐
         ▼                 ▼                    ▼
┌────────────────┐ ┌───────────────┐ ┌──────────────────┐
│  Auth Service  │ │  Core API     │ │  Telegram Bot    │
│  (JWT + TG)    │ │  (Express.js) │ │  Service         │
└────────────────┘ └───────┬───────┘ └──────────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         ▼                  ▼                  ▼
┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│  IshHaqi Modul │ │   LDSP Modul   │ │  Orders Modul  │
│  (ish-haqi-bot)│ │  (module_fl)   │ │    (Rest)      │
└────────────────┘ └────────────────┘ └────────────────┘
         │                  │                  │
         └──────────────────┼──────────────────┘
                            ▼
              ┌─────────────────────────┐
              │   GiblabMerger Service  │
              │   (fayl protsessor)     │
              └─────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │    PostgreSQL Database  │
              │    + Redis Cache        │
              │    + MinIO (fayllar)    │
              └─────────────────────────┘
```

---

## 4. Foydalanuvchi Rollari

```
SUPER_ADMIN
  └─ Barcha modullar full access
  └─ Foydalanuvchi yaratish/o'chirish
  └─ Tizim sozlamalari
  └─ Hisobotlar va statistika

MANAGER  
  └─ Buyurtmalar yaratish va boshqarish
  └─ Ish haqini tasdiqlash
  └─ LDSP inventarini ko'rish (read-only)
  └─ GiblabMerger ishlatish

WORKER (xodim)
  └─ O'z ish haqi va avansini ko'rish
  └─ Buyurtmalar ro'yxatini ko'rish
  └─ Buyurtmani "bajarildi" belgilash
  └─ LDSP so'rov qilish (yangi so'rov)

OPERATOR (omborchi)
  └─ LDSP inventar boshqaruvi (full)
  └─ GiblabMerger fayl yuklash
  └─ Buyurtma holati yangilash
```

---

## 5. Modullar va Funksiyalar

---

### 5.1 🧮 IshHaqi Moduli (`ish-haqi-bot`)

#### Admin uchun:
- [ ] Xodimlar ro'yxatini boshqarish (CRUD)
- [ ] Oylik maosh belgilash
- [ ] Avans berish (miqdor + sana + izoh)
- [ ] Ushlab qolishlar qayd etish (jarima, to'lov va h.k.)
- [ ] Oylik hisob-kitob yakunlash
- [ ] PDF/Excel hisobot generatsiyasi
- [ ] Ish haqi tarixi ko'rish

#### Worker uchun (Telegram Web App):
- [ ] 📊 Joriy oy balansini ko'rish
- [ ] 💰 Avans so'rash (miqdor kiritish)
- [ ] 📅 Ish haqi tarixi (oxirgi 3-6 oy)
- [ ] 📋 Avans tarixi ro'yxati
- [ ] 🔔 Ish haqi tayyor bo'lganda bildirishnoma

#### Ma'lumotlar:
```
Xodim: id, ism, familiya, telegram_id, lavozim, oylik_maosh, bank_karta
Avans: id, xodim_id, miqdor, sana, tasdiqlangan, izoh
Oylik: id, xodim_id, oy, yil, jami_maosh, jami_avans, ushlab_qolish, to'lanadigan
```

---

### 5.2 🪵 LDSP Modul (`module_fl`)

#### Admin/Operator uchun:
- [ ] Material turlari katalogi (o'lcham, rang, qalinlik)
- [ ] Inventar qo'shish (keldi, miqdor, yetkazuvchi)
- [ ] Sarflov qayd etish (qaysi buyurtma, qancha sarflandi)
- [ ] Minimal qoldiq ogohlantirishi (alert)
- [ ] Harakatlar tarixi (kirdi/chiqdi jadvali)
- [ ] Ombor hisoboti (PDF/Excel)

#### Worker uchun (Telegram Web App):
- [ ] 📦 Mavjud materiallar ro'yxati va qoldiq
- [ ] 🔍 Material qidirish (o'lcham/rang bo'yicha)
- [ ] ➕ Sarflov so'rovi (qaysi materialdan qancha kerak)
- [ ] 📉 Kam qolgan materiallar ko'rish
- [ ] 📬 So'rov holati kuzatuvi

#### Ma'lumotlar:
```
Material: id, nomi, o'lcham, qalinlik, rang, artikul, birlik
Inventar: id, material_id, miqdor, minimal_miqdor, ombor_joyi
Kirim: id, material_id, miqdor, sana, yetkazuvchi, narx, hujjat_raqami
Chiqim: id, material_id, miqdor, buyurtma_id, sana, operator_id, izoh
```

---

### 5.3 📋 Buyurtmalar Moduli (`Rest`)

#### Admin/Manager uchun:
- [ ] Yangi buyurtma yaratish (mijoz, mahsulot, o'lchamlar, muddat)
- [ ] Buyurtmalar kanbani (Yangi → Ishlab chiqarishda → Tayyor → Yetkazildi)
- [ ] Buyurtmaga xodim belgilash
- [ ] Material sarflanishi buyurtmaga bog'lash
- [ ] To'lov holati boshqaruvi
- [ ] Muddat kuzatuvi (kechikkanlar uchun alert)
- [ ] Mijozlar katalogi

#### Worker uchun (Telegram Web App):
- [ ] 📋 Menga biriktirilgan buyurtmalar
- [ ] ✅ Buyurtmani "Bajarildi" belgilash
- [ ] 🔄 Buyurtma holati yangilash (bosqich bo'yicha)
- [ ] 📎 Fotosuratni yuklash (ish jarayoni/natija)
- [ ] 🔔 Yangi buyurtma bildirishi

#### Ma'lumotlar:
```
Mijoz: id, ism, telefon, manzil, izoh
Buyurtma: id, mijoz_id, raqam, sana, muddat, holat, jami_narx, to'landi
BuyurtmaQatori: id, buyurtma_id, mahsulot, o'lcham, miqdor, narx
XodimBuyurtma: id, xodim_id, buyurtma_id, biriktirilgan_sana, yakunlangan_sana
```

---

### 5.4 🔧 GiblabMerger Moduli (`GiblabMerger`)

#### Admin/Operator uchun:
- [ ] XML/G-code fayllarni yuklash (drag & drop)
- [ ] Fayllar ro'yxati boshqaruvi
- [ ] Birlashtirish konfiguratsiyasi (tartib, sozlamalar)
- [ ] Birlashtirish va natijani yuklab olish
- [ ] Birlashtirish tarixi (qachon, kim, qaysi fayllar)
- [ ] Fayl preview ko'rish
- [ ] Buyurtmaga fayl bog'lash

#### Worker uchun (Telegram Web App):
- [ ] 📁 Mavjud tayyorlangan fayllar ro'yxati
- [ ] ⬇️ Kerakli faylni yuklab olish
- [ ] 🔔 Yangi fayl tayyor bo'lganda bildirishnoma

#### Ma'lumotlar:
```
Fayl: id, nomi, turi, hajmi, yuklagan_id, yuklangan_sana, minio_path
Birlashtirish: id, nomi, fayllar_ro'yhati (JSON), holat, natija_path, yaratilgan
FaylBuyurtma: id, fayl_id, buyurtma_id
```

---

## 6. Texnologiyalar Stacki

### Backend
```yaml
Runtime: Node.js 20 LTS
Framework: Express.js + TypeScript
ORM: Prisma
Authentication: JWT + Telegram initData verification
Task Queue: Bull (Redis-based)
WebSockets: Socket.io (real-time bildirishnomalar)
File Storage: MinIO (self-hosted S3-compatible)
```

### Frontend — Admin Panel
```yaml
Framework: React 18 + TypeScript
Build: Vite
UI Kit: Custom (referans: mavjud dark theme)
Stil: Tailwind CSS (mavjud CSS o'zgaruvchilari bilan)
Grafiklar: Chart.js (mavjud kabi)
State: Zustand
HTTP: Axios + React Query
```

### Frontend — Telegram Web App (User Panel)
```yaml
Framework: React 18 + TypeScript (yengil, optimized)
Telegram SDK: @twa-dev/sdk
Dizayn: Mavjud dark dashboard stili (reference)
Deploy: Static hosting (Nginx/Vercel)
```

### Infratuzilma
```yaml
Database: PostgreSQL 16
Cache: Redis 7
Proxy: Nginx
Container: Docker + Docker Compose
CI/CD: GitHub Actions (auto-deploy on push)
Monitoring: Grafana + Prometheus (optional)
```

### Telegram Bot
```yaml
Library: node-telegram-bot-api yoki grammy
Webhook: HTTPS endpoint
Mini App: Telegram Web App button
```

---

## 7. Ma'lumotlar Bazasi Sxemasi

### Asosiy jadvallar

```sql
-- Foydalanuvchilar
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  telegram_id   BIGINT UNIQUE NOT NULL,
  username      VARCHAR(100),
  full_name     VARCHAR(200) NOT NULL,
  phone         VARCHAR(20),
  role          VARCHAR(20) DEFAULT 'worker', -- super_admin, manager, worker, operator
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Xodimlar (ish-haqi uchun qo'shimcha ma'lumotlar)
CREATE TABLE employees (
  id              SERIAL PRIMARY KEY,
  user_id         INT REFERENCES users(id),
  position        VARCHAR(100),
  monthly_salary  DECIMAL(12,2),
  bank_card       VARCHAR(30),
  hire_date       DATE,
  is_active       BOOLEAN DEFAULT true
);

-- Avanslar
CREATE TABLE advances (
  id            SERIAL PRIMARY KEY,
  employee_id   INT REFERENCES employees(id),
  amount        DECIMAL(12,2) NOT NULL,
  date          DATE DEFAULT CURRENT_DATE,
  approved_by   INT REFERENCES users(id),
  is_approved   BOOLEAN DEFAULT false,
  note          TEXT
);

-- Materiallar
CREATE TABLE materials (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(200) NOT NULL,
  dimensions    VARCHAR(100), -- masalan: "2800x2070"
  thickness     DECIMAL(6,2),
  color         VARCHAR(100),
  article       VARCHAR(50) UNIQUE,
  unit          VARCHAR(20) DEFAULT 'dona'
);

-- Inventar
CREATE TABLE inventory (
  id              SERIAL PRIMARY KEY,
  material_id     INT REFERENCES materials(id),
  quantity        DECIMAL(10,2) DEFAULT 0,
  min_quantity    DECIMAL(10,2) DEFAULT 5,
  location        VARCHAR(100)
);

-- Mijozlar
CREATE TABLE clients (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(200) NOT NULL,
  phone         VARCHAR(20),
  address       TEXT,
  note          TEXT,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Buyurtmalar
CREATE TABLE orders (
  id            SERIAL PRIMARY KEY,
  order_number  VARCHAR(20) UNIQUE NOT NULL,
  client_id     INT REFERENCES clients(id),
  status        VARCHAR(30) DEFAULT 'new', -- new, in_progress, ready, delivered
  deadline      DATE,
  total_price   DECIMAL(12,2),
  paid_amount   DECIMAL(12,2) DEFAULT 0,
  note          TEXT,
  created_by    INT REFERENCES users(id),
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Buyurtma elementlari
CREATE TABLE order_items (
  id            SERIAL PRIMARY KEY,
  order_id      INT REFERENCES orders(id),
  product_name  VARCHAR(200),
  dimensions    VARCHAR(100),
  quantity      INT DEFAULT 1,
  unit_price    DECIMAL(12,2),
  note          TEXT
);

-- Xodim-buyurtma
CREATE TABLE order_assignments (
  id              SERIAL PRIMARY KEY,
  order_id        INT REFERENCES orders(id),
  user_id         INT REFERENCES users(id),
  assigned_at     TIMESTAMP DEFAULT NOW(),
  completed_at    TIMESTAMP
);

-- GiblabMerger fayllar
CREATE TABLE merger_files (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(300) NOT NULL,
  file_type     VARCHAR(10), -- xml, nc, gcode
  size_bytes    BIGINT,
  minio_path    VARCHAR(500),
  uploaded_by   INT REFERENCES users(id),
  order_id      INT REFERENCES orders(id),
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Birlashtirish operatsiyalari
CREATE TABLE merge_operations (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(200),
  file_ids      JSONB,         -- [1, 3, 7] kabi
  config        JSONB,
  status        VARCHAR(20) DEFAULT 'pending', -- pending, processing, done, error
  result_path   VARCHAR(500),
  created_by    INT REFERENCES users(id),
  created_at    TIMESTAMP DEFAULT NOW()
);
```

---

## 8. API Dizayni

### Base URL: `https://api.yourdomain.uz/v1`

### Auth

```
POST /auth/telegram      — Telegram initData orqali login
POST /auth/refresh       — Token yangilash
POST /auth/logout        — Chiqish
```

### IshHaqi

```
GET    /salary/employees             — Xodimlar ro'yxati
POST   /salary/employees             — Yangi xodim
GET    /salary/employees/:id         — Xodim ma'lumotlari
PATCH  /salary/employees/:id         — Xodim yangilash
GET    /salary/advances              — Avanslar ro'yxati
POST   /salary/advances              — Yangi avans so'rovi
PATCH  /salary/advances/:id/approve  — Avansni tasdiqlash
GET    /salary/monthly/:id           — Oylik hisob
POST   /salary/monthly/close         — Oyni yakunlash
GET    /salary/report                — Hisobot (PDF/Excel)
```

### LDSP

```
GET    /ldsp/materials               — Materiallar katalogi
POST   /ldsp/materials               — Yangi material
GET    /ldsp/inventory               — Inventar holati
POST   /ldsp/inventory/add           — Kirim qayd etish
POST   /ldsp/inventory/use           — Chiqim qayd etish
GET    /ldsp/inventory/low-stock     — Kam qolgan materiallar
GET    /ldsp/history                 — Harakatlar tarixi
```

### Buyurtmalar

```
GET    /orders                       — Buyurtmalar ro'yxati (filtr bilan)
POST   /orders                       — Yangi buyurtma
GET    /orders/:id                   — Buyurtma tafsiloti
PATCH  /orders/:id/status            — Holat yangilash
POST   /orders/:id/assign            — Xodim belgilash
GET    /orders/my                    — Menga biriktirilgan (worker uchun)
POST   /orders/:id/complete          — Bajarildi belgilash
GET    /clients                      — Mijozlar katalogi
POST   /clients                      — Yangi mijoz
```

### GiblabMerger

```
POST   /merger/upload                — Fayl yuklash (multipart)
GET    /merger/files                 — Fayllar ro'yxati
DELETE /merger/files/:id             — Fayl o'chirish
POST   /merger/merge                 — Birlashtirish boshlash
GET    /merger/operations            — Operatsiyalar tarixi
GET    /merger/operations/:id/status — Operatsiya holati
GET    /merger/operations/:id/download — Natijani yuklab olish
```

### Admin

```
GET    /admin/dashboard/stats        — Dashboard uchun statistika
GET    /admin/users                  — Foydalanuvchilar
PATCH  /admin/users/:id/role         — Rol o'zgartirish
GET    /admin/notifications          — Bildirishnomalar
```

---

## 9. Telegram Web App Integratsiyasi

### Bot Tuzilishi

```
/start      → Xush kelibsiz + asosiy menyu
/menu       → Asosiy menyu klaviaturasi
/salary     → Ish haqi bo'limi
/orders     → Buyurtmalar bo'limi
/ldsp       → LDSP materiallar
/merger     → GiblabMerger (admin/operator)
/help       → Yordam
```

### Web App Sahifalari (React Router)

```
/ (Home)
  ├── /salary            (IshHaqi moduli)
  │   ├── /salary/my         — Mening ish haqim
  │   └── /salary/advances   — Avanslar
  ├── /orders            (Buyurtmalar moduli)
  │   ├── /orders/list       — Buyurtmalar ro'yxati
  │   ├── /orders/:id        — Buyurtma tafsiloti
  │   └── /orders/new        — Yangi buyurtma (admin)
  ├── /ldsp              (LDSP moduli)
  │   ├── /ldsp/stock        — Qoldiqlar
  │   └── /ldsp/request      — So'rov qilish
  └── /merger            (Faqat admin/operator)
      ├── /merger/files      — Fayllar
      └── /merger/merge      — Birlashtirish
```

### Telegram initData Verification

```javascript
// Bot token bilan server tomonida tekshirish
import crypto from 'crypto';

function verifyTelegramWebAppData(initData, botToken) {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');
  
  const dataCheckString = [...urlParams.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');
  
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();
  
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');
  
  return calculatedHash === hash;
}
```

### Deep Link Tizimi

```
Bot → Web App URL: https://t.me/YourBotName/app
                   https://t.me/YourBotName/app?startapp=order_123
                   https://t.me/YourBotName/app?startapp=salary
```

---

## 10. UI/UX Ko'rsatmalari

### Dizayn Tizimi (Reference: Mavjud Dashboard)

```css
/* Mavjud dashboard CSS o'zgaruvchilari — saqlansin */
:root {
  --bg-color: #0a0a0a;          /* Asosiy fon */
  --accent-color: #ff5722;       /* Urg'u rangi */
  --card-bg: rgba(20,20,20,0.8); /* Karta fonlari */
  --card-border: #222222;        /* Chegaralar */
  --text-main: #ffffff;
  --text-muted: #888888;
  --success: #2ecc71;
  --warning: #f1c40f;
  
  /* Qo'shimcha: modullar uchun rang kodi */
  --salary-color: #4fc3f7;       /* Ko'k — ish haqi */
  --ldsp-color: #a5d6a7;         /* Yashil — materiallar */
  --orders-color: #ffb74d;       /* Apelsin — buyurtmalar */
  --merger-color: #ce93d8;       /* Binafsha — merger */
}
```

### Admin Panel Sahifa Tuzilishi

```
┌─────────────────────────────────────────────────────┐
│  SIDEBAR         │  MAIN CONTENT AREA               │
│  ─────────       │  ─────────────────────           │
│  📊 Dashboard    │  ┌──── KPI Cards (4 dona) ────┐  │
│  💰 IshHaqi      │  │ [64%] [1450m²] [124] [99%] │  │
│  🪵 LDSP         │  └──────────────────────────── ┘  │
│  📋 Buyurtmalar  │                                   │
│  🔧 Merger       │  ┌── Charts ─────────────────┐   │
│  👥 Foydalanuvchi│  │  Line  │   Doughnut       │   │
│  ⚙️ Sozlamalar   │  └───────────────────────────┘   │
│                  │                                   │
│  [User Avatar]   │  ┌── Modullar ────────────────┐  │
│  [Role Badge]    │  │  [Card] [Card] [Card]      │  │
└──────────────────┴─────────────────────────────────┘
```

### Telegram Web App (User Panel) Tuzilishi

```
┌─────────────────────┐
│  ☰  AKA HUB    [👤] │  ← Telegram native header
├─────────────────────┤
│                     │
│   Salom, Abdulloh!  │
│   Rol: Xodim 👷    │
│                     │
│  ┌────────────────┐ │
│  │  💰 Ish Haqi  │ │  ← Katta tugmalar, thumb-friendly
│  │  Bu oy: 2.5M  │ │
│  └────────────────┘ │
│  ┌────────────────┐ │
│  │ 📋 Buyurtmalar│ │
│  │  3 ta aktiv   │ │
│  └────────────────┘ │
│  ┌────────────────┐ │
│  │  🪵 LDSP      │ │
│  │  So'rov qilish│ │
│  └────────────────┘ │
│                     │
└─────────────────────┘
```

### UX Qoidalari

1. **Telegram tema ranglarini hurmat qilish:** `--tg-theme-bg-color`, `--tg-theme-text-color` dan foydalanish
2. **Thumb zone:** Asosiy tugmalar pastda, qulay qo'l bilan bosish uchun
3. **Dark mode:** Asosiy (mavjud dashboard bilan uyg'un)
4. **Loading states:** Skeleton loader (spinner emas)
5. **Error handling:** Inline error xabarlar, modalsiz
6. **Haptic feedback:** `WebApp.HapticFeedback` ishlatish
7. **Back button:** `WebApp.BackButton` — Telegram native back

---

## 11. Rivojlanish Bosqichlari (Roadmap)

### 🔵 FAZA 1 — Poydevor (2–3 hafta)

**Maqsad:** Asosiy infratuzilma va auth

- [ ] Monorepo yaratish (`packages/backend`, `packages/admin`, `packages/twa`)
- [ ] PostgreSQL + Prisma sozlash (barcha jadvallar)
- [ ] Redis + Bull queue sozlash
- [ ] MinIO sozlash
- [ ] Telegram Bot yaratish va webhook
- [ ] JWT + Telegram initData autentifikatsiyasi
- [ ] API Gateway (nginx) sozlash
- [ ] Docker Compose fayl
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Admin paneli skeleti (sidebar + routing)
- [ ] Telegram Web App skeleti

**Deliverables:**
```
✅ /auth/telegram ishlaydi
✅ Bot /start komandasiga javob beradi
✅ Web App ochiladi va user auth bo'ladi
✅ Admin panel kirish sahifasi
```

---

### 🟡 FAZA 2 — IshHaqi Moduli (2 hafta)

**Maqsad:** ish-haqi-bot to'liq integratsiyasi

- [ ] Xodimlar CRUD (admin panel)
- [ ] Avans so'rovi (TWA + bot)
- [ ] Avansni tasdiqlash (admin)
- [ ] Oylik hisob-kitob
- [ ] Bildirishnomalar (avans tasdiqlandi/rad etildi)
- [ ] Ish haqi tarixi ko'rish (TWA)
- [ ] PDF hisobot generatsiyasi

**Deliverables:**
```
✅ Xodim avans so'rashi mumkin
✅ Admin tasdiqlaydi → xodimga bildirishnoma
✅ Oylik ish haqini yakunlash
```

---

### 🟡 FAZA 3 — Buyurtmalar Moduli (2 hafta)

**Maqsad:** Rest loyihasi integratsiyasi

- [ ] Mijozlar katalogi
- [ ] Buyurtma yaratish (admin)
- [ ] Kanban board (admin panel)
- [ ] Worker uchun o'z buyurtmalar ro'yxati (TWA)
- [ ] "Bajarildi" belgilash (TWA)
- [ ] Muddat ogohlantirishi (auto cron job)
- [ ] Buyurtma to'lov boshqaruvi

**Deliverables:**
```
✅ Admin yangi buyurtma yaratadi
✅ Worker ko'radi va bajaradi
✅ Admin kuzatadi
```

---

### 🟢 FAZA 4 — LDSP Moduli (1.5 hafta)

**Maqsad:** module_fl integratsiyasi

- [ ] Materiallar katalogi
- [ ] Kirim qayd etish
- [ ] Chiqim (buyurtmaga bog'liq)
- [ ] Qoldiq ko'rish (TWA)
- [ ] Low-stock alert (avtomatik)
- [ ] Inventar hisoboti

**Deliverables:**
```
✅ Operator kirim/chiqim qayd etadi
✅ Worker qoldiqni ko'radi
✅ Kam qolsa — avtomatik ogohlantirish
```

---

### 🟢 FAZA 5 — GiblabMerger Moduli (1 hafta)

**Maqsad:** GiblabMerger integratsiyasi

- [ ] Fayl yuklash (drag & drop)
- [ ] MinIO saqlash
- [ ] XML birlashtirish logic (eski repositoriyadan ko'chirish)
- [ ] Buyurtmaga fayl bog'lash
- [ ] Yuklab olish
- [ ] TWA: fayllar ro'yxati va yuklash

**Deliverables:**
```
✅ Operator fayllarni yuklaydi va birlashtiradi
✅ Worker tayyor faylni yuklab oladi
```

---

### 🔴 FAZA 6 — Polish va Tayyorlash (1 hafta)

- [ ] Dashboard statistikasi (Chart.js grafiklari)
- [ ] Global bildirishnomalar (Socket.io)
- [ ] PWA sifatida admin panel
- [ ] Xatoliklarni kuzatish (Sentry)
- [ ] Rate limiting mustahkamlash
- [ ] Performance optimizatsiya
- [ ] Foydalanuvchi qo'llanmasi

---

### Umumiy Jadval

```
Hafta 1-3:   Faza 1 (Poydevor)
Hafta 4-5:   Faza 2 (IshHaqi)
Hafta 6-7:   Faza 3 (Buyurtmalar)
Hafta 8-9:   Faza 4 (LDSP)
Hafta 10:    Faza 5 (Merger)
Hafta 11:    Faza 6 (Yakunlash)
──────────────────────────────
JAMI: ~11 hafta (solo developer)
      ~6-7 hafta (2 developer)
```

---

## 12. Deployment Rejasi

### Infratuzilma

```
VPS (minimal):
  CPU: 4 core
  RAM: 8 GB
  Storage: 100 GB SSD
  OS: Ubuntu 22.04 LTS

Domain: yourdomain.uz
SSL: Let's Encrypt (Certbot)
```

### Docker Compose Tuzilishi

```yaml
version: '3.8'
services:
  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
    
  backend:
    build: ./packages/backend
    environment:
      DATABASE_URL: postgresql://...
      REDIS_URL: redis://redis:6379
      BOT_TOKEN: ${BOT_TOKEN}
      JWT_SECRET: ${JWT_SECRET}
    
  admin-ui:
    build: ./packages/admin
    # Static files, nginx serve qiladi
    
  twa:
    build: ./packages/twa
    # Static files, nginx serve qiladi
    
  postgres:
    image: postgres:16
    volumes: [postgres_data:/var/lib/postgresql/data]
    
  redis:
    image: redis:7-alpine
    
  minio:
    image: minio/minio
    ports: ["9000:9000", "9001:9001"]
    volumes: [minio_data:/data]
```

### Muhit o'zgaruvchilari (`.env`)

```env
# Database
DATABASE_URL=postgresql://user:pass@postgres:5432/central_hub

# Redis
REDIS_URL=redis://redis:6379

# Telegram
BOT_TOKEN=your_bot_token_here
WEBHOOK_URL=https://api.yourdomain.uz/webhook
TWA_URL=https://twa.yourdomain.uz

# JWT
JWT_SECRET=your_very_secret_key
JWT_EXPIRES_IN=7d

# MinIO
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=your_access_key
MINIO_SECRET_KEY=your_secret_key
MINIO_BUCKET=central-hub-files

# App
NODE_ENV=production
API_PORT=3001
```

### nginx Konfiguratsiyasi

```nginx
# API Backend
server {
  server_name api.yourdomain.uz;
  location / { proxy_pass http://backend:3001; }
}

# Admin Panel
server {
  server_name admin.yourdomain.uz;
  root /usr/share/nginx/admin;
  try_files $uri /index.html;
}

# Telegram Web App
server {
  server_name twa.yourdomain.uz;
  root /usr/share/nginx/twa;
  try_files $uri /index.html;
}
```

---

## 13. Xavfsizlik

### Autentifikatsiya

```
1. Telegram initData → server tekshiradi → JWT beradi
2. JWT → har bir API so'rovida Authorization: Bearer <token>
3. Token muddati: 7 kun, refresh token: 30 kun
4. Admin panel uchun qo'shimcha PIN (ixtiyoriy)
```

### API Himoyasi

```
• Rate limiting: 100 req/min (umumiy), 10 req/min (auth)
• CORS: faqat ruxsat etilgan domainlar
• Input validation: Zod schema validation
• SQL Injection: Prisma ORM (prepared statements)
• File upload: mime-type tekshirish, hajm cheklash (20MB)
• Helmet.js: HTTP header xavfsizligi
```

### Ma'lumotlar Himoyasi

```
• Parollar: bcrypt (salt rounds: 12)
• Telefon raqamlar: shifrlangan saqlash
• Bank karta ma'lumotlari: faqat oxirgi 4 raqam saqlash
• Logs: shaxsiy ma'lumotlar loglanmaydi
• Backup: har kecha avtomatik PostgreSQL dump → MinIO
```

---

## 📎 Qo'shimcha Eslatmalar

### Monorepo Tuzilishi (tavsiya etiladi)

```
aka-central-hub/
├── packages/
│   ├── backend/          # Express.js API
│   ├── admin/            # React Admin Panel
│   ├── twa/              # React Telegram Web App
│   └── shared/           # Umumiy types, constants
├── docker-compose.yml
├── docker-compose.dev.yml
├── .env.example
├── .github/
│   └── workflows/
│       └── deploy.yml    # CI/CD
└── README.md
```

### Mavjud Repolarni Integratsiya Qilish Strategiyasi

```
VARIANT A (Submodule):
  git submodule add git@github.com:aka-FinGo/ish-haqi-bot.git packages/legacy/ish-haqi-bot
  → Eski mantiq/algoritmlarni olib, qayta yozish

VARIANT B (Copy & Refactor):  ← TAVSIYA
  Har bir repositoriyadan asosiy biznes logikani olib,
  yangi monorepo ichida modul sifatida qayta yozish.
  → Toza arxitektura, bitta codebase
```

### Keyingi Qadam

```
1. Monorepo yaratish va asosiy tuzilmani sozlash
2. Repositoriyalarni o'rganib, existing logikani tushunish
3. Faza 1 boshlash (Backend + Auth)
4. Har bir faza yakuni — staging serverda test
```

---

*Ushbu loyiha rejasi `aka-FinGo` uchun tayyorlangan va to'liq o'zgartirishlar qilish huquqi loyiha egasiga tegishli.*

*So'nggi yangilanish: 2026-06*
