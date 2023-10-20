const Message = require("../models/Message.model")
const router = require("express").Router()


router.post("/createMessage", async (req, res) => {

    const { chatId, senderId, text } = req.body
    if (!chatId || !senderId || !text) return res.status(400).json("Faltan ids o el texto")

    try {
        const newMessage = await Message.create({ senderId, chatId, text })
        res.json(newMessage)

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }

})

router.get("/getMessages/:chatId", async (req, res) => {

    const { chatId } = req.params
    if (!chatId) return res.status(400).json("Falta el id del chat")

    try {
        const messages = await Message.find({ chatId })
        res.json(messages)

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }

})

module.exports = router