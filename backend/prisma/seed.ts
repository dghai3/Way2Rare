import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PROJECT_ID = "rwccduyhfvbsvogsheth";
const BUCKET_NAME = "product images"; // Note: Space in bucket name
const BASE_URL = `https://${PROJECT_ID}.supabase.co/storage/v1/object/public/${encodeURIComponent(BUCKET_NAME)}/product_pics`;

const products = [
    {
        name: "Way2Rare Zip Hoodie",
        description: "Zip Hoodie with Way2Rare Logo",
        price: 60,
        images: [`${BASE_URL}/NavyZip.jpeg`], // Placeholder for now, will need real URLs later
        category: "Hoodies",
        sizes: ["S", "M", "L", "XL", "XXL"],
        isCurrent: true,
    },
    {
        name: "Way2Rare Summer Tee",
        description: "Lightweight summer t-shirt with Way2Rare Logo",
        price: 25,
        images: [`${BASE_URL}/SummerTee.png`],
        category: "T-Shirts",
        sizes: ["S", "M", "L", "XL", "XXL"],
        isCurrent: false,
    },
    {
        name: "Way2Rare Pullover Hoodie",
        description: "Pullover Hoodie with Bubble Way2Rare Logo",
        price: 50,
        images: [`${BASE_URL}/Pullover.jpeg`],
        category: "Hoodies",
        sizes: ["S", "M", "L", "XL", "XXL"],
        isCurrent: false,
    },
    {
        name: "Way2Rare Retro Zip Hoodie",
        description: "Retro Style Zip Hoodie with Way2Rare Logo",
        price: 65,
        images: [`${BASE_URL}/NavyZip.jpeg`],
        category: "Hoodies",
        sizes: ["S", "M", "L", "XL", "XXL"],
        isCurrent: false,
    },
    {
        name: "Way2Rare Logo Sweatpants",
        description: "Comfortable Sweatpants with Way2Rare Logo",
        price: 40,
        images: [`${BASE_URL}/NavyZip.jpeg`],
        category: "Bottoms",
        sizes: ["S", "M", "L", "XL", "XXL"],
        isCurrent: false,
    }
];

const galleryPosts = [
    { image: `${BASE_URL.replace('product_pics', 'model_pics')}/IMG_1816.JPG`, handle: "@slattinson" },
    { image: `${BASE_URL.replace('product_pics', 'model_pics')}/IMG_2078.JPG`, handle: "@mrrvin.whispr" },
    { image: `${BASE_URL.replace('product_pics', 'model_pics')}/IMG_2298.JPG`, handle: "@phucbui0" },
    { image: `${BASE_URL.replace('product_pics', 'model_pics')}/IMG_2353.JPG`, handle: "@louis.jndr" },
    { image: `${BASE_URL.replace('product_pics', 'model_pics')}/IMG_2393.JPG`, handle: "@way2rare" },
    { image: `${BASE_URL.replace('product_pics', 'model_pics')}/IMG_3137.jpeg`, handle: "@rare.collective" },
    { image: `${BASE_URL.replace('product_pics', 'model_pics')}/IMG_3334.jpeg`, handle: "@urban.archive" },
    { image: `${BASE_URL.replace('product_pics', 'model_pics')}/IMG_3458.jpeg`, handle: "@latecheckout" },
];

async function main() {
    console.log('Start seeding ...');

    // Clear existing data
    await prisma.product.deleteMany({});
    await prisma.gallery.deleteMany({});

    // Seed Products
    for (const p of products) {
        const product = await prisma.product.create({
            data: p,
        });
        console.log(`Created product with id: ${product.id}`);
    }

    // Seed Gallery
    for (const post of galleryPosts) {
        await prisma.gallery.create({
            data: post,
        });
        console.log(`Created gallery post for ${post.handle}`);
    }
    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });