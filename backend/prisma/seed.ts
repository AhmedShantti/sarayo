/**
 * Database seed for the Sarayo Alwadiya chips store.
 *
 * Run with:  npm run prisma:seed   (or `npx prisma db seed`)
 *
 * Seeds: 1 admin, 3 customers (with addresses), 5 categories, 20 products,
 * 10 orders across statuses, and sample reviews. Idempotent-ish: it wipes the
 * relevant tables first so re-running gives a clean, predictable dataset.
 */
import 'dotenv/config';
import {
  Category,
  OrderStatus,
  PaymentStatus,
  PrismaClient,
  Product,
  Role,
  TransactionStatus,
  User,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const BCRYPT_ROUNDS = 12;

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || `item-${Math.random().toString(36).slice(2, 8)}`
  );
}

async function clean() {
  // Order matters due to FK constraints.
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.review.deleteMany();
  await prisma.address.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  console.log('🌱 Seeding database...');
  await clean();

  // ── Users ──────────────────────────────────────
  const adminPassword = await bcrypt.hash('Admin123!', BCRYPT_ROUNDS);
  const customerPassword = await bcrypt.hash('Customer123!', BCRYPT_ROUNDS);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@chipstore.com',
      password: adminPassword,
      name: 'Store Admin',
      nameAr: 'مدير المتجر',
      role: Role.ADMIN,
      phone: '+201000000000',
    },
  });

  const customerSeeds = [
    { email: 'mariam.h@example.com', name: 'Mariam Hassan', nameAr: 'مريم حسن', phone: '+201001112222' },
    { email: 'omar.s@example.com', name: 'Omar Saleh', nameAr: 'عمر صالح', phone: '+201003334444' },
    { email: 'layla.a@example.com', name: 'Layla Adel', nameAr: 'ليلى عادل', phone: '+201005556666' },
  ];

  const customers: User[] = [];
  for (const c of customerSeeds) {
    const user = await prisma.user.create({
      data: {
        email: c.email,
        password: customerPassword,
        name: c.name,
        nameAr: c.nameAr,
        role: Role.CUSTOMER,
        phone: c.phone,
        cart: { create: {} },
        addresses: {
          create: {
            label: 'Home',
            street: '12 Tahrir Street, Apt 4',
            city: 'Cairo',
            state: 'Cairo Governorate',
            country: 'Egypt',
            postalCode: '11511',
            phone: c.phone,
            isDefault: true,
          },
        },
      },
    });
    customers.push(user);
  }

  console.log(`✔ Created ${customers.length + 1} users`);

  // ── Categories ─────────────────────────────────
  const categorySeeds = [
    { name: 'Classic', nameAr: 'كلاسيك', description: 'Timeless salted favourites' },
    { name: 'BBQ', nameAr: 'باربكيو', description: 'Smoky barbecue flavours' },
    { name: 'Spicy', nameAr: 'حار', description: 'Bold, fiery picks' },
    { name: 'Cheese', nameAr: 'جبنة', description: 'Rich cheesy crunch' },
    { name: 'Limited Edition', nameAr: 'إصدار محدود', description: 'Seasonal & special flavours' },
  ];

  const categories: Category[] = [];
  for (const cat of categorySeeds) {
    const created = await prisma.category.create({
      data: { ...cat, slug: slugify(cat.name) },
    });
    categories.push(created);
  }
  const catBy = (name: string) => categories.find((c) => c.name === name)!;
  console.log(`✔ Created ${categories.length} categories`);

  // ── Products (20) ──────────────────────────────
  const productSeeds = [
    { sku: 'SAR-001', name: 'Cheddar & Sour Cream', nameAr: 'شيدر وكريمة حامضة', cat: 'Cheese', price: 18, stock: 124, flavor: 'cheese', featured: true, img: '/lays-cheddar.png' },
    { sku: 'SAR-002', name: 'Classic Salted', nameAr: 'كلاسيك بالملح', cat: 'Classic', price: 18, stock: 86, flavor: 'salt-vinegar', featured: true, img: '/lays-classic.png' },
    { sku: 'SAR-003', name: 'Salt & Vinegar', nameAr: 'ملح وخل', cat: 'Classic', price: 18, stock: 142, flavor: 'salt-vinegar', featured: true, img: '/lays-salt-vinegar.png' },
    { sku: 'SAR-004', name: 'Wavy Original', nameAr: 'مموج كلاسيك', cat: 'Classic', price: 18, stock: 48, flavor: 'salt-vinegar', img: '/lays-wavy.png' },
    { sku: 'SAR-005', name: 'Indian Magic Masala', nameAr: 'ماسالا هندي', cat: 'Spicy', price: 18, stock: 12, flavor: 'chili', img: '/lays-indian.png' },
    { sku: 'SAR-006', name: 'Cheddar Classic', nameAr: 'شيدر كلاسيك', cat: 'Cheese', price: 18, stock: 76, flavor: 'cheese', featured: true, img: '/lays-cheddar.png' },
    { sku: 'SAR-007', name: 'Wavy BBQ', nameAr: 'مموج باربكيو', cat: 'BBQ', price: 18, stock: 0, flavor: 'bbq', img: '/lays-wavy.png' },
    { sku: 'SAR-008', name: 'Tangy Salt & Vinegar', nameAr: 'ملح وخل لاذع', cat: 'Classic', price: 18, stock: 96, flavor: 'salt-vinegar', img: '/lays-salt-vinegar.png' },
    { sku: 'SAR-009', name: 'Wavy Cheddar Ranch', nameAr: 'مموج شيدر رانش', cat: 'Cheese', price: 18, stock: 34, flavor: 'cheese', img: '/lays-wavy.png' },
    { sku: 'SAR-010', name: 'Sour Cream & Onion', nameAr: 'كريمة حامضة وبصل', cat: 'Classic', price: 18, stock: 8, flavor: 'sour-cream', img: '/lays-cheddar.png' },
    { sku: 'SAR-011', name: 'Smoky BBQ Ribs', nameAr: 'ضلوع باربكيو مدخنة', cat: 'BBQ', price: 20, stock: 60, flavor: 'bbq', featured: true, img: '/lays-wavy.png' },
    { sku: 'SAR-012', name: 'Hot Chili Pepper', nameAr: 'فلفل حار', cat: 'Spicy', price: 20, stock: 54, flavor: 'chili', img: '/lays-indian.png' },
    { sku: 'SAR-013', name: 'Flamin’ Sweet Chili', nameAr: 'تشيلي حلو حار', cat: 'Spicy', price: 20, stock: 40, flavor: 'sweet-chili', img: '/lays-indian.png' },
    { sku: 'SAR-014', name: 'Double Cheese', nameAr: 'دبل تشيز', cat: 'Cheese', price: 20, stock: 70, flavor: 'cheese', img: '/lays-cheddar.png' },
    { sku: 'SAR-015', name: 'Tandoori Twist', nameAr: 'تندوري تويست', cat: 'Spicy', price: 20, stock: 22, flavor: 'chili', img: '/lays-indian.png' },
    { sku: 'SAR-016', name: 'Classic Large Pack', nameAr: 'كلاسيك عبوة كبيرة', cat: 'Classic', price: 28, stock: 110, flavor: 'salt-vinegar', weight: '200g', img: '/lays-classic.png' },
    { sku: 'SAR-017', name: 'BBQ Deluxe', nameAr: 'باربكيو ديلوكس', cat: 'BBQ', price: 22, stock: 38, flavor: 'bbq', img: '/lays-wavy.png' },
    { sku: 'SAR-018', name: 'Truffle & Parmesan', nameAr: 'ترافل وبارميزان', cat: 'Limited Edition', price: 32, stock: 18, flavor: 'cheese', featured: true, img: '/lays-cheddar.png' },
    { sku: 'SAR-019', name: 'Mango Chili Crunch', nameAr: 'مانجو تشيلي', cat: 'Limited Edition', price: 32, stock: 15, flavor: 'sweet-chili', img: '/lays-indian.png' },
    { sku: 'SAR-020', name: 'Sea Salt & Lime', nameAr: 'ملح بحري وليمون', cat: 'Limited Edition', price: 30, stock: 25, flavor: 'salt-vinegar', img: '/lays-salt-vinegar.png' },
  ];

  const products: Product[] = [];
  for (const p of productSeeds) {
    const created = await prisma.product.create({
      data: {
        sku: p.sku,
        name: p.name,
        nameAr: p.nameAr,
        slug: slugify(p.name),
        description: `${p.name} — crunchy, flavorful, irresistible.`,
        descriptionAr: `${p.nameAr} — مقرمشة، لذيذة، لا تُقاوم.`,
        price: p.price,
        stock: p.stock,
        images: [p.img],
        flavor: p.flavor,
        weight: p.weight ?? '113g',
        isActive: true,
        isFeatured: p.featured ?? false,
        categoryId: catBy(p.cat).id,
      },
    });
    products.push(created);
  }
  console.log(`✔ Created ${products.length} products`);

  // ── Orders (10, varied statuses) ───────────────
  const productBySku = (sku: string) => products.find((p) => p.sku === sku)!;
  const orderPlans: Array<{
    customer: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    lines: Array<{ sku: string; qty: number }>;
  }> = [
    { customer: 0, status: OrderStatus.CONFIRMED, paymentStatus: PaymentStatus.PAID, lines: [{ sku: 'SAR-001', qty: 2 }, { sku: 'SAR-003', qty: 1 }] },
    { customer: 1, status: OrderStatus.SHIPPED, paymentStatus: PaymentStatus.PAID, lines: [{ sku: 'SAR-002', qty: 2 }] },
    { customer: 2, status: OrderStatus.DELIVERED, paymentStatus: PaymentStatus.PAID, lines: [{ sku: 'SAR-006', qty: 5 }] },
    { customer: 0, status: OrderStatus.PENDING, paymentStatus: PaymentStatus.PENDING, lines: [{ sku: 'SAR-005', qty: 1 }] },
    { customer: 1, status: OrderStatus.PROCESSING, paymentStatus: PaymentStatus.PAID, lines: [{ sku: 'SAR-011', qty: 4 }] },
    { customer: 2, status: OrderStatus.REFUNDED, paymentStatus: PaymentStatus.REFUNDED, lines: [{ sku: 'SAR-012', qty: 2 }] },
    { customer: 0, status: OrderStatus.DELIVERED, paymentStatus: PaymentStatus.PAID, lines: [{ sku: 'SAR-018', qty: 1 }, { sku: 'SAR-014', qty: 2 }] },
    { customer: 1, status: OrderStatus.CONFIRMED, paymentStatus: PaymentStatus.PAID, lines: [{ sku: 'SAR-003', qty: 3 }] },
    { customer: 2, status: OrderStatus.CANCELLED, paymentStatus: PaymentStatus.FAILED, lines: [{ sku: 'SAR-007', qty: 1 }] },
    { customer: 0, status: OrderStatus.SHIPPED, paymentStatus: PaymentStatus.PAID, lines: [{ sku: 'SAR-016', qty: 2 }, { sku: 'SAR-020', qty: 1 }] },
  ];

  const FREE_SHIPPING_THRESHOLD = 50;
  const SHIPPING_COST = 5.99;
  const TAX_RATE = 0.1;
  const round = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

  let orderNum = 10500;
  for (const plan of orderPlans) {
    const customer = customers[plan.customer];
    const items = plan.lines.map((l) => {
      const product = productBySku(l.sku);
      return {
        product,
        quantity: l.qty,
        price: Number(product.price),
      };
    });
    const subtotal = round(items.reduce((s, i) => s + i.price * i.quantity, 0));
    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const tax = round(subtotal * TAX_RATE);
    const total = round(subtotal + shippingCost + tax);

    const order = await prisma.order.create({
      data: {
        orderNumber: `#${orderNum++}`,
        userId: customer.id,
        status: plan.status,
        paymentStatus: plan.paymentStatus,
        subtotal,
        shippingCost,
        tax,
        total,
        shippingAddress: {
          fullName: customer.name,
          email: customer.email,
          phone: customer.phone,
          street: '12 Tahrir Street, Apt 4',
          city: 'Cairo',
          state: 'Cairo Governorate',
          country: 'Egypt',
          postalCode: '11511',
        },
        items: {
          create: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
            price: i.price,
            productName: i.product.name,
            productImage: i.product.images[0] ?? null,
          })),
        },
      },
    });

    // Create a Payment record for paid / refunded orders.
    if (plan.paymentStatus === PaymentStatus.PAID || plan.paymentStatus === PaymentStatus.REFUNDED) {
      await prisma.payment.create({
        data: {
          orderId: order.id,
          paymobOrderId: String(900000 + orderNum),
          paymobTransactionId: String(800000 + orderNum),
          amount: total,
          currency: 'EGP',
          status:
            plan.paymentStatus === PaymentStatus.REFUNDED
              ? TransactionStatus.REFUNDED
              : TransactionStatus.SUCCESS,
        },
      });
    }
  }
  console.log(`✔ Created ${orderPlans.length} orders`);

  // ── Reviews ────────────────────────────────────
  const reviewSeeds = [
    { customer: 0, sku: 'SAR-001', rating: 5, comment: 'Absolutely addictive!' },
    { customer: 1, sku: 'SAR-001', rating: 4, comment: 'Great cheddar flavour.' },
    { customer: 2, sku: 'SAR-003', rating: 5, comment: 'The salt & vinegar is perfect.' },
    { customer: 0, sku: 'SAR-006', rating: 4, comment: 'Crunchy and tasty.' },
    { customer: 1, sku: 'SAR-011', rating: 5, comment: 'Best BBQ chips I have had.' },
    { customer: 2, sku: 'SAR-018', rating: 5, comment: 'Truffle is a treat.' },
  ];
  for (const r of reviewSeeds) {
    await prisma.review.create({
      data: {
        userId: customers[r.customer].id,
        productId: productBySku(r.sku).id,
        rating: r.rating,
        comment: r.comment,
        isVerified: true,
      },
    });
  }
  console.log(`✔ Created ${reviewSeeds.length} reviews`);

  console.log('\n✅ Seed complete.');
  console.log('   Admin    → admin@chipstore.com / Admin123!');
  console.log('   Customer → mariam.h@example.com / Customer123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
