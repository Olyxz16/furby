import express from 'express';
import { getAll } from '@/user/user.repository';

export const studentsRouter = express.Router();

function capitalize(s: string) {
  if (!s) return s;
  return s[0].toUpperCase() + s.slice(1).toLowerCase();
}

function nameFromMail(mail: string) {
  const local = (mail || '').split('@')[0] || '';
  // split on common separators
  const parts = local.split(/[._\-+]/).filter(Boolean);
  if (parts.length >= 2) {
    return { firstName: capitalize(parts[0]), lastName: capitalize(parts.slice(1).join(' ')) };
  }
  // fallback: try to split by camel case or use whole as first name
  return { firstName: capitalize(local), lastName: '' };
}

// Public endpoint: list students/users in a lightweight shape used by the frontend
studentsRouter.get('/', async (req, res) => {
  try {
    const users = await getAll();
    const mapped = users.map((u) => ({
      id: String(u.id),
      ...nameFromMail(u.mail),
    }));
    res.json(mapped);
  } catch (err: any) {
    console.error('GET /students error', err);
    res.status(500).json({ message: 'Failed to list students' });
  }
});

export default studentsRouter;
