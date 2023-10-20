const { model, Schema } = require("mongoose")

const chatSchema = new Schema(
    {
        members: Array
    },
    {
        timestamps: true
    }
)

const Chat = model("chat", chatSchema)

module.exports = Chat