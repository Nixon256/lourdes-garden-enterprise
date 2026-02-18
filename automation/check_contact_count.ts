import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
    try {
        const count: number = await prisma.contactSubmission.count();
        console.log('SUBMISSION_COUNT:' + count);
    } catch (error) {
        console.error(error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
