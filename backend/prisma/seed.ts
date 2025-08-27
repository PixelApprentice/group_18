import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { config } from 'dotenv';

// Load environment variables
config();

const prisma = new PrismaClient();

async function main() {
  // Get passwords from environment variables ONLY
  const adminPassword = process.env.ADMIN_PASSWORD;
  const userPassword = process.env.USER_PASSWORD;
  // Also get seed emails and names from env (secure by avoiding hardcoded identifiers)
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@sekur.com';
  const adminName = process.env.ADMIN_NAME || 'Admin User';
  const userEmail = process.env.USER_EMAIL || 'user@sekur.com';
  const userName = process.env.USER_NAME || 'Regular User';
  
  if (!adminPassword || !userPassword) {
    console.error('❌ Error: ADMIN_PASSWORD and USER_PASSWORD must be set in .env file');
    console.error('Add these to your existing .env file:');
    console.error('ADMIN_PASSWORD="your-admin-password"');
    console.error('USER_PASSWORD="your-user-password"');
    process.exit(1);
  }
  
  // Create admin user
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: adminName,
      password: hashedAdminPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', adminUser);

  // Create regular user
  const hashedUserPassword = await bcrypt.hash(userPassword, 10);
  
  const regularUser = await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      email: userEmail,
      name: userName,
      password: hashedUserPassword,
      role: 'USER',
    },
  });

  console.log('Regular user created:', regularUser);
  
  console.log('\n⚠️  IMPORTANT: Change these passwords after first login!');
  console.log(`Admin: ${adminEmail}`);
  console.log(`User: ${userEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
