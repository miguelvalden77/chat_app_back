const router = require("express").Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const validator = require("validator")
const User = require("../models/User.model")
const isAuth = require("../middlewares/isAuth")


router.post("/register", async (req, res) => {

    const { name, email, password } = req.body
    console.log({ name, email, password })

    if (!name || !email || !password) return res.status(400).json("All fields are required")

    try {
        const user = await User.findOne({ email })

        if (user) return res.status(400).json("This email is already registered")
        if (!validator.isEmail(email)) return res.status(400).json("This email is not valid")

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const createdUser = await User.create({ email, password: hashedPassword, name })

        const token = jwt.sign({ _id: createdUser._id }, process.env.SECRET, { expiresIn: "3d" })

        res.json({ _id: createdUser._id, name, email, token })
    } catch (error) {
        res.status(500).json("Error")
        console.log(error)
    }

})


router.post("/login", async (req, res) => {

    const { email, password } = req.body

    if (!email || !password) return res.json("All fields are required")

    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json("Invalid password or email")

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) return res.status(400).json("Invalid password or email")

        const payload = { _id: user._id, name: user.name, email }
        const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "3d", algorithm: "HS256" })
        res.json({ token, payload })
    } catch (error) {
        res.status(500).json("Hay un problema Houston")
        console.log(error)
    }

})

router.get("/findUser/:_id", async (req, res) => {

    const { _id } = req.params
    if (!_id) return res.status(400).json("There is no Id provided")

    try {
        const foundUser = await User.findById(_id)
        if (!foundUser) return res.status(400).json("There is no users with the Id provided")

        res.json(foundUser)

    } catch (error) {
        res.status(500).json("Hay un error")
    }

})

router.get("/allUsers", async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)

    } catch (error) {
        res.status(500).json("Error at allUsers route")
        console.log(error)
    }
})

router.get("/verify", isAuth, async (req, res, next) => {
    try {
        res.json(req.payload)
    }
    catch (error) {
        next(error)
    }
})

module.exports = router