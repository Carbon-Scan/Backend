import { Request, Response, NextFunction } from "express"
import { supabase } from "../lib/supabase"

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const token = authHeader.replace("Bearer ", "")

  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user) {
    return res.status(401).json({ message: "Invalid token" })
  }

  ;(req as any).user = data.user
  next()
}
