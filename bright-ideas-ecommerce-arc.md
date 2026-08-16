# Bright Ideas E-Commerce Platform — Full Architecture Document

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Database Schema (Prisma)](#4-database-schema-prisma)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [API Architecture (NestJS)](#6-api-architecture-nestjs)
7. [Frontend Architecture (Next.js)](#7-frontend-architecture-nextjs)
8. [Payment Integration](#8-payment-integration)
9. [Digital File Delivery](#9-digital-file-delivery)
10. [Admin Dashboard](#10-admin-dashboard)
11. [Customer Dashboard](#11-customer-dashboard)
12. [Analytics & Tracking](#12-analytics--tracking)
13. [SEO Strategy](#13-seo-strategy)
14. [Seed Data](#14-seed-data)
15. [Environment Variables](#15-environment-variables)
16. [Deployment](#16-deployment)
17. [Testing Strategy](#17-testing-strategy)
18. [Security Checklist](#18-security-checklist)

---

## 1. Project Overview

**Platform Name:** Bright Ideas Digital Store
**Purpose:** Sell eBooks, Excel templates, business systems, and digital products to Ethiopian customers.
**Design Reference:** Amazon-style storefront with category navigation, product grids, reviews, wishlists, and a streamlined checkout flow.

### Core User Roles

| Role       | Description                                                      |
| ---------- | ---------------------------------------------------------------- |
| CUSTOMER   | Browse, purchase, download digital products, manage account      |
| ADMIN      | Full platform management: products, orders, customers, analytics |
| SUPER_ADMIN| System configuration, payment settings, admin user management    |

### Key Business Flows

1. Customer browses products by category or search
2. Customer adds products to cart
3. Customer checks out via Chapa (Ethiopian payment gateway)
4. System verifies payment via webhook
5. System generates secure, expiring download links
6. Customer accesses downloads from their dashboard
7. Admin monitors sales, manages products, processes refunds

---

## 2. Tech Stack

### Frontend (Client)

| Layer          | Technology                          |
| -------------- | ----------------------------------- |
| Framework      | Next.js 15 (App Router)             |
| Language       | TypeScript (strict mode)            |
| Styling        | Tailwind CSS 3.4 + shadcn/ui        |
| Forms          | React Hook Form + Zod validation    |
| State          | Zustand (cart, UI state)            |
| Data Fetching  | TanStack Query v5                   |
| Icons          | Lucide React                        |
| Toasts         | Sonner                              |
| Date Handling  | date-fns                            |

### Backend (API)

| Layer          | Technology                          |
| -------------- | ----------------------------------- |
| Framework      | NestJS 10                           |
| Language       | TypeScript (strict mode)            |
| ORM            | Prisma 5                            |
| Database       | PostgreSQL 16                       |
| Validation     | Zod + @anatine/zod-nestjs           |
| Auth           | Passport.js + JWT + Refresh Tokens  |
| File Storage   | Local disk (dev) / S3-compatible (prod) |
| Queue          | BullMQ + Redis (email, webhooks)    |
| Email          | Nodemailer + React Email templates  |
| Docs           | Swagger / OpenAPI via @nestjs/swagger|

### Infrastructure

| Layer          | Technology                          |
| -------------- | ----------------------------------- |
| Containerization | Docker + Docker Compose           |
| Reverse Proxy  | Nginx                               |
| CI/CD          | GitHub Actions                      |
| Hosting        | VPS (Ubuntu) or Vercel (frontend) + Railway (backend) |

---

## 3. Project Structure

```
bright-ideas/
├── apps/
│   ├── web/                          # Next.js 15 App Router
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (storefront)/     # Public store pages
│   │   │   │   │   ├── page.tsx                  # Homepage
│   │   │   │   │   ├── products/
│   │   │   │   │   │   ├── page.tsx              # Product listing
│   │   │   │   │   │   └── [slug]/page.tsx       # Product detail
│   │   │   │   │   ├── categories/
│   │   │   │   │   │   └── [slug]/page.tsx       # Category listing
│   │   │   │   │   ├── cart/page.tsx             # Cart
│   │   │   │   │   ├── checkout/page.tsx         # Checkout
│   │   │   │   │   ├── search/page.tsx           # Search results
│   │   │   │   │   └── layout.tsx                # Store layout
│   │   │   │   ├── (auth)/
│   │   │   │   │   ├── login/page.tsx
│   │   │   │   │   ├── register/page.tsx
│   │   │   │   │   ├── forgot-password/page.tsx
│   │   │   │   │   └── reset-password/page.tsx
│   │   │   │   ├── (customer)/                   # Protected customer area
│   │   │   │   │   ├── dashboard/page.tsx
│   │   │   │   │   ├── orders/page.tsx
│   │   │   │   │   ├── orders/[id]/page.tsx
│   │   │   │   │   ├── downloads/page.tsx
│   │   │   │   │   ├── wishlist/page.tsx
│   │   │   │   │   ├── profile/page.tsx
│   │   │   │   │   └── layout.tsx
│   │   │   │   ├── admin/                        # Admin dashboard
│   │   │   │   │   ├── page.tsx                  # Admin overview
│   │   │   │   │   ├── products/
│   │   │   │   │   │   ├── page.tsx              # Product list
│   │   │   │   │   │   ├── new/page.tsx          # Create product
│   │   │   │   │   │   └── [id]/edit/page.tsx    # Edit product
│   │   │   │   │   ├── categories/page.tsx
│   │   │   │   │   ├── orders/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── [id]/page.tsx
│   │   │   │   │   ├── customers/page.tsx
│   │   │   │   │   ├── coupons/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── new/page.tsx
│   │   │   │   │   ├── analytics/page.tsx
│   │   │   │   │   ├── settings/page.tsx
│   │   │   │   │   └── layout.tsx                # Admin sidebar layout
│   │   │   │   ├── api/
│   │   │   │   │   └── webhooks/
│   │   │   │   │       └── chapa/route.ts        # Chapa webhook handler
│   │   │   │   ├── layout.tsx                    # Root layout
│   │   │   │   └── not-found.tsx
│   │   │   ├── components/
│   │   │   │   ├── ui/                           # shadcn/ui primitives
│   │   │   │   ├── storefront/
│   │   │   │   │   ├── header.tsx
│   │   │   │   │   ├── footer.tsx
│   │   │   │   │   ├── hero-banner.tsx
│   │   │   │   │   ├── product-card.tsx
│   │   │   │   │   ├── product-grid.tsx
│   │   │   │   │   ├── product-detail.tsx
│   │   │   │   │   ├── category-sidebar.tsx
│   │   │   │   │   ├── search-bar.tsx
│   │   │   │   │   ├── cart-sheet.tsx
│   │   │   │   │   ├── cart-item.tsx
│   │   │   │   │   ├── checkout-form.tsx
│   │   │   │   │   ├── price-display.tsx
│   │   │   │   │   ├── rating-stars.tsx
│   │   │   │   │   ├── review-card.tsx
│   │   │   │   │   ├── review-form.tsx
│   │   │   │   │   ├── breadcrumb-nav.tsx
│   │   │   │   │   ├── promo-banner.tsx
│   │   │   │   │   └── newsletter-signup.tsx
│   │   │   │   ├── customer/
│   │   │   │   │   ├── order-card.tsx
│   │   │   │   │   ├── download-card.tsx
│   │   │   │   │   ├── profile-form.tsx
│   │   │   │   │   └── sidebar-nav.tsx
│   │   │   │   ├── admin/
│   │   │   │   │   ├── admin-sidebar.tsx
│   │   │   │   │   ├── stats-card.tsx
│   │   │   │   │   ├── revenue-chart.tsx
│   │   │   │   │   ├── recent-orders-table.tsx
│   │   │   │   │   ├── product-form.tsx
│   │   │   │   │   ├── category-form.tsx
│   │   │   │   │   ├── coupon-form.tsx
│   │   │   │   │   ├── order-detail-view.tsx
│   │   │   │   │   ├── customer-table.tsx
│   │   │   │   │   ├── data-table.tsx
│   │   │   │   │   └── image-upload.tsx
│   │   │   │   └── shared/
│   │   │   │       ├── loading-skeleton.tsx
│   │   │   │       ├── empty-state.tsx
│   │   │   │       ├── confirm-dialog.tsx
│   │   │   │       ├── pagination.tsx
│   │   │   │       └── error-boundary.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── use-cart.ts
│   │   │   │   ├── use-auth.ts
│   │   │   │   ├── use-wishlist.ts
│   │   │   │   ├── use-debounce.ts
│   │   │   │   └── use-media-query.ts
│   │   │   ├── lib/
│   │   │   │   ├── api-client.ts                 # Axios instance with interceptors
│   │   │   │   ├── utils.ts                      # cn() and helpers
│   │   │   │   ├── constants.ts
│   │   │   │   ├── format.ts                     # Currency, date formatting
│   │   │   │   └── validators.ts                 # Shared Zod schemas
│   │   │   ├── stores/
│   │   │   │   ├── cart-store.ts
│   │   │   │   ├── auth-store.ts
│   │   │   │   └── ui-store.ts
│   │   │   ├── types/
│   │   │   │   ├── product.ts
│   │   │   │   ├── order.ts
│   │   │   │   ├── user.ts
│   │   │   │   ├── category.ts
│   │   │   │   ├── coupon.ts
│   │   │   │   └── api.ts
│   │   │   └── providers/
│   │   │       ├── query-provider.tsx
│   │   │       ├── auth-provider.tsx
│   │   │       └── theme-provider.tsx
│   │   ├── public/
│   │   │   ├── images/
│   │   │   ├── icons/
│   │   │   └── og/
│   │   ├── tailwind.config.ts
│   │   ├── next.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── api/                          # NestJS Backend
│       ├── src/
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   ├── common/
│       │   │   ├── decorators/
│       │   │   │   ├── current-user.decorator.ts
│       │   │   │   ├── roles.decorator.ts
│       │   │   │   └── public.decorator.ts
│       │   │   ├── guards/
│       │   │   │   ├── jwt-auth.guard.ts
│       │   │   │   ├── roles.guard.ts
│       │   │   │   └── throttle.guard.ts
│       │   │   ├── interceptors/
│       │   │   │   ├── transform.interceptor.ts
│       │   │   │   └── logging.interceptor.ts
│       │   │   ├── filters/
│       │   │   │   └── http-exception.filter.ts
│       │   │   ├── pipes/
│       │   │   │   └── zod-validation.pipe.ts
│       │   │   └── dto/
│       │   │       ├── pagination.dto.ts
│       │   │       └── api-response.dto.ts
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   │   ├── auth.module.ts
│       │   │   │   ├── auth.controller.ts
│       │   │   │   ├── auth.service.ts
│       │   │   │   ├── strategies/
│       │   │   │   │   ├── jwt.strategy.ts
│       │   │   │   │   ├── jwt-refresh.strategy.ts
│       │   │   │   │   └── local.strategy.ts
│       │   │   │   └── dto/
│       │   │   │       ├── register.dto.ts
│       │   │   │       ├── login.dto.ts
│       │   │   │       └── reset-password.dto.ts
│       │   │   ├── users/
│       │   │   │   ├── users.module.ts
│       │   │   │   ├── users.controller.ts
│       │   │   │   ├── users.service.ts
│       │   │   │   └── dto/
│       │   │   │       ├── create-user.dto.ts
│       │   │   │       └── update-user.dto.ts
│       │   │   ├── products/
│       │   │   │   ├── products.module.ts
│       │   │   │   ├── products.controller.ts
│       │   │   │   ├── products.service.ts
│       │   │   │   └── dto/
│       │   │   │       ├── create-product.dto.ts
│       │   │   │       ├── update-product.dto.ts
│       │   │   │       └── product-query.dto.ts
│       │   │   ├── categories/
│       │   │   │   ├── categories.module.ts
│       │   │   │   ├── categories.controller.ts
│       │   │   │   ├── categories.service.ts
│       │   │   │   └── dto/
│       │   │   │       ├── create-category.dto.ts
│       │   │   │       └── update-category.dto.ts
│       │   │   ├── orders/
│       │   │   │   ├── orders.module.ts
│       │   │   │   ├── orders.controller.ts
│       │   │   │   ├── orders.service.ts
│       │   │   │   └── dto/
│       │   │   │       ├── create-order.dto.ts
│       │   │   │       └── order-query.dto.ts
│       │   │   ├── payments/
│       │   │   │   ├── payments.module.ts
│       │   │   │   ├── payments.controller.ts
│       │   │   │   ├── payments.service.ts
│       │   │   │   ├── chapa.service.ts
│       │   │   │   └── dto/
│       │   │   │       └── initialize-payment.dto.ts
│       │   │   ├── downloads/
│       │   │   │   ├── downloads.module.ts
│       │   │   │   ├── downloads.controller.ts
│       │   │   │   └── downloads.service.ts
│       │   │   ├── coupons/
│       │   │   │   ├── coupons.module.ts
│       │   │   │   ├── coupons.controller.ts
│       │   │   │   ├── coupons.service.ts
│       │   │   │   └── dto/
│       │   │   │       ├── create-coupon.dto.ts
│       │   │   │       └── validate-coupon.dto.ts
│       │   │   ├── reviews/
│       │   │   │   ├── reviews.module.ts
│       │   │   │   ├── reviews.controller.ts
│       │   │   │   ├── reviews.service.ts
│       │   │   │   └── dto/
│       │   │   │       └── create-review.dto.ts
│       │   │   ├── wishlist/
│       │   │   │   ├── wishlist.module.ts
│       │   │   │   ├── wishlist.controller.ts
│       │   │   │   └── wishlist.service.ts
│       │   │   ├── analytics/
│       │   │   │   ├── analytics.module.ts
│       │   │   │   ├── analytics.controller.ts
│       │   │   │   └── analytics.service.ts
│       │   │   ├── files/
│       │   │   │   ├── files.module.ts
│       │   │   │   ├── files.controller.ts
│       │   │   │   └── files.service.ts
│       │   │   ├── email/
│       │   │   │   ├── email.module.ts
│       │   │   │   ├── email.service.ts
│       │   │   │   └── templates/
│       │   │   │       ├── welcome.tsx
│       │   │   │       ├── order-confirmation.tsx
│       │   │   │       ├── download-ready.tsx
│       │   │   │       └── password-reset.tsx
│       │   │   └── admin/
│       │   │       ├── admin.module.ts
│       │   │       ├── admin.controller.ts
│       │   │       └── admin.service.ts
│       │   └── prisma/
│       │       ├── prisma.module.ts
│       │       └── prisma.service.ts
│       ├── prisma/
│       │   ├── schema.prisma
│       │   ├── seed.ts
│       │   └── migrations/
│       ├── uploads/                   # Local file storage (dev only)
│       ├── tsconfig.json
│       ├── nest-cli.json
│       └── package.json
│
├── packages/
│   └── shared/                       # Shared types and Zod schemas
│       ├── src/
│       │   ├── schemas/
│       │   │   ├── product.schema.ts
│       │   │   ├── order.schema.ts
│       │   │   ├── user.schema.ts
│       │   │   ├── coupon.schema.ts
│       │   │   ├── review.schema.ts
│       │   │   └── common.schema.ts
│       │   ├── types/
│       │   │   └── index.ts
│       │   └── index.ts
│       ├── tsconfig.json
│       └── package.json
│
├── docker-compose.yml
├── docker-compose.prod.yml
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── .env.example
├── turbo.json                        # Turborepo config
├── package.json                      # Root workspace
└── README.md
```

---

## 4. Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================
// ENUMS
// ============================================================

enum UserRole {
  CUSTOMER
  ADMIN
  SUPER_ADMIN
}

enum OrderStatus {
  PENDING
  PAYMENT_INITIATED
  PAID
  FAILED
  REFUNDED
  CANCELLED
}

enum PaymentProvider {
  CHAPA
  TELEBIRR
  BANK_TRANSFER
}

enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
  REFUNDED
}

enum ProductStatus {
  DRAFT
  ACTIVE
  ARCHIVED
}

enum ProductType {
  EBOOK
  EXCEL_TEMPLATE
  BUSINESS_SYSTEM
  COURSE
  OTHER
}

enum DiscountType {
  PERCENTAGE
  FIXED_AMOUNT
}

enum CouponStatus {
  ACTIVE
  EXPIRED
  DISABLED
}

enum FileStorageType {
  LOCAL
  S3
}

// ============================================================
// USERS
// ============================================================

model User {
  id              String    @id @default(cuid())
  email           String    @unique
  phone           String?   @unique
  passwordHash    String    @map("password_hash")
  firstName       String    @map("first_name")
  lastName        String    @map("last_name")
  role            UserRole  @default(CUSTOMER)
  avatarUrl       String?   @map("avatar_url")
  isEmailVerified Boolean   @default(false) @map("is_email_verified")
  isActive        Boolean   @default(true) @map("is_active")
  lastLoginAt     DateTime? @map("last_login_at")
  refreshToken    String?   @map("refresh_token")

  orders       Order[]
  reviews      Review[]
  wishlist     WishlistItem[]
  downloads    DownloadLog[]
  addresses    Address[]
  cartItems    CartItem[]
  couponUsages CouponUsage[]

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("users")
}

model Address {
  id         String  @id @default(cuid())
  userId     String  @map("user_id")
  label      String  @default("Home") // Home, Office
  city       String
  subCity    String? @map("sub_city")
  woreda     String?
  phone      String?
  isDefault  Boolean @default(false) @map("is_default")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("addresses")
}

// ============================================================
// PRODUCTS
// ============================================================

model Category {
  id          String  @id @default(cuid())
  name        String  @unique
  slug        String  @unique
  description String?
  imageUrl    String? @map("image_url")
  parentId    String? @map("parent_id")
  sortOrder   Int     @default(0) @map("sort_order")
  isActive    Boolean @default(true) @map("is_active")

  parent   Category?  @relation("CategoryTree", fields: [parentId], references: [id])
  children Category[] @relation("CategoryTree")
  products ProductCategory[]

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("categories")
}

model Product {
  id              String        @id @default(cuid())
  name            String
  slug            String        @unique
  description     String
  shortDescription String?     @map("short_description")
  price           Decimal       @db.Decimal(10, 2)
  compareAtPrice  Decimal?      @db.Decimal(10, 2) @map("compare_at_price")
  currency        String        @default("ETB")
  type            ProductType
  status          ProductStatus @default(DRAFT)
  isFeatured      Boolean       @default(false) @map("is_featured")
  metaTitle       String?       @map("meta_title")
  metaDescription String?       @map("meta_description")
  tags            String[]      @default([])

  // Aggregated fields (denormalized for performance)
  averageRating   Float         @default(0) @map("average_rating")
  totalReviews    Int           @default(0) @map("total_reviews")
  totalSales      Int           @default(0) @map("total_sales")

  categories  ProductCategory[]
  images      ProductImage[]
  files       ProductFile[]
  reviews     Review[]
  orderItems  OrderItem[]
  wishlist    WishlistItem[]
  cartItems   CartItem[]

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([status, isFeatured])
  @@index([type])
  @@index([slug])
  @@map("products")
}

model ProductCategory {
  productId  String @map("product_id")
  categoryId String @map("category_id")

  product  Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  category Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@id([productId, categoryId])
  @@map("product_categories")
}

model ProductImage {
  id        String  @id @default(cuid())
  productId String  @map("product_id")
  url       String
  altText   String? @map("alt_text")
  sortOrder Int     @default(0) @map("sort_order")
  isPrimary Boolean @default(false) @map("is_primary")

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now()) @map("created_at")

  @@map("product_images")
}

model ProductFile {
  id           String          @id @default(cuid())
  productId    String          @map("product_id")
  fileName     String          @map("file_name")
  fileSize     Int             @map("file_size") // bytes
  mimeType     String          @map("mime_type")
  storagePath  String          @map("storage_path")
  storageType  FileStorageType @default(LOCAL) @map("storage_type")
  version      String          @default("1.0")
  isActive     Boolean         @default(true) @map("is_active")

  product   Product       @relation(fields: [productId], references: [id], onDelete: Cascade)
  downloads DownloadLog[]

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("product_files")
}

// ============================================================
// ORDERS & PAYMENTS
// ============================================================

model Order {
  id            String      @id @default(cuid())
  orderNumber   String      @unique @map("order_number") // BRI-20260815-XXXX
  userId        String      @map("user_id")
  status        OrderStatus @default(PENDING)
  subtotal      Decimal     @db.Decimal(10, 2)
  discountAmount Decimal    @default(0) @db.Decimal(10, 2) @map("discount_amount")
  total         Decimal     @db.Decimal(10, 2)
  currency      String      @default("ETB")
  couponId      String?     @map("coupon_id")
  customerEmail String      @map("customer_email")
  customerName  String      @map("customer_name")
  notes         String?

  user     User        @relation(fields: [userId], references: [id])
  coupon   Coupon?     @relation(fields: [couponId], references: [id])
  items    OrderItem[]
  payment  Payment?

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([userId])
  @@index([status])
  @@index([orderNumber])
  @@map("orders")
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String  @map("order_id")
  productId String  @map("product_id")
  price     Decimal @db.Decimal(10, 2)
  quantity  Int     @default(1)

  order   Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id])

  @@map("order_items")
}

model Payment {
  id              String          @id @default(cuid())
  orderId         String          @unique @map("order_id")
  provider        PaymentProvider
  status          PaymentStatus   @default(PENDING)
  amount          Decimal         @db.Decimal(10, 2)
  currency        String          @default("ETB")
  transactionRef  String          @unique @map("transaction_ref")
  providerRef     String?         @map("provider_ref") // Chapa tx_ref
  checkoutUrl     String?         @map("checkout_url")
  metadata        Json?
  paidAt          DateTime?       @map("paid_at")

  order Order @relation(fields: [orderId], references: [id])

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([transactionRef])
  @@map("payments")
}

// ============================================================
// DOWNLOADS
// ============================================================

model DownloadLog {
  id          String @id @default(cuid())
  userId      String @map("user_id")
  fileId      String @map("file_id")
  ipAddress   String @map("ip_address")
  userAgent   String @map("user_agent")

  user User        @relation(fields: [userId], references: [id])
  file ProductFile @relation(fields: [fileId], references: [id])

  downloadedAt DateTime @default(now()) @map("downloaded_at")

  @@map("download_logs")
}

model DownloadToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String   @map("user_id")
  fileId    String   @map("file_id")
  orderId   String   @map("order_id")
  expiresAt DateTime @map("expires_at")
  usedAt    DateTime? @map("used_at")
  maxUses   Int      @default(5) @map("max_uses")
  useCount  Int      @default(0) @map("use_count")

  createdAt DateTime @default(now()) @map("created_at")

  @@index([token])
  @@map("download_tokens")
}

// ============================================================
// CART
// ============================================================

model CartItem {
  id        String @id @default(cuid())
  userId    String @map("user_id")
  productId String @map("product_id")
  quantity  Int    @default(1)

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@unique([userId, productId])
  @@map("cart_items")
}

// ============================================================
// COUPONS & PROMOTIONS
// ============================================================

model Coupon {
  id              String       @id @default(cuid())
  code            String       @unique
  description     String?
  discountType    DiscountType @map("discount_type")
  discountValue   Decimal      @db.Decimal(10, 2) @map("discount_value")
  minOrderAmount  Decimal?     @db.Decimal(10, 2) @map("min_order_amount")
  maxDiscount     Decimal?     @db.Decimal(10, 2) @map("max_discount")
  maxUses         Int?         @map("max_uses")
  usedCount       Int          @default(0) @map("used_count")
  maxUsesPerUser  Int          @default(1) @map("max_uses_per_user")
  status          CouponStatus @default(ACTIVE)
  startsAt        DateTime     @map("starts_at")
  expiresAt       DateTime     @map("expires_at")

  orders Order[]
  usages CouponUsage[]

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("coupons")
}

model CouponUsage {
  id       String @id @default(cuid())
  couponId String @map("coupon_id")
  userId   String @map("user_id")

  coupon Coupon @relation(fields: [couponId], references: [id])
  user   User   @relation(fields: [userId], references: [id])

  usedAt DateTime @default(now()) @map("used_at")

  @@unique([couponId, userId])
  @@map("coupon_usages")
}

// ============================================================
// REVIEWS
// ============================================================

model Review {
  id        String  @id @default(cuid())
  userId    String  @map("user_id")
  productId String  @map("product_id")
  rating    Int     // 1 to 5
  title     String?
  comment   String?
  isVisible Boolean @default(true) @map("is_visible")

  user    User    @relation(fields: [userId], references: [id])
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@unique([userId, productId])
  @@index([productId, isVisible])
  @@map("reviews")
}

// ============================================================
// WISHLIST
// ============================================================

model WishlistItem {
  id        String @id @default(cuid())
  userId    String @map("user_id")
  productId String @map("product_id")

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now()) @map("created_at")

  @@unique([userId, productId])
  @@map("wishlist_items")
}

// ============================================================
// SITE SETTINGS
// ============================================================

model SiteSetting {
  id    String @id @default(cuid())
  key   String @unique
  value String
  type  String @default("string") // string, number, boolean, json

  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("site_settings")
}

// ============================================================
// BANNERS / PROMOTIONS
// ============================================================

model Banner {
  id        String   @id @default(cuid())
  title     String
  subtitle  String?
  imageUrl  String   @map("image_url")
  linkUrl   String?  @map("link_url")
  sortOrder Int      @default(0) @map("sort_order")
  isActive  Boolean  @default(true) @map("is_active")
  startsAt  DateTime? @map("starts_at")
  endsAt    DateTime? @map("ends_at")

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("banners")
}
```

---

## 5. Authentication & Authorization

### Auth Flow

```
Registration:
  POST /api/auth/register
  → Validate with Zod → Hash password (bcrypt, 12 rounds)
  → Create user → Send verification email
  → Return { accessToken, refreshToken }

Login:
  POST /api/auth/login
  → Validate credentials → Generate JWT pair
  → Store hashed refreshToken in DB
  → Return { accessToken, refreshToken, user }

Token Refresh:
  POST /api/auth/refresh
  → Validate refreshToken → Rotate tokens
  → Return new { accessToken, refreshToken }

Password Reset:
  POST /api/auth/forgot-password → Send reset email with token
  POST /api/auth/reset-password  → Validate token, update password
```

### JWT Configuration

```typescript
// Access Token: short-lived
{
  sub: user.id,
  email: user.email,
  role: user.role,
  exp: 15 minutes
}

// Refresh Token: long-lived
{
  sub: user.id,
  tokenVersion: number,
  exp: 7 days
}
```

### Route Protection Matrix

| Route Pattern            | Auth Required | Roles Allowed         |
| ------------------------ | ------------- | --------------------- |
| `/api/auth/*`            | No            | Public                |
| `/api/products` (GET)    | No            | Public                |
| `/api/products` (POST)   | Yes           | ADMIN, SUPER_ADMIN    |
| `/api/orders`            | Yes           | CUSTOMER (own orders) |
| `/api/admin/*`           | Yes           | ADMIN, SUPER_ADMIN    |
| `/api/downloads/*`       | Yes           | CUSTOMER (own files)  |

### Zod Validation Examples

```typescript
// packages/shared/src/schemas/user.schema.ts
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  phone: z
    .string()
    .regex(/^\+251[0-9]{9}$/, 'Must be a valid Ethiopian phone number')
    .optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
```

---

## 6. API Architecture (NestJS)

### Endpoint Reference

#### Auth Module

```
POST   /api/auth/register           → Register new customer
POST   /api/auth/login              → Login, get tokens
POST   /api/auth/refresh            → Refresh access token
POST   /api/auth/logout             → Invalidate refresh token
POST   /api/auth/forgot-password    → Request password reset email
POST   /api/auth/reset-password     → Reset password with token
GET    /api/auth/verify-email/:token→ Verify email address
GET    /api/auth/me                 → Get current user profile
```

#### Products Module

```
GET    /api/products                → List products (paginated, filterable)
GET    /api/products/featured       → Featured products
GET    /api/products/bestsellers    → Best selling products
GET    /api/products/:slug          → Product detail by slug
POST   /api/products                → Create product [ADMIN]
PATCH  /api/products/:id            → Update product [ADMIN]
DELETE /api/products/:id            → Soft delete product [ADMIN]
POST   /api/products/:id/images     → Upload product images [ADMIN]
DELETE /api/products/:id/images/:imageId → Remove image [ADMIN]
POST   /api/products/:id/files      → Upload product file [ADMIN]
```

#### Categories Module

```
GET    /api/categories              → List all categories (tree structure)
GET    /api/categories/:slug        → Category detail with products
POST   /api/categories              → Create category [ADMIN]
PATCH  /api/categories/:id          → Update category [ADMIN]
DELETE /api/categories/:id          → Delete category [ADMIN]
```

#### Orders Module

```
GET    /api/orders                  → List user orders [AUTH]
GET    /api/orders/:id              → Order detail [AUTH, own order]
POST   /api/orders                  → Create order from cart [AUTH]
PATCH  /api/orders/:id/cancel       → Cancel pending order [AUTH]
```

#### Payments Module

```
POST   /api/payments/initialize     → Initialize Chapa payment
GET    /api/payments/verify/:txRef  → Verify payment status
POST   /api/payments/webhook/chapa  → Chapa webhook receiver
```

#### Cart Module

```
GET    /api/cart                    → Get user cart [AUTH]
POST   /api/cart/items              → Add item to cart [AUTH]
PATCH  /api/cart/items/:id          → Update cart item quantity [AUTH]
DELETE /api/cart/items/:id          → Remove cart item [AUTH]
DELETE /api/cart                    → Clear cart [AUTH]
```

#### Downloads Module

```
GET    /api/downloads               → List user's available downloads [AUTH]
POST   /api/downloads/generate-link → Generate secure download token [AUTH]
GET    /api/downloads/file/:token   → Download file with token [AUTH]
```

#### Reviews Module

```
GET    /api/reviews/product/:productId → List product reviews
POST   /api/reviews                    → Create review [AUTH, purchased only]
PATCH  /api/reviews/:id                → Update review [AUTH, own review]
DELETE /api/reviews/:id                → Delete review [AUTH/ADMIN]
```

#### Wishlist Module

```
GET    /api/wishlist                → List wishlist items [AUTH]
POST   /api/wishlist/:productId    → Add to wishlist [AUTH]
DELETE /api/wishlist/:productId    → Remove from wishlist [AUTH]
```

#### Coupons Module

```
POST   /api/coupons/validate        → Validate coupon code [AUTH]
GET    /api/coupons                  → List coupons [ADMIN]
POST   /api/coupons                  → Create coupon [ADMIN]
PATCH  /api/coupons/:id              → Update coupon [ADMIN]
DELETE /api/coupons/:id              → Disable coupon [ADMIN]
```

#### Admin Module

```
GET    /api/admin/dashboard          → Dashboard stats [ADMIN]
GET    /api/admin/orders             → All orders (paginated) [ADMIN]
PATCH  /api/admin/orders/:id/status  → Update order status [ADMIN]
GET    /api/admin/customers          → Customer list [ADMIN]
GET    /api/admin/customers/:id      → Customer detail [ADMIN]
GET    /api/admin/analytics/revenue  → Revenue analytics [ADMIN]
GET    /api/admin/analytics/products → Product analytics [ADMIN]
GET    /api/admin/analytics/export   → Export CSV report [ADMIN]
GET    /api/admin/settings           → Site settings [SUPER_ADMIN]
PATCH  /api/admin/settings           → Update settings [SUPER_ADMIN]
```

### Standard API Response Format

```typescript
// Success response
{
  success: true,
  data: T,
  meta?: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}

// Error response
{
  success: false,
  error: {
    code: string,         // e.g. "VALIDATION_ERROR"
    message: string,
    details?: unknown
  }
}
```

### Query Parameters for Listings

```
GET /api/products?page=1&limit=20&sort=price&order=asc&category=ebooks&type=EBOOK&minPrice=50&maxPrice=500&search=excel&status=ACTIVE
```

---

## 7. Frontend Architecture (Next.js)

### Page Layout Hierarchy

```
Root Layout (layout.tsx)
├── QueryProvider
├── AuthProvider
├── ThemeProvider
│
├── (storefront) Layout
│   ├── Header
│   │   ├── Logo
│   │   ├── Search Bar (full width, Amazon style)
│   │   ├── Category Dropdown
│   │   ├── Account Menu
│   │   ├── Wishlist Icon + Count
│   │   └── Cart Icon + Count + Sheet Trigger
│   ├── Category Navigation Bar (horizontal scrollable on mobile)
│   ├── Page Content
│   └── Footer
│       ├── About / Contact / FAQ links
│       ├── Social Media links
│       └── Copyright
│
├── (customer) Layout
│   ├── Header (same as storefront)
│   ├── Sidebar Navigation
│   │   ├── Dashboard
│   │   ├── My Orders
│   │   ├── My Downloads
│   │   ├── Wishlist
│   │   └── Profile Settings
│   └── Page Content
│
└── admin/ Layout
    ├── Admin Sidebar (collapsible)
    │   ├── Dashboard
    │   ├── Products
    │   ├── Categories
    │   ├── Orders
    │   ├── Customers
    │   ├── Coupons
    │   ├── Analytics
    │   └── Settings
    ├── Top Bar (admin name, notifications)
    └── Page Content
```

### Homepage Sections (Amazon Style)

```
1. Hero Banner Carousel (promotional banners, admin configurable)
2. "Today's Deals" (products with compareAtPrice set)
3. "Featured Products" grid (isFeatured = true)
4. Category Cards Row (visual category browsing)
5. "Best Sellers" grid (sorted by totalSales)
6. "New Arrivals" grid (sorted by createdAt desc)
7. "Top Rated" grid (sorted by averageRating desc)
8. Newsletter Signup Section
```

### Product Detail Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Breadcrumb: Home > Category > Product Name                 │
├──────────────────────┬──────────────────────────────────────┤
│                      │  Product Title                       │
│   Product Image      │  Rating Stars (4.5) · 128 reviews   │
│   Gallery            │  ──────────────────────────────      │
│   (thumbnails below) │  Price: ETB 450.00                   │
│                      │  Was:   ETB 650.00  (31% off)       │
│                      │  ──────────────────────────────      │
│                      │  ✓ Instant digital download          │
│                      │  ✓ Lifetime access                   │
│                      │  ✓ Free updates                      │
│                      │  ──────────────────────────────      │
│                      │  [Add to Cart]  [Buy Now]            │
│                      │  [♡ Add to Wishlist]                 │
│                      │  ──────────────────────────────      │
│                      │  File format: PDF / XLSX             │
│                      │  File size: 2.4 MB                   │
│                      │  Last updated: Aug 2026              │
├──────────────────────┴──────────────────────────────────────┤
│  Tabs: [Description] [Reviews (128)] [Related Products]     │
│  ─────────────────────────────────────────────────────────  │
│  Full product description with rich text...                 │
├─────────────────────────────────────────────────────────────┤
│  Customer Reviews                                           │
│  ┌─────────────────────────────────────────────┐            │
│  │ ★★★★★  "Great template!"  — Abebe M.       │            │
│  │ Verified Purchase · Aug 10, 2026            │            │
│  │ This saved me hours of work...              │            │
│  └─────────────────────────────────────────────┘            │
├─────────────────────────────────────────────────────────────┤
│  Related Products (grid of 4)                               │
└─────────────────────────────────────────────────────────────┘
```

### Cart and Checkout Flow

```
Cart (Side Sheet or Full Page)
├── Cart Items List
│   ├── Product Image + Name + Price
│   ├── Quantity Selector (for digital: always 1, no duplicates)
│   └── Remove Button
├── Coupon Code Input + Apply Button
├── Order Summary
│   ├── Subtotal
│   ├── Discount (if coupon applied)
│   └── Total
└── [Proceed to Checkout] Button

Checkout Page
├── Login/Register prompt (if guest)
├── Order Review
│   ├── Items summary
│   ├── Coupon display
│   └── Total
├── Payment Method Selection
│   ├── Chapa (Card, Mobile Money, Bank)
│   └── Telebirr (future)
└── [Pay ETB X.XX] Button → Redirects to Chapa hosted checkout

Post-Payment
├── Chapa redirects back to /checkout/success?tx_ref=XXX
├── System verifies payment via API
├── Shows order confirmation
└── [Go to My Downloads] button
```

### Key Component Specifications

```typescript
// Product Card Component Props
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    type: ProductType;
    averageRating: number;
    totalReviews: number;
    primaryImage: string;
    isFeatured: boolean;
  };
  showAddToCart?: boolean;
  showWishlist?: boolean;
}

// Data Table Component (Admin) — uses @tanstack/react-table
interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  searchKey?: string;
  filterableColumns?: FilterableColumn[];
  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState) => void;
}
```

### Zustand Cart Store

```typescript
// stores/cart-store.ts
interface CartState {
  items: CartItem[];
  couponCode: string | null;
  discount: number;
  isLoading: boolean;

  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;

  subtotal: () => number;
  total: () => number;
  itemCount: () => number;
}
```

---

## 8. Payment Integration

### Chapa Integration

Chapa is the primary Ethiopian payment gateway. It supports CBE (Commercial Bank of Ethiopia), Telebirr, Amole, and international cards.

#### Initialize Payment Flow

```typescript
// payments.service.ts — Chapa initialization

async initializePayment(order: Order, user: User): Promise<ChapaResponse> {
  const txRef = `BRI-${Date.now()}-${randomBytes(4).toString('hex')}`;

  const payload = {
    amount: order.total.toString(),
    currency: 'ETB',
    email: user.email,
    first_name: user.firstName,
    last_name: user.lastName,
    phone_number: user.phone,
    tx_ref: txRef,
    callback_url: `${CONFIG.API_URL}/api/payments/webhook/chapa`,
    return_url: `${CONFIG.WEB_URL}/checkout/success?tx_ref=${txRef}`,
    customization: {
      title: 'Bright Ideas',
      description: `Order ${order.orderNumber}`,
    },
  };

  const response = await axios.post(
    'https://api.chapa.co/v1/transaction/initialize',
    payload,
    {
      headers: {
        Authorization: `Bearer ${CONFIG.CHAPA_SECRET_KEY}`,
      },
    }
  );

  // Save payment record
  await this.prisma.payment.create({
    data: {
      orderId: order.id,
      provider: 'CHAPA',
      status: 'PENDING',
      amount: order.total,
      currency: 'ETB',
      transactionRef: txRef,
      checkoutUrl: response.data.data.checkout_url,
    },
  });

  return {
    checkoutUrl: response.data.data.checkout_url,
    txRef,
  };
}
```

#### Webhook Handler

```typescript
// payments.controller.ts — Webhook

@Post('webhook/chapa')
async handleChapaWebhook(@Body() body: ChapaWebhookPayload) {
  // 1. Verify the webhook signature using Chapa's webhook secret
  // 2. Verify transaction via GET /v1/transaction/verify/:txRef
  // 3. Update payment status
  // 4. Update order status to PAID
  // 5. Generate download tokens for all order items
  // 6. Send order confirmation email with download links
  // 7. Increment product totalSales counters
}
```

#### Verify Payment

```typescript
async verifyPayment(txRef: string): Promise<PaymentVerification> {
  const response = await axios.get(
    `https://api.chapa.co/v1/transaction/verify/${txRef}`,
    {
      headers: {
        Authorization: `Bearer ${CONFIG.CHAPA_SECRET_KEY}`,
      },
    }
  );

  return response.data;
}
```

### Payment Status Mapping

| Chapa Status | Internal PaymentStatus | Internal OrderStatus |
| ------------ | ---------------------- | -------------------- |
| success      | SUCCESS                | PAID                 |
| failed       | FAILED                 | FAILED               |
| pending      | PENDING                | PAYMENT_INITIATED    |

---

## 9. Digital File Delivery

### Secure Download Architecture

```
Purchase Complete
    │
    ▼
Generate DownloadTokens (one per file in order)
    │  token: UUID v4
    │  expiresAt: now + 72 hours
    │  maxUses: 5
    │
    ▼
Send Email with Download Links
    │  https://brightideas.et/api/downloads/file/{token}
    │
    ▼
Customer Clicks Download Link
    │
    ▼
Validate Token
    │  ├── Is token valid? (exists, not expired)
    │  ├── Has max uses been reached?
    │  ├── Does userId match?
    │  └── Increment useCount
    │
    ▼
Stream File to Customer
    │  ├── Set Content-Disposition: attachment
    │  ├── Set proper MIME type
    │  ├── Stream from storage (local or S3)
    │  └── Log download in DownloadLog
```

### Download Service Implementation

```typescript
// downloads.service.ts

async generateDownloadLink(userId: string, orderId: string, fileId: string) {
  // Verify user owns this order and order is PAID
  const order = await this.prisma.order.findFirst({
    where: { id: orderId, userId, status: 'PAID' },
    include: { items: true },
  });

  if (!order) throw new ForbiddenException('Invalid order');

  const token = randomUUID();
  await this.prisma.downloadToken.create({
    data: {
      token,
      userId,
      fileId,
      orderId,
      expiresAt: addHours(new Date(), 72),
      maxUses: 5,
    },
  });

  return { downloadUrl: `${CONFIG.API_URL}/api/downloads/file/${token}` };
}

async downloadFile(token: string, userId: string, req: Request) {
  const downloadToken = await this.prisma.downloadToken.findUnique({
    where: { token },
  });

  // Validation checks
  if (!downloadToken) throw new NotFoundException('Invalid download link');
  if (downloadToken.userId !== userId) throw new ForbiddenException();
  if (downloadToken.expiresAt < new Date()) throw new GoneException('Link expired');
  if (downloadToken.useCount >= downloadToken.maxUses) throw new GoneException('Max downloads reached');

  // Get file info
  const file = await this.prisma.productFile.findUnique({
    where: { id: downloadToken.fileId },
  });

  // Increment use count
  await this.prisma.downloadToken.update({
    where: { id: downloadToken.id },
    data: { useCount: { increment: 1 }, usedAt: new Date() },
  });

  // Log download
  await this.prisma.downloadLog.create({
    data: {
      userId,
      fileId: file.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || 'unknown',
    },
  });

  // Stream file
  return {
    stream: createReadStream(file.storagePath),
    fileName: file.fileName,
    mimeType: file.mimeType,
  };
}
```

### File Storage Strategy

```
Development:
  uploads/
  └── products/
      └── {productId}/
          ├── files/           # Deliverable files (protected)
          │   └── template-v1.xlsx
          └── images/          # Product images (public)
              ├── cover.jpg
              └── preview-1.jpg

Production (S3-compatible):
  bright-ideas-files/          # Private bucket
  └── products/{productId}/files/

  bright-ideas-public/         # Public bucket with CDN
  └── products/{productId}/images/
```

---

## 10. Admin Dashboard

### Dashboard Overview Page

```
┌──────────────────────────────────────────────────────────────────┐
│  Admin Dashboard                                     Aug 15, 2026│
├──────────┬──────────┬──────────┬──────────┬──────────────────────┤
│ Total    │ Total    │ Total    │ Active   │                      │
│ Revenue  │ Orders   │ Customers│ Products │                      │
│ ETB 45.2K│ 342      │ 1,250   │ 48       │                      │
│ ↑12%     │ ↑8%      │ ↑15%    │ +3 new   │                      │
├──────────┴──────────┴──────────┴──────────┤                      │
│                                           │  Recent Orders       │
│  Revenue Chart (Line/Bar)                 │  ┌─────────────────┐ │
│  [7 Days] [30 Days] [12 Months]           │  │ #BRI-001 PAID   │ │
│                                           │  │ #BRI-002 PENDING│ │
│  ▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐           │  │ #BRI-003 PAID   │ │
│  ▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐           │  └─────────────────┘ │
│                                           │                      │
├───────────────────────────────────────────┤  Top Products        │
│  Sales by Category (Pie/Donut)            │  ┌─────────────────┐ │
│  ● eBooks 45%                             │  │ 1. Excel Pro    │ │
│  ● Templates 30%                          │  │ 2. Business Kit │ │
│  ● Systems 25%                            │  │ 3. Finance 101  │ │
│                                           │  └─────────────────┘ │
└───────────────────────────────────────────┴──────────────────────┘
```

### Admin Product Management

```
Product Form Fields:
├── Basic Info
│   ├── Name (text, required)
│   ├── Slug (auto-generated, editable)
│   ├── Short Description (textarea, max 200 chars)
│   ├── Full Description (rich text editor)
│   ├── Product Type (select: EBOOK, EXCEL_TEMPLATE, BUSINESS_SYSTEM, COURSE, OTHER)
│   └── Status (select: DRAFT, ACTIVE, ARCHIVED)
├── Pricing
│   ├── Price (number, ETB)
│   ├── Compare At Price (number, optional, for showing discount)
│   └── Currency (fixed: ETB)
├── Organization
│   ├── Categories (multi-select)
│   ├── Tags (comma separated input)
│   └── Is Featured (toggle)
├── Media
│   ├── Product Images (drag & drop upload, multiple, set primary)
│   └── Preview Images (screenshots, sample pages)
├── Digital Files
│   ├── File Upload (the actual deliverable)
│   ├── File Version (text)
│   └── File display name
└── SEO
    ├── Meta Title
    └── Meta Description
```

### Admin Order Management

```
Order List View:
├── Filters: Status, Date Range, Search by order number/email
├── Columns: Order #, Customer, Items, Total, Status, Date, Actions
└── Actions: View Detail, Update Status

Order Detail View:
├── Order Info (number, date, status badge)
├── Customer Info (name, email, phone)
├── Items List (product name, price, quantity)
├── Payment Info (provider, transaction ref, status, paid at)
├── Download Activity (per file: download count, last downloaded)
└── Actions: Mark as Refunded, Resend Download Links
```

### Admin Analytics Page

```
Analytics Dashboard:
├── Date Range Picker (last 7d, 30d, 90d, 12m, custom)
├── Revenue Over Time (line chart)
├── Orders Over Time (bar chart)
├── Revenue by Product Type (pie chart)
├── Top 10 Products by Revenue (horizontal bar)
├── Top 10 Products by Sales Count (horizontal bar)
├── Customer Acquisition (new customers per period)
├── Coupon Performance (usage, revenue impact)
└── Export Button (CSV download of selected data)
```

---

## 11. Customer Dashboard

### Customer Dashboard Layout

```
My Account
├── Dashboard (overview)
│   ├── Recent Orders (last 5)
│   ├── Available Downloads count
│   └── Wishlist count
│
├── My Orders
│   ├── Order List (status filter, pagination)
│   └── Order Detail
│       ├── Order info + status timeline
│       ├── Items purchased
│       ├── Payment details
│       └── Download buttons (if PAID)
│
├── My Downloads
│   ├── All purchased files grouped by product
│   ├── Download button (generates fresh token)
│   ├── Download count / remaining
│   └── File info (name, size, version, last updated)
│
├── Wishlist
│   ├── Product cards grid
│   ├── Add to Cart button on each
│   └── Remove from wishlist
│
└── Profile Settings
    ├── Personal Info (name, email, phone)
    ├── Change Password
    └── Address Management
```

---

## 12. Analytics & Tracking

### Meta Pixel Integration

```typescript
// lib/meta-pixel.ts
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

export const pageview = () => {
  window.fbq('track', 'PageView');
};

export const event = (name: string, options: Record<string, unknown> = {}) => {
  window.fbq('track', name, options);
};

// Track these events:
// - PageView: every page load
// - ViewContent: product detail page (with product value and currency)
// - AddToCart: add item to cart
// - InitiateCheckout: checkout page load
// - Purchase: successful payment (with order value)
// - Search: search query submitted
```

### Google Analytics 4 Integration

```typescript
// lib/gtag.ts
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const pageview = (url: string) => {
  window.gtag('config', GA_MEASUREMENT_ID, { page_path: url });
};

export const event = (action: string, params: Record<string, unknown>) => {
  window.gtag('event', action, params);
};

// E-commerce events to track:
// - view_item: product page view
// - add_to_cart: cart addition
// - begin_checkout: checkout started
// - purchase: payment complete
// - search: product search
// - view_item_list: category page view
```

### UTM Tracking

```typescript
// lib/utm.ts
// Parse and store UTM parameters from URL on first visit

interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

// Store in sessionStorage on landing
// Attach to order creation payload
// Save in order metadata for attribution reporting
```

---

## 13. SEO Strategy

### Technical SEO Configuration

```typescript
// next.config.ts
const nextConfig = {
  // Generate sitemap
  // Handle redirects
  // Image optimization
  images: {
    domains: ['brightideas.et', 'storage.brightideas.et'],
    formats: ['image/avif', 'image/webp'],
  },
};

// app/sitemap.ts — Dynamic sitemap
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getActiveProducts();
  const categories = await getActiveCategories();

  return [
    { url: 'https://brightideas.et', changeFrequency: 'daily', priority: 1.0 },
    ...products.map((p) => ({
      url: `https://brightideas.et/products/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...categories.map((c) => ({
      url: `https://brightideas.et/categories/${c.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}

// app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/'] },
    sitemap: 'https://brightideas.et/sitemap.xml',
  };
}
```

### Per-Page Metadata

```typescript
// products/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  return {
    title: product.metaTitle || `${product.name} | Bright Ideas`,
    description: product.metaDescription || product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.primaryImage }],
      type: 'website',
    },
  };
}
```

### Structured Data (JSON-LD)

```typescript
// Add to product detail pages
const productJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.shortDescription,
  image: product.images.map(i => i.url),
  offers: {
    '@type': 'Offer',
    price: product.price,
    priceCurrency: 'ETB',
    availability: 'https://schema.org/InStock',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: product.averageRating,
    reviewCount: product.totalReviews,
  },
};
```

---

## 14. Seed Data

```typescript
// prisma/seed.ts
import { PrismaClient, UserRole, ProductType, ProductStatus } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ================================================
  // USERS
  // ================================================

  const adminPassword = await hash('Admin@2026!', 12);
  const customerPassword = await hash('Customer@2026!', 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@brightideas.et' },
    update: {},
    create: {
      email: 'admin@brightideas.et',
      passwordHash: adminPassword,
      firstName: 'Bright',
      lastName: 'Admin',
      phone: '+251911000001',
      role: UserRole.SUPER_ADMIN,
      isEmailVerified: true,
      isActive: true,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'manager@brightideas.et' },
    update: {},
    create: {
      email: 'manager@brightideas.et',
      passwordHash: adminPassword,
      firstName: 'Dawit',
      lastName: 'Bekele',
      phone: '+251911000002',
      role: UserRole.ADMIN,
      isEmailVerified: true,
      isActive: true,
    },
  });

  const customers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'abebe@gmail.com' },
      update: {},
      create: {
        email: 'abebe@gmail.com',
        passwordHash: customerPassword,
        firstName: 'Abebe',
        lastName: 'Tadesse',
        phone: '+251922111111',
        role: UserRole.CUSTOMER,
        isEmailVerified: true,
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'meron@gmail.com' },
      update: {},
      create: {
        email: 'meron@gmail.com',
        passwordHash: customerPassword,
        firstName: 'Meron',
        lastName: 'Alemu',
        phone: '+251922222222',
        role: UserRole.CUSTOMER,
        isEmailVerified: true,
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'yonas@gmail.com' },
      update: {},
      create: {
        email: 'yonas@gmail.com',
        passwordHash: customerPassword,
        firstName: 'Yonas',
        lastName: 'Hailu',
        phone: '+251922333333',
        role: UserRole.CUSTOMER,
        isEmailVerified: true,
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'sara@gmail.com' },
      update: {},
      create: {
        email: 'sara@gmail.com',
        passwordHash: customerPassword,
        firstName: 'Sara',
        lastName: 'Kebede',
        phone: '+251922444444',
        role: UserRole.CUSTOMER,
        isEmailVerified: true,
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'daniel@gmail.com' },
      update: {},
      create: {
        email: 'daniel@gmail.com',
        passwordHash: customerPassword,
        firstName: 'Daniel',
        lastName: 'Mengistu',
        phone: '+251922555555',
        role: UserRole.CUSTOMER,
        isEmailVerified: true,
        isActive: true,
      },
    }),
  ]);

  // ================================================
  // CATEGORIES
  // ================================================

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'ebooks' },
      update: {},
      create: {
        name: 'eBooks',
        slug: 'ebooks',
        description: 'Digital books on business, finance, and personal development',
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'excel-templates' },
      update: {},
      create: {
        name: 'Excel Templates',
        slug: 'excel-templates',
        description: 'Professional spreadsheet templates for business and finance',
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'business-systems' },
      update: {},
      create: {
        name: 'Business Systems',
        slug: 'business-systems',
        description: 'Complete business management and operational systems',
        sortOrder: 3,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'finance-tools' },
      update: {},
      create: {
        name: 'Finance Tools',
        slug: 'finance-tools',
        description: 'Financial planning, budgeting, and accounting tools',
        sortOrder: 4,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'marketing-resources' },
      update: {},
      create: {
        name: 'Marketing Resources',
        slug: 'marketing-resources',
        description: 'Marketing plans, social media templates, and branding kits',
        sortOrder: 5,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'hr-documents' },
      update: {},
      create: {
        name: 'HR Documents',
        slug: 'hr-documents',
        description: 'Human resource templates, contracts, and policy documents',
        sortOrder: 6,
        isActive: true,
      },
    }),
  ]);

  // Sub-categories
  const subCategories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'business-ebooks' },
      update: {},
      create: {
        name: 'Business eBooks',
        slug: 'business-ebooks',
        parentId: categories[0].id,
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'self-help-ebooks' },
      update: {},
      create: {
        name: 'Self Help eBooks',
        slug: 'self-help-ebooks',
        parentId: categories[0].id,
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'budget-templates' },
      update: {},
      create: {
        name: 'Budget Templates',
        slug: 'budget-templates',
        parentId: categories[1].id,
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'inventory-templates' },
      update: {},
      create: {
        name: 'Inventory Templates',
        slug: 'inventory-templates',
        parentId: categories[1].id,
        sortOrder: 2,
        isActive: true,
      },
    }),
  ]);

  // ================================================
  // PRODUCTS
  // ================================================

  const products = await Promise.all([
    // --- eBooks ---
    prisma.product.upsert({
      where: { slug: 'ethiopian-startup-guide' },
      update: {},
      create: {
        name: 'Ethiopian Startup Guide: From Idea to Launch',
        slug: 'ethiopian-startup-guide',
        description:
          'A comprehensive guide for aspiring Ethiopian entrepreneurs. Covers business registration with the Ministry of Trade, tax requirements, TIN registration, financing options including MFIs and angel investors, and step by step instructions for launching your business in Ethiopia. Includes real case studies from successful Addis Ababa startups.',
        shortDescription: 'Complete step by step guide to launching a business in Ethiopia',
        price: 299.0,
        compareAtPrice: 499.0,
        type: ProductType.EBOOK,
        status: ProductStatus.ACTIVE,
        isFeatured: true,
        tags: ['startup', 'business', 'ethiopia', 'entrepreneurship'],
        averageRating: 4.7,
        totalReviews: 45,
        totalSales: 312,
        metaTitle: 'Ethiopian Startup Guide | Bright Ideas',
        metaDescription: 'Launch your business in Ethiopia with this comprehensive startup guide covering registration, financing, and growth strategies.',
      },
    }),
    prisma.product.upsert({
      where: { slug: 'personal-finance-mastery-ethiopia' },
      update: {},
      create: {
        name: 'Personal Finance Mastery for Ethiopians',
        slug: 'personal-finance-mastery-ethiopia',
        description:
          'Take control of your financial future. This eBook covers budgeting strategies tailored to Ethiopian income levels, saving with Ethiopian banks and MFIs, understanding the birr, investing basics, and building an emergency fund. Written in simple, practical language for anyone who wants to manage money better.',
        shortDescription: 'Master your money with strategies designed for the Ethiopian context',
        price: 199.0,
        compareAtPrice: 350.0,
        type: ProductType.EBOOK,
        status: ProductStatus.ACTIVE,
        isFeatured: true,
        tags: ['finance', 'personal-finance', 'budgeting', 'saving'],
        averageRating: 4.5,
        totalReviews: 67,
        totalSales: 520,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'digital-marketing-ethiopia' },
      update: {},
      create: {
        name: 'Digital Marketing for Ethiopian Businesses',
        slug: 'digital-marketing-ethiopia',
        description:
          'Learn how to market your products and services online in the Ethiopian market. Covers Facebook and Instagram marketing, Telegram channel growth, SEO basics, Google My Business optimization, and content marketing strategies. Includes Ethiopian case studies and Amharic marketing tips.',
        shortDescription: 'Grow your Ethiopian business with practical digital marketing strategies',
        price: 249.0,
        type: ProductType.EBOOK,
        status: ProductStatus.ACTIVE,
        isFeatured: false,
        tags: ['marketing', 'digital', 'social-media', 'SEO'],
        averageRating: 4.3,
        totalReviews: 28,
        totalSales: 189,
      },
    }),

    // --- Excel Templates ---
    prisma.product.upsert({
      where: { slug: 'business-budget-planner-excel' },
      update: {},
      create: {
        name: 'Business Budget Planner (Excel)',
        slug: 'business-budget-planner-excel',
        description:
          'Professional Excel budget planner designed for Ethiopian businesses. Includes monthly and annual budget sheets, expense tracking with ETB formatting, cash flow projections, variance analysis, and visual charts. Pre-built formulas handle all calculations automatically. Works with Microsoft Excel and Google Sheets.',
        shortDescription: 'Complete Excel budget template with ETB formatting and automatic calculations',
        price: 149.0,
        compareAtPrice: 250.0,
        type: ProductType.EXCEL_TEMPLATE,
        status: ProductStatus.ACTIVE,
        isFeatured: true,
        tags: ['budget', 'excel', 'finance', 'planning'],
        averageRating: 4.8,
        totalReviews: 92,
        totalSales: 845,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'inventory-management-excel' },
      update: {},
      create: {
        name: 'Inventory Management System (Excel)',
        slug: 'inventory-management-excel',
        description:
          'Track your stock like a pro. This Excel template includes product catalog management, stock in/out tracking, automatic reorder alerts, supplier management, purchase order generation, and inventory valuation reports. Designed for retail shops, warehouses, and small manufacturers in Ethiopia.',
        shortDescription: 'Complete inventory tracking system with automatic reorder alerts',
        price: 199.0,
        type: ProductType.EXCEL_TEMPLATE,
        status: ProductStatus.ACTIVE,
        isFeatured: true,
        tags: ['inventory', 'excel', 'stock', 'warehouse'],
        averageRating: 4.6,
        totalReviews: 54,
        totalSales: 423,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'payroll-calculator-ethiopia' },
      update: {},
      create: {
        name: 'Ethiopian Payroll Calculator (Excel)',
        slug: 'payroll-calculator-ethiopia',
        description:
          'Calculate Ethiopian payroll with accuracy. This template handles income tax brackets per Ethiopian tax law, pension contributions (7% employee, 11% employer), overtime calculations, allowances, deductions, and generates pay slips. Updated for the latest tax tables. Supports up to 200 employees.',
        shortDescription: 'Ethiopian payroll template with accurate tax and pension calculations',
        price: 349.0,
        compareAtPrice: 500.0,
        type: ProductType.EXCEL_TEMPLATE,
        status: ProductStatus.ACTIVE,
        isFeatured: true,
        tags: ['payroll', 'hr', 'tax', 'ethiopia', 'pension'],
        averageRating: 4.9,
        totalReviews: 112,
        totalSales: 967,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'sales-tracker-dashboard-excel' },
      update: {},
      create: {
        name: 'Sales Tracker & Dashboard (Excel)',
        slug: 'sales-tracker-dashboard-excel',
        description:
          'Monitor your sales performance with this visual Excel dashboard. Includes daily/weekly/monthly sales entry, customer tracking, product performance analysis, revenue charts, target vs actual comparisons, and commission calculations. Fully automated with pivot tables and charts.',
        shortDescription: 'Visual sales tracking dashboard with automated charts and reports',
        price: 179.0,
        type: ProductType.EXCEL_TEMPLATE,
        status: ProductStatus.ACTIVE,
        isFeatured: false,
        tags: ['sales', 'dashboard', 'tracking', 'revenue'],
        averageRating: 4.4,
        totalReviews: 36,
        totalSales: 256,
      },
    }),

    // --- Business Systems ---
    prisma.product.upsert({
      where: { slug: 'complete-hr-system-bundle' },
      update: {},
      create: {
        name: 'Complete HR System Bundle',
        slug: 'complete-hr-system-bundle',
        description:
          'Everything you need to manage your human resources. This bundle includes: employee database template, leave management system, performance review forms, job description templates, employment contract templates (Ethiopian labor law compliant), onboarding checklist, exit interview forms, and HR policy document templates. All documents are editable and customizable.',
        shortDescription: 'Complete HR document and system bundle for Ethiopian businesses',
        price: 599.0,
        compareAtPrice: 899.0,
        type: ProductType.BUSINESS_SYSTEM,
        status: ProductStatus.ACTIVE,
        isFeatured: true,
        tags: ['hr', 'human-resources', 'employment', 'labor-law'],
        averageRating: 4.7,
        totalReviews: 41,
        totalSales: 198,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'restaurant-management-kit' },
      update: {},
      create: {
        name: 'Restaurant Management Kit',
        slug: 'restaurant-management-kit',
        description:
          'Run your restaurant or cafe more efficiently. Includes menu costing spreadsheet, daily sales tracker, inventory and ingredient tracker, staff scheduling template, customer feedback form, supplier payment tracker, and a break-even calculator. Designed for Ethiopian restaurants, cafes, and juice houses.',
        shortDescription: 'Complete management toolkit for Ethiopian restaurants and cafes',
        price: 399.0,
        type: ProductType.BUSINESS_SYSTEM,
        status: ProductStatus.ACTIVE,
        isFeatured: false,
        tags: ['restaurant', 'food', 'management', 'hospitality'],
        averageRating: 4.5,
        totalReviews: 23,
        totalSales: 134,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'project-management-toolkit' },
      update: {},
      create: {
        name: 'Project Management Toolkit',
        slug: 'project-management-toolkit',
        description:
          'Manage your projects from start to finish. Includes Gantt chart template, project charter template, risk register, stakeholder matrix, weekly status report template, meeting minutes template, and project budget tracker. Suitable for construction, IT, NGO, and consulting projects.',
        shortDescription: 'Professional project management templates and tracking tools',
        price: 299.0,
        type: ProductType.BUSINESS_SYSTEM,
        status: ProductStatus.ACTIVE,
        isFeatured: false,
        tags: ['project-management', 'planning', 'tracking'],
        averageRating: 4.2,
        totalReviews: 18,
        totalSales: 95,
      },
    }),

    // --- Additional Products ---
    prisma.product.upsert({
      where: { slug: 'social-media-content-calendar' },
      update: {},
      create: {
        name: 'Social Media Content Calendar',
        slug: 'social-media-content-calendar',
        description:
          'Plan and schedule your social media content for the entire year. Includes content calendar template, post templates for Facebook, Instagram, and Telegram, hashtag research guide, Ethiopian holiday marketing calendar, and engagement tracking sheet.',
        shortDescription: '12 month social media planning calendar with post templates',
        price: 129.0,
        type: ProductType.EXCEL_TEMPLATE,
        status: ProductStatus.ACTIVE,
        isFeatured: false,
        tags: ['social-media', 'content', 'marketing', 'calendar'],
        averageRating: 4.1,
        totalReviews: 15,
        totalSales: 178,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'business-plan-template-ethiopia' },
      update: {},
      create: {
        name: 'Business Plan Template (Ethiopia)',
        slug: 'business-plan-template-ethiopia',
        description:
          'Write a professional business plan that impresses banks and investors. This template follows the format accepted by Ethiopian banks (CBE, Dashen, Awash) and includes executive summary, market analysis, financial projections (3 years), operations plan, and marketing strategy sections. Includes a filled example for reference.',
        shortDescription: 'Bank-ready business plan template accepted by Ethiopian financial institutions',
        price: 349.0,
        compareAtPrice: 499.0,
        type: ProductType.EBOOK,
        status: ProductStatus.ACTIVE,
        isFeatured: true,
        tags: ['business-plan', 'bank', 'investment', 'startup'],
        averageRating: 4.8,
        totalReviews: 78,
        totalSales: 612,
      },
    }),
  ]);

  // ================================================
  // PRODUCT-CATEGORY RELATIONS
  // ================================================

  const productCategoryMappings = [
    { productSlug: 'ethiopian-startup-guide', categorySlug: 'ebooks' },
    { productSlug: 'ethiopian-startup-guide', categorySlug: 'business-ebooks' },
    { productSlug: 'personal-finance-mastery-ethiopia', categorySlug: 'ebooks' },
    { productSlug: 'personal-finance-mastery-ethiopia', categorySlug: 'self-help-ebooks' },
    { productSlug: 'digital-marketing-ethiopia', categorySlug: 'ebooks' },
    { productSlug: 'digital-marketing-ethiopia', categorySlug: 'marketing-resources' },
    { productSlug: 'business-budget-planner-excel', categorySlug: 'excel-templates' },
    { productSlug: 'business-budget-planner-excel', categorySlug: 'budget-templates' },
    { productSlug: 'business-budget-planner-excel', categorySlug: 'finance-tools' },
    { productSlug: 'inventory-management-excel', categorySlug: 'excel-templates' },
    { productSlug: 'inventory-management-excel', categorySlug: 'inventory-templates' },
    { productSlug: 'payroll-calculator-ethiopia', categorySlug: 'excel-templates' },
    { productSlug: 'payroll-calculator-ethiopia', categorySlug: 'hr-documents' },
    { productSlug: 'sales-tracker-dashboard-excel', categorySlug: 'excel-templates' },
    { productSlug: 'sales-tracker-dashboard-excel', categorySlug: 'finance-tools' },
    { productSlug: 'complete-hr-system-bundle', categorySlug: 'business-systems' },
    { productSlug: 'complete-hr-system-bundle', categorySlug: 'hr-documents' },
    { productSlug: 'restaurant-management-kit', categorySlug: 'business-systems' },
    { productSlug: 'project-management-toolkit', categorySlug: 'business-systems' },
    { productSlug: 'social-media-content-calendar', categorySlug: 'excel-templates' },
    { productSlug: 'social-media-content-calendar', categorySlug: 'marketing-resources' },
    { productSlug: 'business-plan-template-ethiopia', categorySlug: 'ebooks' },
    { productSlug: 'business-plan-template-ethiopia', categorySlug: 'business-ebooks' },
    { productSlug: 'business-plan-template-ethiopia', categorySlug: 'finance-tools' },
  ];

  for (const mapping of productCategoryMappings) {
    const product = products.find((p) => p.slug === mapping.productSlug);
    const category = [...categories, ...subCategories].find((c) => c.slug === mapping.categorySlug);
    if (product && category) {
      await prisma.productCategory.upsert({
        where: {
          productId_categoryId: {
            productId: product.id,
            categoryId: category.id,
          },
        },
        update: {},
        create: {
          productId: product.id,
          categoryId: category.id,
        },
      });
    }
  }

  // ================================================
  // PRODUCT IMAGES (placeholder URLs)
  // ================================================

  for (const product of products) {
    await prisma.productImage.upsert({
      where: { id: `img-${product.slug}-1` },
      update: {},
      create: {
        id: `img-${product.slug}-1`,
        productId: product.id,
        url: `/images/products/${product.slug}/cover.jpg`,
        altText: product.name,
        sortOrder: 0,
        isPrimary: true,
      },
    });
    await prisma.productImage.upsert({
      where: { id: `img-${product.slug}-2` },
      update: {},
      create: {
        id: `img-${product.slug}-2`,
        productId: product.id,
        url: `/images/products/${product.slug}/preview-1.jpg`,
        altText: `${product.name} preview`,
        sortOrder: 1,
        isPrimary: false,
      },
    });
  }

  // ================================================
  // COUPONS
  // ================================================

  await Promise.all([
    prisma.coupon.upsert({
      where: { code: 'WELCOME10' },
      update: {},
      create: {
        code: 'WELCOME10',
        description: '10% off your first purchase',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        maxDiscount: 100,
        maxUses: 1000,
        maxUsesPerUser: 1,
        status: 'ACTIVE',
        startsAt: new Date('2026-01-01'),
        expiresAt: new Date('2026-12-31'),
      },
    }),
    prisma.coupon.upsert({
      where: { code: 'BUNDLE20' },
      update: {},
      create: {
        code: 'BUNDLE20',
        description: '20% off when you spend over ETB 500',
        discountType: 'PERCENTAGE',
        discountValue: 20,
        minOrderAmount: 500,
        maxDiscount: 300,
        maxUses: 500,
        maxUsesPerUser: 2,
        status: 'ACTIVE',
        startsAt: new Date('2026-01-01'),
        expiresAt: new Date('2026-12-31'),
      },
    }),
    prisma.coupon.upsert({
      where: { code: 'NEWYEAR50' },
      update: {},
      create: {
        code: 'NEWYEAR50',
        description: 'ETB 50 off for Ethiopian New Year',
        discountType: 'FIXED_AMOUNT',
        discountValue: 50,
        minOrderAmount: 200,
        maxUses: 200,
        maxUsesPerUser: 1,
        status: 'ACTIVE',
        startsAt: new Date('2026-09-01'),
        expiresAt: new Date('2026-09-15'),
      },
    }),
    prisma.coupon.upsert({
      where: { code: 'FLASH30' },
      update: {},
      create: {
        code: 'FLASH30',
        description: '30% off flash sale (limited time)',
        discountType: 'PERCENTAGE',
        discountValue: 30,
        maxDiscount: 200,
        maxUses: 100,
        maxUsesPerUser: 1,
        status: 'ACTIVE',
        startsAt: new Date('2026-08-15'),
        expiresAt: new Date('2026-08-20'),
      },
    }),
  ]);

  // ================================================
  // REVIEWS
  // ================================================

  const reviewData = [
    { userId: customers[0].id, productSlug: 'payroll-calculator-ethiopia', rating: 5, title: 'Saved me so much time', comment: 'The tax calculations are spot on. I was doing payroll manually for 15 employees and now it takes minutes instead of hours.' },
    { userId: customers[1].id, productSlug: 'payroll-calculator-ethiopia', rating: 5, title: 'Best payroll template', comment: 'Very accurate pension and tax calculations. Updated for the latest Ethiopian tax brackets. Highly recommended.' },
    { userId: customers[2].id, productSlug: 'business-budget-planner-excel', rating: 5, title: 'Professional quality', comment: 'This is exactly what our small business needed. The cash flow projections are very helpful.' },
    { userId: customers[3].id, productSlug: 'business-budget-planner-excel', rating: 4, title: 'Good but could use more charts', comment: 'Great template overall. Would love to see more visualization options in future updates.' },
    { userId: customers[0].id, productSlug: 'ethiopian-startup-guide', rating: 5, title: 'Must read for entrepreneurs', comment: 'Very practical advice. The section on business registration steps saved me weeks of confusion.' },
    { userId: customers[4].id, productSlug: 'ethiopian-startup-guide', rating: 4, title: 'Helpful guide', comment: 'Good overview of starting a business in Ethiopia. Some sections could be more detailed but overall very useful.' },
    { userId: customers[1].id, productSlug: 'complete-hr-system-bundle', rating: 5, title: 'Complete HR solution', comment: 'All the HR documents we needed in one package. The employment contracts follow Ethiopian labor law properly.' },
    { userId: customers[2].id, productSlug: 'business-plan-template-ethiopia', rating: 5, title: 'Got my loan approved', comment: 'Used this template to write my business plan for CBE. The loan was approved on the first submission.' },
    { userId: customers[3].id, productSlug: 'inventory-management-excel', rating: 4, title: 'Works great for my shop', comment: 'I use this to track inventory at my electronics shop. The reorder alerts are very useful.' },
    { userId: customers[4].id, productSlug: 'personal-finance-mastery-ethiopia', rating: 5, title: 'Changed how I manage money', comment: 'Simple, practical advice that actually works in the Ethiopian context. Started saving 20% of my income after reading this.' },
  ];

  for (const review of reviewData) {
    const product = products.find((p) => p.slug === review.productSlug);
    if (product) {
      await prisma.review.upsert({
        where: {
          userId_productId: {
            userId: review.userId,
            productId: product.id,
          },
        },
        update: {},
        create: {
          userId: review.userId,
          productId: product.id,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
          isVisible: true,
        },
      });
    }
  }

  // ================================================
  // BANNERS
  // ================================================

  await Promise.all([
    prisma.banner.upsert({
      where: { id: 'banner-1' },
      update: {},
      create: {
        id: 'banner-1',
        title: 'Ethiopian New Year Sale',
        subtitle: 'Up to 30% off all business templates',
        imageUrl: '/images/banners/new-year-sale.jpg',
        linkUrl: '/products?sale=true',
        sortOrder: 1,
        isActive: true,
        startsAt: new Date('2026-09-01'),
        endsAt: new Date('2026-09-15'),
      },
    }),
    prisma.banner.upsert({
      where: { id: 'banner-2' },
      update: {},
      create: {
        id: 'banner-2',
        title: 'New: Complete HR System Bundle',
        subtitle: 'Everything you need to manage your team',
        imageUrl: '/images/banners/hr-bundle.jpg',
        linkUrl: '/products/complete-hr-system-bundle',
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.banner.upsert({
      where: { id: 'banner-3' },
      update: {},
      create: {
        id: 'banner-3',
        title: 'Best Seller: Payroll Calculator',
        subtitle: 'Trusted by 900+ Ethiopian businesses',
        imageUrl: '/images/banners/payroll-bestseller.jpg',
        linkUrl: '/products/payroll-calculator-ethiopia',
        sortOrder: 3,
        isActive: true,
      },
    }),
  ]);

  // ================================================
  // SITE SETTINGS
  // ================================================

  const settings = [
    { key: 'site_name', value: 'Bright Ideas', type: 'string' },
    { key: 'site_tagline', value: 'Digital Products for Ethiopian Businesses', type: 'string' },
    { key: 'contact_email', value: 'support@brightideas.et', type: 'string' },
    { key: 'contact_phone', value: '+251911000000', type: 'string' },
    { key: 'currency', value: 'ETB', type: 'string' },
    { key: 'chapa_public_key', value: 'CHAPUBK-TEST-xxxxxxxxxxxx', type: 'string' },
    { key: 'meta_pixel_id', value: '', type: 'string' },
    { key: 'ga_measurement_id', value: '', type: 'string' },
    { key: 'download_link_expiry_hours', value: '72', type: 'number' },
    { key: 'max_download_attempts', value: '5', type: 'number' },
    { key: 'social_facebook', value: 'https://facebook.com/brightideaset', type: 'string' },
    { key: 'social_telegram', value: 'https://t.me/brightideaset', type: 'string' },
    { key: 'social_instagram', value: 'https://instagram.com/brightideaset', type: 'string' },
    { key: 'social_tiktok', value: 'https://tiktok.com/@brightideaset', type: 'string' },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  // ================================================
  // SAMPLE ORDERS (for admin dashboard testing)
  // ================================================

  const sampleOrders = [
    {
      orderNumber: 'BRI-20260810-0001',
      userId: customers[0].id,
      status: 'PAID' as const,
      subtotal: 349.0,
      discountAmount: 0,
      total: 349.0,
      customerEmail: 'abebe@gmail.com',
      customerName: 'Abebe Tadesse',
      productSlug: 'payroll-calculator-ethiopia',
    },
    {
      orderNumber: 'BRI-20260811-0002',
      userId: customers[1].id,
      status: 'PAID' as const,
      subtotal: 299.0,
      discountAmount: 29.9,
      total: 269.1,
      customerEmail: 'meron@gmail.com',
      customerName: 'Meron Alemu',
      couponCode: 'WELCOME10',
      productSlug: 'ethiopian-startup-guide',
    },
    {
      orderNumber: 'BRI-20260812-0003',
      userId: customers[2].id,
      status: 'PAID' as const,
      subtotal: 748.0,
      discountAmount: 149.6,
      total: 598.4,
      customerEmail: 'yonas@gmail.com',
      customerName: 'Yonas Hailu',
      couponCode: 'BUNDLE20',
      productSlug: 'complete-hr-system-bundle',
    },
    {
      orderNumber: 'BRI-20260813-0004',
      userId: customers[3].id,
      status: 'PENDING' as const,
      subtotal: 149.0,
      discountAmount: 0,
      total: 149.0,
      customerEmail: 'sara@gmail.com',
      customerName: 'Sara Kebede',
      productSlug: 'business-budget-planner-excel',
    },
    {
      orderNumber: 'BRI-20260814-0005',
      userId: customers[4].id,
      status: 'PAID' as const,
      subtotal: 199.0,
      discountAmount: 0,
      total: 199.0,
      customerEmail: 'daniel@gmail.com',
      customerName: 'Daniel Mengistu',
      productSlug: 'personal-finance-mastery-ethiopia',
    },
  ];

  for (const orderData of sampleOrders) {
    const product = products.find((p) => p.slug === orderData.productSlug);
    if (!product) continue;

    const existingOrder = await prisma.order.findUnique({
      where: { orderNumber: orderData.orderNumber },
    });
    if (existingOrder) continue;

    let couponId: string | undefined;
    if (orderData.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: orderData.couponCode },
      });
      couponId = coupon?.id;
    }

    await prisma.order.create({
      data: {
        orderNumber: orderData.orderNumber,
        userId: orderData.userId,
        status: orderData.status,
        subtotal: orderData.subtotal,
        discountAmount: orderData.discountAmount,
        total: orderData.total,
        currency: 'ETB',
        couponId,
        customerEmail: orderData.customerEmail,
        customerName: orderData.customerName,
        items: {
          create: {
            productId: product.id,
            price: product.price,
            quantity: 1,
          },
        },
        payment: orderData.status === 'PAID'
          ? {
              create: {
                provider: 'CHAPA',
                status: 'SUCCESS',
                amount: orderData.total,
                currency: 'ETB',
                transactionRef: `CHAPA-${orderData.orderNumber}`,
                providerRef: `chapa_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                paidAt: new Date(),
              },
            }
          : undefined,
      },
    });
  }

  console.log('Seed completed successfully!');
  console.log('---');
  console.log('Admin Login:');
  console.log('  Email: admin@brightideas.et');
  console.log('  Password: Admin@2026!');
  console.log('---');
  console.log('Customer Login:');
  console.log('  Email: abebe@gmail.com');
  console.log('  Password: Customer@2026!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## 15. Environment Variables

```bash
# .env.example

# ============================================================
# DATABASE
# ============================================================
DATABASE_URL="postgresql://brightideas:password@localhost:5432/bright_ideas_db?schema=public"

# ============================================================
# AUTH
# ============================================================
JWT_SECRET="your-jwt-secret-change-this-in-production"
JWT_REFRESH_SECRET="your-refresh-secret-change-this-in-production"
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"

# ============================================================
# CHAPA PAYMENT
# ============================================================
CHAPA_SECRET_KEY="CHASECK-TEST-xxxxxxxxxxxxxxxx"
CHAPA_WEBHOOK_SECRET="your-chapa-webhook-secret"

# ============================================================
# APP CONFIG
# ============================================================
API_URL="http://localhost:3001"
WEB_URL="http://localhost:3000"
NODE_ENV="development"
PORT=3001

# ============================================================
# FILE STORAGE
# ============================================================
FILE_STORAGE_TYPE="local"           # local | s3
FILE_UPLOAD_DIR="./uploads"
# S3 config (production)
# S3_BUCKET_NAME=""
# S3_REGION=""
# S3_ACCESS_KEY=""
# S3_SECRET_KEY=""
# S3_ENDPOINT=""                    # For S3-compatible like MinIO

# ============================================================
# REDIS (for BullMQ queues)
# ============================================================
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=""

# ============================================================
# EMAIL
# ============================================================
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="noreply@brightideas.et"
SMTP_PASS="app-password"
EMAIL_FROM="Bright Ideas <noreply@brightideas.et>"

# ============================================================
# ANALYTICS (Frontend .env.local)
# ============================================================
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
NEXT_PUBLIC_FB_PIXEL_ID=""
NEXT_PUBLIC_GA_MEASUREMENT_ID=""
```

---

## 16. Deployment

### Docker Compose (Development)

```yaml
# docker-compose.yml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: bright_ideas_db
      POSTGRES_USER: brightideas
      POSTGRES_PASSWORD: password
    ports:
      - '5432:5432'
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - '3001:3001'
    env_file: .env
    depends_on:
      - db
      - redis
    volumes:
      - ./uploads:/app/uploads

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - '3000:3000'
    env_file: apps/web/.env.local
    depends_on:
      - api

volumes:
  pgdata:
```

### Production Deployment Checklist

```
Pre-deployment:
  □ All environment variables set (no test keys)
  □ CHAPA_SECRET_KEY is production key
  □ JWT secrets are strong random values (64+ chars)
  □ Database credentials are strong
  □ SMTP configured for production email
  □ S3 storage configured (not local)
  □ SSL/TLS certificates installed
  □ Domain DNS configured

Deployment steps:
  □ docker-compose -f docker-compose.prod.yml up -d
  □ npx prisma migrate deploy
  □ npx prisma db seed (first time only)
  □ Verify Chapa webhook URL is registered
  □ Test payment flow end to end
  □ Enable rate limiting
  □ Configure Nginx reverse proxy with SSL
  □ Set up automated backups (pg_dump cron)
  □ Set up monitoring / health checks
```

---

## 17. Testing Strategy

### Backend Testing (NestJS)

```
Unit Tests:
  ├── services/*.spec.ts        → Business logic
  ├── guards/*.spec.ts          → Auth guards
  └── pipes/*.spec.ts           → Validation pipes

Integration Tests:
  ├── auth.e2e-spec.ts          → Registration, login, refresh flow
  ├── products.e2e-spec.ts      → CRUD operations
  ├── orders.e2e-spec.ts        → Order creation and status updates
  ├── payments.e2e-spec.ts      → Payment initialization and webhook
  ├── downloads.e2e-spec.ts     → Token generation and file delivery
  └── coupons.e2e-spec.ts       → Coupon validation logic

Tools: Jest + Supertest + @nestjs/testing
Database: Use a test database, reset between suites with Prisma
```

### Frontend Testing (Next.js)

```
Component Tests:
  ├── product-card.test.tsx
  ├── cart-sheet.test.tsx
  ├── checkout-form.test.tsx
  └── admin/product-form.test.tsx

E2E Tests (Playwright):
  ├── storefront-browse.spec.ts    → Browse products, search, filter
  ├── cart-checkout.spec.ts        → Add to cart, apply coupon, checkout
  ├── auth-flow.spec.ts            → Register, login, forgot password
  ├── customer-dashboard.spec.ts   → Orders, downloads, profile
  └── admin-management.spec.ts     → Product CRUD, order management

Tools: Vitest + React Testing Library (unit), Playwright (e2e)
```

### Payment Testing

```
Chapa Test Mode:
  Use CHASECK-TEST-xxx keys
  Test card: 4200 0000 0000 0000
  Test mobile: use sandbox numbers from Chapa docs
  Webhook testing: use ngrok or Chapa's test webhook trigger
```

---

## 18. Security Checklist

```
Authentication:
  □ Passwords hashed with bcrypt (12 rounds)
  □ JWT tokens short-lived (15 min access, 7d refresh)
  □ Refresh token rotation on every use
  □ Rate limiting on auth endpoints (5 attempts per minute)
  □ Account lockout after 10 failed login attempts

Authorization:
  □ Role-based access control on all protected endpoints
  □ Users can only access their own orders/downloads
  □ Admin routes require ADMIN or SUPER_ADMIN role
  □ Ownership verification on all mutations

Data Protection:
  □ All API inputs validated with Zod
  □ SQL injection prevented (Prisma parameterized queries)
  □ XSS prevention (React auto-escaping + CSP headers)
  □ CSRF protection on state-changing endpoints
  □ Sensitive data (passwords, tokens) never in API responses

File Security:
  □ Digital files stored outside web root
  □ Download tokens are single-use or limited-use
  □ Download tokens expire (72 hours default)
  □ File paths never exposed to client
  □ MIME type validation on uploads
  □ File size limits enforced

Payment Security:
  □ Chapa webhook signature verification
  □ Payment verification via Chapa API (not just webhook)
  □ Order totals recalculated server-side (never trust client)
  □ Idempotent payment processing (prevent double charges)

Infrastructure:
  □ HTTPS everywhere (TLS 1.3)
  □ Security headers (Helmet.js)
  □ CORS configured for specific origins only
  □ Rate limiting on all endpoints (Throttle module)
  □ Environment variables (no secrets in code)
  □ Database backups encrypted
  □ Dependencies scanned for vulnerabilities (npm audit)
```

---

## Quick Start Commands

```bash
# Clone and install
git clone https://github.com/brightideas/ecommerce.git
cd ecommerce
npm install

# Set up environment
cp .env.example .env
# Edit .env with your values

# Start database
docker-compose up -d db redis

# Run migrations and seed
cd apps/api
npx prisma migrate dev
npx prisma db seed

# Start development
npm run dev          # Starts both web (3000) and api (3001)

# Admin login
# Email: admin@brightideas.et
# Password: Admin@2026!
```
