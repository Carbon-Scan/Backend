import { Router } from "express"
import { prisma } from "../lib/prisma"
import { authMiddleware } from "../middleware/auth"

const router = Router()

const SENTIMENT_API =
  "https://delia-ayu-nandhita-chatbot-sentimen.hf.space/sentiment"

router.post("/", authMiddleware, async (req, res) => {
  try {
    const user = (req as any).user
    const { review_text } = req.body

    if (!review_text || !review_text.trim()) {
      return res.status(400).json({ message: "Ulasan tidak boleh kosong" })
    }

    // ===== SENTIMENT ANALYSIS (FASTAPI SPACE) =====
    const sentimentRes = await fetch(SENTIMENT_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: review_text,
      }),
    })

    if (!sentimentRes.ok) {
      throw new Error("Sentiment service error")
    }

    const sentimentJson = await sentimentRes.json()

    const sentiment = sentimentJson.sentiment.label
    const confidence = sentimentJson.sentiment.confidence
    // =============================================

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        text: review_text,
        sentiment,
        confidence,
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
