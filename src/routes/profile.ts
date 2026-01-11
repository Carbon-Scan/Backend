import { Router } from "express"
import { authMiddleware } from "../middleware/auth"

const router = Router()

// ===============================
// GET PROFILE (DARI TOKEN)
// ===============================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = (req as any).user

    // user DIDAPAT dari token (Supabase / JWT)
    res.json({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || "",
    })
  } catch (err) {
    console.error("PROFILE GET ERROR:", err)
    res.status(500).json({ message: "Gagal mengambil profil" })
  }
})

// ===============================
// UPDATE PROFILE (OPTIONAL)
// ===============================
// ⚠️ Karena tidak ada tabel user di Prisma,
// update hanya bisa ke AUTH PROVIDER (mis. Supabase)
router.put("/", authMiddleware, async (_req, res) => {
  return res.status(501).json({
    message:
      "Update profile belum tersedia karena user tidak disimpan di database",
  })
})

export default router
