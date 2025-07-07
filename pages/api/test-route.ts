// pages/api/test-route.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("--- DEBUG: Test route accessed! ---");
  res.status(200).json({ message: 'Test route is working!' });
}
