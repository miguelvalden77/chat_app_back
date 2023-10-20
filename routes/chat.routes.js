const Chat = require("../models/Chat.model")
const User = require("../models/User.model")

const router = require("express").Router()


router.post("/createChat", async (req, res) => {

    const { userId, otherId } = req.body
    if (!userId || !otherId) return res.status(400).json("No Ids provided")

    try {
        const chat = await Chat.findOne({ members: { $all: [userId, otherId] } })
        if (chat) return res.status(400).json("Ya existe un chat")

        const newChat = await Chat.create({ members: [userId, otherId] })
        res.json(newChat)

    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }

})

router.get("/findPotential/:userId", async (req, res) => {

    const { userId } = req.params
    if (!userId) return res.status(400).json("No hay id")
    console.log({ userId })

    try {
        const users = await User.find().select("name")

        const potentialChats = users.filter((user) => user._id != userId)

        res.json(potentialChats)

    } catch (error) {
        console.log(error)
    }

})

router.get("/findUserChats/:userId", async (req, res) => {

    const { userId } = req.params
    if (!userId) return res.status(400).json("No hay id del usuario")

    try {
        const chats = await Chat.find({ members: { $in: [userId] } })
        res.json(chats)

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }

})

router.get("/findChat/:userId/:otherId", async (req, res) => {

    const { userId, otherId } = req.params
    if (!userId || !otherId) return res.status(400).json("No hay Ids")

    try {
        const chat = await Chat.findOne({ members: { $all: [userId, otherId] } })
        res.json(chat)

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }

})

module.exports = router