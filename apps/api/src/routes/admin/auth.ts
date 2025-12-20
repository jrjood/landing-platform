import { Router } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../../config/database';
import { adminLoginSchema } from '../../schemas/validation';
import { generateToken } from '../../middleware/auth';
import { RowDataPacket } from 'mysql2';

const router = Router();

interface AdminUser extends RowDataPacket {
  id: number;
  email: string;
  password_hash: string;
  role: string;
}

// POST /api/admin/auth/login
router.post('/login', async (req, res) => {
  try {
    const validatedData = adminLoginSchema.parse(req.body);

    const [rows] = await pool.query<AdminUser[]>(
      'SELECT * FROM admin_users WHERE email = ?',
      [validatedData.email]
    );

    if (rows.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const admin = rows[0];
    const isValidPassword = await bcrypt.compare(
      validatedData.password,
      admin.password_hash
    );

    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = generateToken({
      userId: admin.id,
      email: admin.email,
      role: admin.role,
    });

    res.json({
      token,
      user: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);

    if (error.name === 'ZodError') {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors,
      });
      return;
    }

    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
