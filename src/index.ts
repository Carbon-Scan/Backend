import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth"
import emissionRoutes from "./routes/emission"
import dashboardRoutes from "./routes/dashboard"
import historyRoutes from "./routes/history"
import profileRouter from "./routes/profile"
import reviewRoutes from "./routes/review"
import adminRoutes from "./routes/admin"

dotenv.config()

const app = express()

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://carbonscan-api.vercel.app",
    ],
    credentials: true,
  })
)


app.use(express.json())
app.use(cookieParser()) 

app.get("/", (_req, res) => {
  res.send("Backend Running")
})

app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/emission", emissionRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/history", historyRoutes)
app.use("/api/profile", profileRouter)
app.use("/api/review", reviewRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
