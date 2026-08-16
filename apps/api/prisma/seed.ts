import { PrismaClient, UserRole, ProductType, ProductStatus, DiscountType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for Bright Ideas Digital Store...');

  // 1. Create Users
  const adminPasswordHash = await bcrypt.hash('Admin@2026!', 12);
  const customerPasswordHash = await bcrypt.hash('Customer@2026!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@brightideas.et' },
    update: {},
    create: {
      email: 'admin@brightideas.et',
      passwordHash: adminPasswordHash,
      firstName: 'Bright',
      lastName: 'Admin',
      role: UserRole.SUPER_ADMIN,
      isEmailVerified: true,
      phone: '+251911000000',
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@brightideas.et' },
    update: {},
    create: {
      email: 'customer@brightideas.et',
      passwordHash: customerPasswordHash,
      firstName: 'Abebe',
      lastName: 'Bikila',
      role: UserRole.CUSTOMER,
      isEmailVerified: true,
      phone: '+251912345678',
    },
  });

  console.log('✅ Created default Admin and Customer accounts');

  // 2. Create Categories
  const catEbooks = await prisma.category.upsert({
    where: { slug: 'ebooks' },
    update: {},
    create: {
      name: 'eBooks & Guides',
      slug: 'ebooks',
      description: 'Comprehensive guidebooks, business manuals, and practical eBooks tailored for Ethiopian entrepreneurs.',
      sortOrder: 1,
    },
  });

  const catExcel = await prisma.category.upsert({
    where: { slug: 'excel-templates' },
    update: {},
    create: {
      name: 'Excel Templates',
      slug: 'excel-templates',
      description: 'Automated financial models, payroll calculators, inventory trackers, and budget planners.',
      sortOrder: 2,
    },
  });

  const catSystems = await prisma.category.upsert({
    where: { slug: 'business-systems' },
    update: {},
    create: {
      name: 'Business Systems',
      slug: 'business-systems',
      description: 'Ready-to-use operational workflows, SOP bundles, and business management toolkits.',
      sortOrder: 3,
    },
  });

  console.log('✅ Created categories');

  // 3. Create Sample Digital Products
  const p1 = await prisma.product.upsert({
    where: { slug: 'ethiopian-tax-and-payroll-excel-calculator' },
    update: {},
    create: {
      name: 'Ethiopian Tax & Payroll Excel Calculator (2026 Edition)',
      slug: 'ethiopian-tax-and-payroll-excel-calculator',
      description: 'Fully automated Excel template built according to Ethiopian ERCA tax regulations. Includes Income tax formulas, Pension 7%/11%, Cost of Living allowance, and automated Payslip generator.',
      shortDescription: 'Automated Ethiopian payroll & tax calculator compliant with latest regulations.',
      price: 499.00,
      compareAtPrice: 850.00,
      currency: 'ETB',
      type: ProductType.EXCEL_TEMPLATE,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      tags: ['Excel', 'Payroll', 'Tax', 'Ethiopia', 'Finance'],
      averageRating: 4.9,
      totalReviews: 12,
      totalSales: 85,
      categories: {
        create: [{ categoryId: catExcel.id }],
      },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
            altText: 'Payroll Excel Sheet',
            isPrimary: true,
            sortOrder: 0,
          },
        ],
      },
      files: {
        create: [
          {
            fileName: 'Ethiopian_Payroll_Tax_Calculator_2026.xlsx',
            fileSize: 2450000,
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            storagePath: 'products/Ethiopian_Payroll_Tax_Calculator_2026.xlsx',
          },
        ],
      },
    },
  });

  const p2 = await prisma.product.upsert({
    where: { slug: 'ethiopian-startup-handbook-ebook' },
    update: {},
    create: {
      name: 'The Ethiopian Startup Handbook: 0 to 1 Million ETB',
      slug: 'ethiopian-startup-handbook-ebook',
      description: 'Step-by-step practical eBook guiding Ethiopian entrepreneurs through business registration, licensing, Chapa payment setup, marketing on Telegram, and scaling operations.',
      shortDescription: 'Master starting and scaling a digital business in Ethiopia.',
      price: 350.00,
      compareAtPrice: 500.00,
      currency: 'ETB',
      type: ProductType.EBOOK,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      tags: ['eBook', 'Startup', 'Ethiopia', 'Business'],
      averageRating: 4.8,
      totalReviews: 8,
      totalSales: 64,
      categories: {
        create: [{ categoryId: catEbooks.id }],
      },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
            altText: 'Startup Handbook eBook Cover',
            isPrimary: true,
            sortOrder: 0,
          },
        ],
      },
      files: {
        create: [
          {
            fileName: 'Ethiopian_Startup_Handbook.pdf',
            fileSize: 8900000,
            mimeType: 'application/pdf',
            storagePath: 'products/Ethiopian_Startup_Handbook.pdf',
          },
        ],
      },
    },
  });

  const p3 = await prisma.product.upsert({
    where: { slug: 'complete-inventory-and-pos-excel-system' },
    update: {},
    create: {
      name: 'Complete Store Inventory & Sales Tracker (Excel System)',
      slug: 'complete-inventory-and-pos-excel-system',
      description: 'Professional inventory control system with barcode scanner support, reorder alerts, profit/loss dashboard, and multi-currency reporting.',
      shortDescription: 'Track inventory, daily sales, and profit margin seamlessly.',
      price: 750.00,
      compareAtPrice: 1200.00,
      currency: 'ETB',
      type: ProductType.BUSINESS_SYSTEM,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      tags: ['Inventory', 'POS', 'Excel', 'Store Management'],
      averageRating: 5.0,
      totalReviews: 15,
      totalSales: 110,
      categories: {
        create: [{ categoryId: catSystems.id }, { categoryId: catExcel.id }],
      },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
            altText: 'Inventory System Dashboard',
            isPrimary: true,
            sortOrder: 0,
          },
        ],
      },
      files: {
        create: [
          {
            fileName: 'Store_Inventory_POS_System_v2.xlsx',
            fileSize: 4100000,
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            storagePath: 'products/Store_Inventory_POS_System_v2.xlsx',
          },
        ],
      },
    },
  });

  console.log('✅ Created sample products');

  // 4. Create Coupons
  await prisma.coupon.upsert({
    where: { code: 'BRIGHT2026' },
    update: {},
    create: {
      code: 'BRIGHT2026',
      description: '15% discount on all digital products',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 15,
      minOrderAmount: 200,
      startsAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'WELCOME100' },
    update: {},
    create: {
      code: 'WELCOME100',
      description: '100 ETB flat discount for new customers',
      discountType: DiscountType.FIXED_AMOUNT,
      discountValue: 100,
      minOrderAmount: 300,
      startsAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('✅ Created promo coupons');
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
