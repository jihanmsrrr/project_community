// app/api/ruangbaca-materials/route.ts

import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Ambil query parameter 'kategori' dari URL
    const { searchParams } = new URL(request.url);
    const kategori = searchParams.get("kategori");

    // Siapkan klausa 'where' untuk Prisma
    const whereClause = kategori ? { kategori: kategori } : {};

    // Ambil data dari database dengan filter jika ada
    const materials = await prisma.reading_materials.findMany({
      where: whereClause,
      include: {
        uploader: {
          select: {
            nama_lengkap: true,
          },
        },
      },
      orderBy: {
        hits: 'desc', // Urutkan langsung dari database
      },
    });

    return NextResponse.json(materials);
  } catch (error) {
    console.error("API Error fetching reading materials:", error);
    return new NextResponse(
      JSON.stringify({ message: "Gagal mengambil data materi bacaan." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}