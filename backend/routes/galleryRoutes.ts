import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/gallery - Fetch all gallery posts
router.get('/', async (req, res) => {
    try {
        const posts = await prisma.gallery.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch gallery posts' });
    }
});

export default router;
