import { Router } from "express"
import { supabase } from "../lib/supabase"   
import { authMiddleware } from "../middleware/auth"


const router = Router()

// REGISTER
router.post("/register", async (req, res) => {
  const { email, password, name } = req.body

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  })

  if (error) {
    return res.status(400).json({ message: error.message })
  }

  res.json({
    message: "Register success",
    user: data.user
  })
})

// LOGIN EMAIL
router.post("/login", async (req, res) => {
  const { email, password } = req.body

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    return res.status(401).json({ message: error.message })
  }

  res.json({
    message: "Login success",
    access_token: data.session?.access_token,
    user: data.user
  })
})

// LOGIN GOOGLE
router.get("/login/google", async (_, res) => {
  const { data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "https://carbonscan-api.vercel.app/auth/callback"
    }
  })

  res.redirect(data.url!)
})

// USER LOGIN 
router.get("/me", authMiddleware, (req, res) => {
  const user = (req as any).user

  res.json({
    id: user.id,
    email: user.email,
    name: user.user_metadata?.name
  })
})

// CALLBACK GOOGLE
router.get("/auth/callback", async (req, res) => {
  const { code } = req.query

  const { data, error } = await supabase.auth.exchangeCodeForSession(code as string)

  if (error) {
    return res.status(400).json({ message: error.message })
  }

  res.json({
    message: "Google login success",
    access_token: data.session?.access_token,
    user: data.user
  })
})

export default router
