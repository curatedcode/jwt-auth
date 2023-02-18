const express = require('express')
const app = express()
require('dotenv').config()

const passport = require('passport')
const jwt = require('jsonwebtoken')
const { ExtractJwt, Strategy:JwtStrategy } = require("passport-jwt")

const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET_KEY

const users = [
  {
    id: 1,
    name: 'thatguyben',
    password: 'sdfg45332498hdfv'
  },
  {
    id: 2,
    name: 'test',
    password: 'test'
  }
]

const strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
  const user = users.findIndex( (user) => user.id === jwt_payload.id )
  if (!user) {
    next(null, false, { message: "Cannot find user" })
  } else {
    next(null, user)
  }
})

passport.use(strategy)
app.use(passport.initialize())

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: "Welcome to the jwt-auth API" })
})

app.post('/login', (req, res) => {
  const userIndex = users.findIndex( user => user.name === req.body.name)
  if (userIndex === -1) {
    return res.status(401).json({ message: "Incorrect username" })
  }

  if (users[userIndex].password === req.body.password) {
    const payload = { id: users[userIndex].id }
    const token = jwt.sign(payload, jwtOptions.secretOrKey)
    return res.json({ token })
  } else {
    return res.status(401).json({ message: "Incorrect password" })
  }
})

app.get('/secret', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json("If you\'re reading this you have a valid token")
})

app.listen(3000, () => console.log("Server started on port 3000"))