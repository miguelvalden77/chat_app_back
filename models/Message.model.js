const { Schema, model } = require("mongoose")

const messageSchema = new Schema(
    {
        chatId: String,
        senderId: String,
        text: String
    },
    {
        timestamps: true
    }
)

const Message = model("Message", messageSchema)

module.exports = Message