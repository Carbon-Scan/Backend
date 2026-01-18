import { Request, Response, NextFunction } from "express"

export function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = (req as any).user

  if (!user || !user.email) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const adminEmails = process.env.ADMIN_EMAILS
    ?.split(",")
    .map((e) => e.trim().toLowerCase())

  if (!adminEmails?.includes(user.email.toLowerCase())) {
    return res.status(403).json({
      message: "Akses ditolak (admin only)",
    })
  }

  next()
}
