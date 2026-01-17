import { Router } from "express"
import { prisma } from "../lib/prisma"
import { authMiddleware } from "../middleware/auth"
import fetch from "node-fetch"

const router = Router()

const SENTIMENT_API =
  "https://delia-ayu-nandhita-chatbot-sentimen.hf.space/sentiment/"

router.post("/", authMiddleware, async (req, res) => {
  try {
    const user = (req as any).user
    const { review_text } = req.body

    console.log("USER:", user)
    console.log("REVIEW TEXT:", review_text)

    if (!review_text || !review_text.trim()) {
      return res.status(400).json({ message: "Ulasan tidak boleh kosong" })
    }

    // ===== CALL HF =====
    const sentimentRes = await fetch(SENTIMENT_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: review_text }),
    })

    console.log("HF STATUS:", sentimentRes.status)

    const rawText = await sentimentRes.text()
    console.log("HF RAW RESPONSE:", rawText)

    if (!sentimentRes.ok) {
      throw new Error("HF ERROR")
    }

    const sentimentJson = JSON.parse(rawText)

    console.log("HF JSON:", sentimentJson)

    const sentiment = sentimentJson.sentiment?.label
    const confidence = sentimentJson.sentiment?.confidence

    console.log("PARSED:", sentiment, confidence)

    // ===== SAVE DB =====
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
