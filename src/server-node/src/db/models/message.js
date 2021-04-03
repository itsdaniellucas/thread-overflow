const { Schema, model } = require("mongoose")
const { SchemaDefaults } = require("../dbUtils")


const MessageSchema = SchemaDefaults({
    content: String,
    upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    author: { type: Schema.Types.ObjectId, ref: 'User' },
})

const MessageModel = model('Message', MessageSchema)

module.exports = {
    MessageSchema,
    MessageModel
}