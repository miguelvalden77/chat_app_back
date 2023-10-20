// Requires
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()

// app
const app = express()

// Middlewares
app.use(express.json())
app.use(cors({
    origin: "*"
}))
app.use(express.urlencoded({ extended: false }));

// Routes
const userRoutes = require("./routes/user.routes")
app.use("/api/user", userRoutes)

const chatRoutes = require("./routes/chat.routes")
app.use("/api/chat", chatRoutes)

const messageRoutes = require("./routes/message.routes")
app.use("/api/message", messageRoutes)

// Listen
const port = process.env.PORT || 5000

app.listen(port, (req, res) => {
    console.log(`Listening on port ${port}`)
})

// MongoDB
mongoose.connect(process.env.URI)
    .then((response) => console.log("Successfully connection to MongoDB"))
    .catch((error) => console.log(error.message))
