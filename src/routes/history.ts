import { Router } from "express"
import { prisma } from "../lib/prisma"
import { authMiddleware } from "../middleware/auth"

const router = Router()

// GET /api/history
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = (req as any).user

    const history = await prisma.emission.findMany({
      where: { userId: user.id },
      include: { details: true },
      orderBy: { createdAt: "desc" },
    })

    res.json(history)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Gagal ambil riwayat emisi" })
  }
})

export default router
