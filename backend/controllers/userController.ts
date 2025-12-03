import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const createToken = (id: number) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '3d' });
}

// Route for user login
const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            res.json({ success: false, message: "User doesn't exist" });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user.id);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: (error as Error).message });
    }
}

// Route for user registration
const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists) {
            res.json({ success: false, message: "User already exists" });
            return;
        }

        // Validate email format & strong password
        if (!validator.isEmail(email)) {
            res.json({ success: false, message: "Please enter a valid email" });
            return;
        }
        if (password.length < 8) {
            res.json({ success: false, message: "Please enter a strong password" });
            return;
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        const token = createToken(newUser.id);
        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: (error as Error).message });
    }
}

// Route for admin login
const adminLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET || 'default_secret');
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: (error as Error).message });
    }
}

export { loginUser, registerUser, adminLogin };
