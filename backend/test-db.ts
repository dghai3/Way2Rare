import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Testing DB connection...');
        await prisma.$connect();
        console.log('Connected successfully!');
        const count = await prisma.gallery.count();
        console.log(`Gallery count: ${count}`);
    } catch (e) {
        console.error('Connection failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
