import { Router } from "express"
import { prisma } from "../lib/prisma"
import { authMiddleware } from "../middleware/auth"
import { adminMiddleware } from "../middleware/admin"

const router = Router()

router.get(
  "/review/summary",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const total = await prisma.review.count()

      const positive = await prisma.review.count({
        where: { sentiment: "positive" },
      })

      const negative = await prisma.review.count({
        where: { sentiment: "negative" },
      })

      const neutral = await prisma.review.count({
        where: { sentiment: "neutral" },
      })

      res.json({
        total,
        positive,
        negative,
        neutral,
      })
    } catch (error) {
      console.error("ADMIN SENTIMENT ERROR:", error)
      res.status(500).json({
        message: "Gagal mengambil data sentimen",
      })
    }
  }
)

export default router
