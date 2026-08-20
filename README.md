# ReBites 🍱

> **Give Surplus Food a Second Bite.**

ReBites is a web-based marketplace designed to connect **culinary UMKM** with consumers through the sale of surplus food that is still suitable for consumption.

The project was developed as a competition project for **Web Dev OSCAR 3.0 2026** by **Team Sixquit**.

ReBites aims to address food waste by giving surplus food a second opportunity to be consumed while helping UMKM generate additional revenue and giving consumers access to more affordable food.

---

## 🎯 Problem

Food waste remains a significant problem in Indonesia. A large amount of food is wasted throughout the food supply chain, including food from culinary businesses that remains unsold at the end of their operating hours.

At the same time:

* UMKM may lose potential revenue from unsold food.
* Consumers may have difficulty finding affordable surplus food.
* There is limited integration between surplus food management, product availability, ordering, and payment.
* Food that is still suitable for consumption can end up becoming waste.

ReBites was created as a digital solution to connect these two sides.

---

## 💡 Solution

ReBites provides a dedicated marketplace where UMKM can list and sell surplus food within a specified selling period.

Consumers can discover available surplus food, place orders, choose their preferred fulfillment method, and complete payments through the platform.

The system is designed around two main users:

* **UMKM**
* **Buyer**

---

## ✨ Features

### 🛒 Buyer

* User registration and authentication
* Browse and search surplus food
* View product details
* Manage purchase quantities
* Add order notes
* Manage delivery addresses
* Choose delivery or pickup
* Online payment
* View order and transaction history

### 🏪 UMKM

* UMKM registration and authentication
* Manage business profile
* Subscription management
* One-month free trial for new UMKM users
* Add, edit, and delete products
* Manage product stock
* Manage product availability
* Set selling start and end times
* Manage incoming orders
* Update order status
* View sales history

---

## 🧠 How ReBites Works

```text
                    ┌───────────────┐
                    │     Buyer     │
                    └───────┬───────┘
                            │
                     Browse & Order
                            │
                            ▼
┌───────────────┐     ┌───────────────┐
│     UMKM      │────▶│    ReBites    │
│    Seller     │     │   Marketplace │
└───────────────┘     └───────┬───────┘
                              │
                         Payment
                              │
                              ▼
                       ┌─────────────┐
                       │   Midtrans  │
                       └─────────────┘
```

### UMKM Flow

```text
Register
   ↓
Login
   ↓
Trial / Subscription
   ↓
Complete Business Profile
   ↓
Add Surplus Food
   ↓
Set Price, Stock & Selling Period
   ↓
Receive Orders
   ↓
Process Orders
   ↓
Update Order Status
```

### Buyer Flow

```text
Register
   ↓
Login
   ↓
Find Surplus Food
   ↓
View Product
   ↓
Choose Quantity
   ↓
Choose Address
   ↓
Choose Delivery / Pickup
   ↓
Payment
   ↓
Track Order
```

---

## 🛠️ Tech Stack

| Category           | Technology     |
| ------------------ | -------------- |
| Frontend           | Next.js        |
| Language           | TypeScript     |
| Backend & Database | Supabase       |
| CSS Framework      | Tailwind CSS   |
| Payment Gateway    | Midtrans       |
| Hosting            | Vercel         |
| Authentication     | JWT            |
| Dashboard / Charts | Recharts       |
| UI Components      | shadcn/ui      |
| Icons              | Lucide React   |
| Utility            | Tailwind Merge |
| Maps               | Leaflet        |

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────┐
│                 CLIENT                  │
│            Next.js + React              │
│          TypeScript + Tailwind          │
└───────────────────┬─────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│              APPLICATION                │
│           Next.js Application           │
│                                         │
│  Authentication │ Business Logic │ API │
└───────────┬─────────────────┬───────────┘
            │                 │
            ▼                 ▼
┌───────────────────┐   ┌────────────────┐
│     Supabase      │   │    Midtrans    │
│                   │   │                │
│ Database          │   │ Payment        │
│ Authentication    │   │ Processing     │
└───────────────────┘   └────────────────┘
```

---

## 👥 User Roles

### UMKM

Responsible for managing their business profile, surplus food products, stock, selling periods, orders, and subscription.

### Buyer

Uses the platform to discover and purchase surplus food at more affordable prices.

---

## 🌱 Impact

ReBites is designed to create value across three areas:

### Environmental

Helps reduce food waste by providing a marketplace for surplus food that is still suitable for consumption.

### Economic

Provides UMKM with an opportunity to generate additional revenue from food that might otherwise remain unsold.

### Social

Provides consumers with access to affordable food while encouraging more efficient food utilization.

---

## 🔐 System Scope

ReBites currently focuses on:

* Surplus food from culinary UMKM
* Web-based marketplace functionality
* Three user roles: Admin, UMKM, and Buyer
* Product and stock management
* Ordering and payment
* Delivery or direct pickup

The platform does not cover food production, raw-material procurement, or independent logistics operations.

---

## 🚧 Limitations

* ReBites is currently available as a web application.
* No dedicated Android or iOS application is provided.
* UMKM must have an active subscription to sell products after the free trial period.
* Packaging and order handover remain the responsibility of the UMKM.
* ReBites does not operate its own logistics service.
* Midtrans transactions are currently handled in Indonesian Rupiah (IDR).

---

## 👨‍💻 Team Sixquit

Developed for **Web Dev OSCAR 3.0 2026**.

| Name                         | Role        |
| ---------------------------- | ----------- |
| Abdurrahman Kaysan           | Team Member |
| Arga Zanuar Putra Fajar      | Team Member |
| Faletehan Al Farabi          | Team Member |
| Wildan Daffi Altair Darmawan | Team Member |

**School:** SMK Taruna Bhakti
**Team:** Sixquit
**Competition:** Web Dev OSCAR 3.0 — 2026

---

## 📌 Project Goals

ReBites aims to:

1. Reduce food waste through surplus food redistribution.
2. Help culinary UMKM generate additional revenue.
3. Make surplus food easier for consumers to discover and purchase.
4. Provide an integrated platform for product management, ordering, and payment.
5. Encourage more sustainable food consumption.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm / pnpm / yarn
* Git

You will also need a configured Supabase project and Midtrans credentials.

### Installation

Clone the repository:

```bash
git clone <YOUR_REPOSITORY_URL>
cd rebites
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env.local
```

Configure the required environment variables in `.env.local`.

Then start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🔑 Environment Variables

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
```

> Never commit your actual API keys, secret keys, or credentials to GitHub.

---

## 🧪 Testing

ReBites uses **Black Box Testing** to verify that system functionality works according to its expected inputs and outputs.

Testing covers the major functionality of:

* Authentication
* User profiles
* UMKM subscriptions
* Product management
* Stock management
* Selling periods
* Ordering
* Payment
* Order management
* Transaction history
* Admin monitoring

---

## 📖 Project Documentation

The complete project proposal contains the system background, requirements analysis, development methodology, system design, features, technology stack, and system limitations.

---

## 🌍 Vision

> **Turning surplus into value.**

ReBites envisions a future where food that is still valuable does not become waste simply because it was not sold at the right time.

By connecting UMKM and consumers through technology, ReBites aims to make surplus food more accessible, affordable, and useful.

---

## 📄 License

This project was developed for **Web Dev OSCAR 3.0 2026** as a competition project by Team Sixquit.

All rights reserved unless otherwise stated.
