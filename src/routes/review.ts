import { Router } from "express"
import { prisma } from "../lib/prisma"
import { authMiddleware } from "../middleware/auth"

const router = Router()

router.post("/", authMiddleware, async (req, res) => {
  try {
    const user = (req as any).user
    const { review_text, sentiment, confidence } = req.body

    // ===== VALIDASI INPUT =====
    if (!review_text || !review_text.trim()) {
      return res.status(400).json({ message: "Ulasan tidak boleh kosong" })
    }

    if (!sentiment || typeof confidence !== "number") {
      return res.status(400).json({
        message: "Sentiment dan confidence wajib dikirim",
      })
    }

    if (confidence < 0 || confidence > 1) {
      return res.status(400).json({
        message: "Confidence harus antara 0 dan 1",
      })
    }

    const review = await prisma.review.create({
      data: {
        text: review_text,
        sentiment,
        confidence,
        userId: user.id, // 🔥 WAJIB
      },
    })

    return res.status(201).json({
      message: "Ulasan berhasil disimpan",
      data: review,
    })
  } catch (error) {
    console.error("REVIEW ERROR:", error)
    return res.status(500).json({
      message: "Gagal menyimpan ulasan",
    })
  }
})

export default router
