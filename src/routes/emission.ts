import { Router } from "express"
import { prisma } from "../lib/prisma"
import { authMiddleware } from "../middleware/auth"

const router = Router()

// ===============================
// SIMPAN EMISI
// ===============================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const user = (req as any).user
    const { total_karbon, detail } = req.body

    if (
      typeof total_karbon !== "number" ||
      !Array.isArray(detail)
    ) {
      return res.status(400).json({ message: "Payload tidak valid" })
    }

    const emission = await prisma.emission.create({
      data: {
        userId: user.id,
        totalKarbon: total_karbon,
        details: {
          create: detail.map((d: any) => ({
            produk: String(d.produk),
            emisi: Number(d.emisi),
            kategori: String(d.kategori),
          })),
        },
      },
    })

    res.json({
      success: true,
      emissionId: emission.id,
    })
  } catch (err) {
    console.error("EMISSION ERROR:", err)
    res.status(500).json({ message: "Gagal menyimpan emisi" })
  }
})

// ===============================
// GET RIWAYAT EMISI USER
// ===============================
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const user = (req as any).user

    const history = await prisma.emission.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        totalKarbon: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    res.json(history)
  } catch (err) {
    console.error("HISTORY ERROR:", err)
    res.status(500).json({ message: "Gagal mengambil riwayat" })
  }
})

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const user = (req as any).user
    const id = String(req.params.id) // 🔥 FIX TS ERROR

    const emission = await prisma.emission.findFirst({
      where: {
        id,
        userId: user.id,
      },
      select: {
        id: true,
        totalKarbon: true,
        createdAt: true,
        details: {
          select: {
            produk: true,
            emisi: true,
            kategori: true,
          },
        },
      },
    })

    if (!emission) {
      return res.status(404).json({ message: "Data tidak ditemukan" })
    }

    res.json(emission)
  } catch (err) {
    console.error("DETAIL HISTORY ERROR:", err)
    res.status(500).json({ message: "Gagal mengambil detail riwayat" })
  }
})


export default router
