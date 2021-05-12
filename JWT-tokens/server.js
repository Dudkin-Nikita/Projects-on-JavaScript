const express = require('express')
const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {secret} = require('./config')
const cookieParser = require('cookie-parser')
const Schema = mongoose.Schema;

const betScheme = new Schema({
    title: String,
    description: String,
    date: String,
}, {versionKey: false})

const userSchema = new Schema({
    email: {type: String, unique: true, required: true},
    pass: {type: String, unique: true, required: true},
    role: [{type: String}]
}, {versionKey: false})

const bets = mongoose.model("Bet", betScheme)
const users = mongoose.model("User", userSchema)


const path = require('path')
const app = express()
const {v4} = require('uuid')

//let BETS = []

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'images')))
app.use(express.static(path.resolve(__dirname, 'client')))

app.use(express.json())
app.use(cookieParser())

const generateAccessToken = (id, name) => {
    const payload = {
        id,
        name
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}

app.get('/api/bets', (req, res) => {
    try {
        bets.find({}, function (err, bets) {
            res.status(200).json(bets)
        });
    } catch (e) {
        console.log(e)
        res.status(400).json({message: 'Error retrieving data from the database'})
    }
})
app.get(`/api/bets/:id`, (req, res) => {
    try {
        bets.find({_id: req.params.id}, function (err, bet) {
            res.status(200).json(bet)
        });
    } catch (e) {
        console.log(e)
        res.status(400).json({message: 'Error retrieving data from the database'})
    }
})
app.get('/api/checkAccess', (req, res) => {
    try {
        let cookie = req.cookies['tokenValue']
        let checkingTokenResult = jwt.verify(cookie, secret)
        res.json({message: checkingTokenResult})
    } catch (e) {
        console.log(e)

        return res.status(403).json({message: "you are not authorized"})
    }
})
app.post('/api/bets', (req, res) => {
    try {
        let bet = {...req.body}
        addBetToBD(bet)
        res.status(201).json(bet)
    } catch (e) {
        console.log(e)
        res.status(400).json({message: 'error of adding bet to database'})
    }
})
app.post('/api/betsImage', (req, res) => {

    let bet = {...req.body}
    req.files.photo.mv('uploads/' + req.files.photo.name)
    console.log(bet)
    // addBetToBD(bet)
    // BETS.push(bet)
    res.status(201).json(bet)
})
app.post('/api/userSignIn', (req, res) => {
    let user = {...req.body}
    Authorization(user, req, res)
})
app.post('/api/userSignUp', (req, res) => {
    let user = {...req.body}
    Registration(user, req, res)
})

app.delete('/api/bets/:id', (req, res) => {
    BETS = BETS.filter(c => c.id !== req.params.id)
    res.status(200).json({message: "Bet has been deleted"})
})

app.put('/api/bets/:id', (req, res) => {
    const idx = BETS.findIndex(c => c.id === req.params.id)
    BETS[idx] = req.body
    res.json(BETS[idx])
})

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
})

async function addBetToBD(bet) {
    await bets.create({
            id: bet.id,
            title: bet.title,
            description: bet.description,
            date: bet.date,
            likes: bet.likes,
            dislikes: bet.dislikes,
            views: bet.views,
            commentsCount: bet.commentsCount,
            file: bet.file,
            author: bet.author
        },
        function (err, doc) {
            if (err) return console.log(err);
            console.log("Сохранен объект user", doc);
        })
}

async function Authorization(user, req, res) {
    try {
        const existUser = await users.findOne({
            email: user.email
        });
        if (existUser !== null) {
            const validPassword = await bcrypt.compareSync(user.pass, existUser.pass)
            if (!validPassword) {
                res.status(400).json({message: `passwords mismatch `})
            } else {
                let token = await generateAccessToken(user._id, user.email);
                res.cookie(`token= ${token}; Secure; HttpOnly`)
                console.log(token)
                res.json({token: token})
            }
        } else {
            console.log("нет такого пользователя")
            res.status(400).json({message: `User ,${user.email}, doesnt exist`})
        }
    } catch (e) {
        res.status(400).json({message: `Error authorization`})
    }
}

async function Registration(user, req, res) {
    try {
        const candidate = await users.findOne({
            email: user.email
        });
        if (candidate == null) {
            const hashPassword = bcrypt.hashSync(user.pass, 4)
            await users.create({
                    email: user.email,
                    pass: hashPassword
                },
                async function (err, doc) {
                    if (err) return console.log(err);
                    console.log(doc);
                });
        } else {

        }
    } catch (e) {

    }
}

async function start() {
    try {
        await mongoose.connect("mongodb+srv://nikita:s1UwT1V3rQ1Er3C3@cluster0.q0xhk.mongodb.net/todos", {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        app.listen(3000, () => {
            console.log('Server has been started successfully....')
        })
    } catch (e) {
        console.log(e)
    }
}

start()
