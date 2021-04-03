const { Schema, model } = require("mongoose")
const { SchemaDefaults } = require("../dbUtils")
const { MessageSchema } = require('./message')

const ThreadSchema = SchemaDefaults({
    title: String,
    upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    messages: [MessageSchema]
})

const ThreadModel = model('Thread', ThreadSchema)

module.exports = {
    ThreadSchema,
    ThreadModel
}