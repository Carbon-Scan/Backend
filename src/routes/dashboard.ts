import { Router } from "express"
import { prisma } from "../lib/prisma"
import { authMiddleware } from "../middleware/auth"

const router = Router()

// GET /api/dashboard
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = (req as any).user

    const emissions = await prisma.emission.findMany({
      where: { userId: user.id },
      include: { details: true },
      orderBy: { createdAt: "asc" },
    })

    // TOTAL
    const totalEmisi = emissions.reduce(
      (sum, e) => sum + e.totalKarbon,
      0
    )

    // BULANAN
    const monthly: Record<string, number> = {}
    emissions.forEach(e => {
      const month = e.createdAt.toISOString().slice(0, 7)
      monthly[month] = (monthly[month] || 0) + e.totalKarbon
    })

    const monthlyEmissionData = Object.entries(monthly).map(
      ([month, emisi]) => ({ month, emisi })
    )

    // PER KATEGORI
    const category: Record<string, number> = {}
    emissions.forEach(e => {
      e.details.forEach(d => {
        category[d.kategori] =
          (category[d.kategori] || 0) + d.emisi
      })
    })

    const categoryEmissionData = Object.entries(category).map(
      ([name, value]) => ({ name, value })
    )

    res.json({
      totalEmisi,
      monthlyEmissionData,
      categoryEmissionData,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Gagal ambil dashboard" })
  }
})

export default router
