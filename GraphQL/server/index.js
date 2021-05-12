const express = require('express')
const {graphql, buildSchema} = require('graphql')
const {graphqlHTTP} = require('express-graphql')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const betSchema = new Schema({
    title: String,
    message: String,
    status: String,
    date: String,
}, {versionKey: false})

const userSchema = new Schema({
    email: {type: String, unique: true, required: true},
    pass: {type: String, unique: true, required: true}
}, {versionKey: false})

const bets = mongoose.model("Bets-Graphql", betSchema)

const users = mongoose.model("User", userSchema)

const schema = buildSchema(`
    type bet {
        title: String
        message: String
        status: String
        date: String
    }
    type Query{
        getAllbets: [bet]
    }
    type Mutation {
        createbet(title: String!, message: String!, status: String!, date: String!): bet
    }
`)

const rootValue = {
    getAllbets: () => {
        return bets.find({})
    },
    createbet: ({title, message, status, date}) => {
        const bet = {title, message, status, date}
        bets.create(bet).then(r => {
            console.log(r)
        })
        return bet
    }
}

const app = express()
app.use(cors())


app.use(`/graphql`, graphqlHTTP({
    rootValue, schema, graphiql: true
}))


async function start() {
    try {
        await mongoose.connect('mongodb+srv://nikita:s1UwT1V3rQ1Er3C3@cluster0.q0xhk.mongodb.net/todos',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            }
        )
        app.listen(4000, () => {
            console.log('Server has been started...')
        })
    } catch (e) {
        console.log(e)
    }
}

start()
