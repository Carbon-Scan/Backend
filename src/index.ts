import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import authRoutes from "./routes/auth"
import emissionRoutes from "./routes/emission"
import dashboardRoutes from "./routes/dashboard"
import historyRoutes from "./routes/history"
import profileRouter from "./routes/profile"



dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (_req, res) => {
  res.send("Backend Running")
})

app.use("/api/auth", authRoutes)

app.use("/api/emission", emissionRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/history", historyRoutes)
app.use("/api/profile", profileRouter)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
