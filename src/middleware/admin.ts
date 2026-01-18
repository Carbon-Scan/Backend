import { Request, Response, NextFunction } from "express"

export function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = (req as any).user

  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
    })
  }

  // ✅ OPSI 1: ADMIN BERDASARKAN EMAIL
  const adminEmail = process.env.ADMIN_EMAIL

  if (user.email !== adminEmail) {
    return res.status(403).json({
      message: "Akses ditolak (admin only)",
    })
  }

  next()
}
