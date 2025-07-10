// pages/api/pengumuman.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client'; // Impor tipe Prisma
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

// --- Konfigurasi Multer ---
const uploadDir = path.join(process.cwd(), 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diizinkan!'));
    }
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

interface NextApiRequestWithFile extends NextApiRequest {
  file?: Express.Multer.File;
}

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (req: any, res: any, callback: (result: unknown) => void) => void
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// --- Handler API Utama ---
export default async function handler(req: NextApiRequestWithFile, res: NextApiResponse) {
  const { method } = req;

  try {
    if (method === 'GET') {
      const showAll = req.query.all === 'true';
      const today = new Date();
      const pengumuman = await prisma.pengumuman.findMany({
        where: showAll ? undefined : {
              aktif: true,
              tanggalMulai: { lte: today },
              tanggalBerakhir: { gte: today },
            },
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json(pengumuman);
    }

    if (method === 'POST' || method === 'PUT') {
      await runMiddleware(req, res, upload.single('gambar'));

      const body = req.body;
      const file = req.file;

      console.log("--- [DEBUG] BODY DITERIMA DARI FORM ---");
      console.log(body);

      if (!body.judul || !body.tanggalMulai || !body.tanggalBerakhir) {
        return res.status(400).json({ error: 'Judul dan tanggal wajib diisi' });
      }
      
      const partsMulai = body.tanggalMulai.split('-').map(Number);
      const partsBerakhir = body.tanggalBerakhir.split('-').map(Number);
      const mulai = new Date(Date.UTC(partsMulai[0], partsMulai[1] - 1, partsMulai[2]));
      const berakhir = new Date(Date.UTC(partsBerakhir[0], partsBerakhir[1] - 1, partsBerakhir[2]));

      if (isNaN(mulai.getTime()) || isNaN(berakhir.getTime())) {
        return res.status(400).json({ error: 'Format tanggal tidak valid setelah parsing manual' });
      }

      if (mulai >= berakhir) {
        return res.status(400).json({ error: 'Tanggal mulai harus sebelum tanggal berakhir' });
      }

      const aktif = String(body.aktif).toLowerCase() === 'true';
      
      console.log(`--- [DEBUG] STATUS AKTIF ---`);
      console.log(`String 'aktif' diterima: "${body.aktif}"`);
      console.log(`Dikonversi menjadi boolean: ${aktif}`);

      const dataToSave: Prisma.pengumumanCreateInput | Prisma.pengumumanUpdateInput = {
        judul: body.judul,
        isiPengumuman: body.isiPengumuman || '',
        targetUrl: body.targetUrl || '',
        tanggalMulai: mulai,
        tanggalBerakhir: berakhir,
        aktif: aktif,
      };

      if (file) {
        dataToSave.gambarUrl = `/uploads/${file.filename}`;
      } else if (method === 'PUT' && body.gambarUrl) {
        dataToSave.gambarUrl = body.gambarUrl;
      }
      
      if (method === 'POST') {
        console.log("--- [DEBUG] MENYIMPAN DATA BARU ---", dataToSave);
        const newPengumuman = await prisma.pengumuman.create({ 
            data: dataToSave as Prisma.pengumumanCreateInput 
        });
        return res.status(201).json(newPengumuman);
      }

      if (method === 'PUT') {
        const id = parseInt(body.id);
        if (!id) return res.status(400).json({ error: 'ID diperlukan untuk update' });

        if (file) {
          const existing = await prisma.pengumuman.findUnique({ where: { id }, select: { gambarUrl: true } });
          if (existing?.gambarUrl) {
            const oldPath = path.join(process.cwd(), 'public', existing.gambarUrl);
            if (fs.existsSync(oldPath)) {
              fs.unlink(oldPath, (err) => {
                if (err) console.error("Gagal menghapus file lama:", oldPath, err);
              });
            }
          }
        }
        
        console.log("--- [DEBUG] MEMPERBARUI DATA ---", dataToSave);
        const updated = await prisma.pengumuman.update({ 
            where: { id }, 
            data: dataToSave as Prisma.pengumumanUpdateInput 
        });
        return res.status(200).json(updated);
      }
    }

    if (method === 'DELETE') {
      const id = parseInt(req.query.id as string);
      if (!id) return res.status(400).json({ error: 'ID tidak valid' });

      const existing = await prisma.pengumuman.findUnique({ where: { id }, select: { gambarUrl: true } });
      await prisma.pengumuman.delete({ where: { id } });

      if (existing?.gambarUrl) {
        const filePath = path.join(process.cwd(), 'public', existing.gambarUrl);
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => { if (err) console.error("Gagal menghapus file:", filePath, err); });
        }
      }
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).json({ message: `Method ${method} Not Allowed` });

  } catch (error: unknown) {
    console.error('API Error:', error);
    if (error instanceof multer.MulterError) {
        return res.status(400).json({ error: error.message });
    }
    if (error instanceof Error) {
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
    return res.status(500).json({ error: 'An unexpected internal server error occurred' });
  } finally {
    await prisma.$disconnect();
  }
}
