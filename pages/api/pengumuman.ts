import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    if (method === 'GET') {
      const showAll = req.query.all === 'true';
      const today = new Date();
      const pengumuman = await prisma.pengumuman.findMany({
        where: showAll
          ? undefined
          : {
              aktif: true,
              tanggalMulai: { lte: today },
              tanggalBerakhir: { gte: today },
            },
        orderBy: {
          tanggalMulai: 'desc',
        },
      });
      return res.status(200).json(pengumuman);
    }

    if (method === 'POST') {
      const body = req.body;
      if (!body.judul || !body.tanggalMulai || !body.tanggalBerakhir) {
        return res.status(400).json({ error: 'Judul dan tanggal wajib diisi' });
      }

      const mulai = new Date(body.tanggalMulai);
      const berakhir = new Date(body.tanggalBerakhir);
      if (mulai >= berakhir) {
        return res.status(400).json({ error: 'Tanggal mulai harus sebelum tanggal berakhir' });
      }

      const newPengumuman = await prisma.pengumuman.create({
        data: {
          judul: body.judul,
          gambarUrl: body.gambarUrl || '',
          isiPengumuman: body.isiPengumuman || '',
          targetUrl: body.targetUrl || '',
          tanggalMulai: mulai,
          tanggalBerakhir: berakhir,
          aktif: body.aktif ?? true,
        },
      });
      return res.status(201).json(newPengumuman);
    }

    if (method === 'DELETE') {
      const id = parseInt(req.query.id as string);
      if (!id) return res.status(400).json({ error: 'ID tidak valid' });
      await prisma.pengumuman.delete({ where: { id } });
      return res.status(200).json({ success: true });
    }

    if (method === 'PUT') {
      const body = req.body;
      if (!body.id) return res.status(400).json({ error: 'ID diperlukan' });

      const mulai = new Date(body.tanggalMulai);
      const berakhir = new Date(body.tanggalBerakhir);
      if (mulai >= berakhir) {
        return res.status(400).json({ error: 'Tanggal mulai harus sebelum tanggal berakhir' });
      }

      const updated = await prisma.pengumuman.update({
        where: { id: body.id },
        data: {
          judul: body.judul,
          gambarUrl: body.gambarUrl,
          isiPengumuman: body.isiPengumuman,
          targetUrl: body.targetUrl,
          tanggalMulai: mulai,
          tanggalBerakhir: berakhir,
          aktif: body.aktif,
        },
      });
      return res.status(200).json(updated);
    }

    if (method === 'PATCH') {
      const { id, aktif } = req.body;
      if (typeof id !== 'number') return res.status(400).json({ error: 'ID tidak valid' });

      const updated = await prisma.pengumuman.update({
        where: { id },
        data: { aktif },
      });

      return res.status(200).json(updated);
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}
