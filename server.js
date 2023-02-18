const express = require('express')
const app = express()

const passport = require('passport')
const jwt = require('jsonwebtoken')
const { ExtractJwt, Strategy:JwtStrategy } = require("passport-jwt")

const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET_KEY

app.use('/', (req, res) => {
  res.json({ message: "Welcome to the jwt-auth API" })
})

app.listen(3000, () => console.log("Server started on port 3000"))