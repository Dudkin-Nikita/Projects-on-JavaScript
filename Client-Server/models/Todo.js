const { Schema, model } = require('mongoose')

const schema = new Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String
    },
    completed: {
        type: Boolean,
        default: false
    },
    status:{
        type: String
    },
    date:{
        type: String
    },
    fileName:{
        type: String
    } 
})

module.exports = model('Todo', schema)