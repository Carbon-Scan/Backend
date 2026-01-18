import { Router } from "express"
import jwt from "jsonwebtoken"
import { prisma } from "../lib/prisma"
import { authAdminMiddleware } from "../middleware/authAdminMiddleware"
import { adminMiddleware } from "../middleware/adminMiddleware"

const router = Router()

// =====================
// ADMIN LOGIN
// =====================
router.post("/login", (req, res) => {
  const { email, password } = req.body

  const adminEmails = process.env.ADMIN_EMAILS
    ?.split(",")
    .map((e) => e.trim().toLowerCase())

  if (
    !adminEmails?.includes(email.toLowerCase()) ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      message: "Email atau password admin salah",
    })
  }

  const token = jwt.sign(
    { email, role: "admin" },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  )

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })

  res.json({ message: "Login admin berhasil" })
})

// =====================
// ADMIN LOGOUT
// =====================
router.post("/logout", (_req, res) => {
  res.clearCookie("token")
  res.json({ message: "Logout berhasil" })
})
// =====================
// ADMIN REVIEW SUMMARY (FINAL & DINAMIS)
// =====================
router.get(
  "/review/summary",
  authAdminMiddleware,
  adminMiddleware,
  async (_req, res) => {
    try {
      // total semua review
      const total = await prisma.review.count()

      // ambil data asli & kelompokkan
      const grouped = await prisma.review.groupBy({
        by: ["sentiment"],
        _count: { sentiment: true },
      })

      let positive = 0
      let negative = 0
      let neutral = 0

      grouped.forEach((item) => {
        const value = item.sentiment?.toLowerCase().trim()

        if (["positive", "positif"].includes(value)) {
          positive += item._count.sentiment
        } else if (["negative", "negatif"].includes(value)) {
          negative += item._count.sentiment
        } else if (["neutral", "netral"].includes(value)) {
          neutral += item._count.sentiment
        }
      })

      res.json({
        total,
        positive,
        negative,
        neutral,
        unclassified: total - (positive + negative + neutral),
      })
    } catch (error) {
      console.error("ADMIN SENTIMENT ERROR:", error)
      res.status(500).json({
        message: "Gagal mengambil data sentimen",
      })
    }
  }
)
router.get(
  "/review",
  authAdminMiddleware,
  adminMiddleware,
  async (_req, res) => {
    try {
      const reviews = await prisma.review.findMany({
        orderBy: {
          created_at: "desc", // pakai nama kolom ASLI DB
        },
        select: {
          id: true,
          text: true,
          sentiment: true,
          confidence: true,
          userId: true,
          created_at: true,
        },
      })

      res.json({
        total: reviews.length,
        reviews,
      })
    } catch (error) {
      console.error("ADMIN REVIEW LIST ERROR:", error)
      res.status(500).json({
        message: "Gagal mengambil data review",
      })
    }
  }
)


export default router
