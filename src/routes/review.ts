import { Router } from "express"
import { prisma } from "../lib/prisma"

const router = Router()

router.post("/", async (req, res) => {
  try {
    const { review_text, sentiment, confidence, email } = req.body

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

    // ===== SAVE DATABASE (ANONYMOUS) =====
    const review = await prisma.review.create({
      data: {
        text: review_text,
        sentiment,
        confidence,
        email: email || null, // optional
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
