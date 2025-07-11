import { getToken } from 'next-auth/jwt';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  const payload = await getToken({
    req,
    secret: process.env.JWT_SECRET,
  });

  if (!payload) {
    console.warn('[API] No payload found');
    return new Response('Unauthorized', { status: 401 });
  }

  const signed = jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: 'HS256',
  });

  const parts = signed.split('.');
  console.log('[API] token split count:', parts.length);
  console.log('[API] token:', signed);

  if (parts.length !== 3) {
    console.warn('[API] Still malformed');
    return new Response('Invalid token', { status: 400 });
  }

  return Response.json({ token: signed });
}
