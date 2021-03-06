import { Models, NoUserError } from "../models/models"

import { Auth, User } from "../models/models.type"

import { config } from "../config"

import * as express from "express"

import * as moment from "moment"

import * as forge from "node-forge"

import * as jwt from "jsonwebtoken"

export class AuthRouter {

  constructor(private models: Models) { }

  init = afn(async (req, res, next) => {
    let user: User = await this.models.user.findOne({ username: req.params.username }).exec()
    if (!user) throw new AuthError("no user")
    let va: Auth = await this.models.auth.findOne({ username: req.params.username }).exec()
    if (!va) {
      va = { username: req.params.username }
    }
    if (!va.attempts) va.attempts = [] as any
    va.attempts.push({ time: new Date(), secret: forge.random.getBytesSync(32) })
    if (va.attempts.length > 10) va.attempts = va.attempts.slice(-10)
    if ((va as any)._id) {
      await this.models.auth.update({ username: va.username }, va).exec()
    } else {
      await this.models.auth.create(va)
    }
    let resv = va.attempts.slice(-1)[0]
    res.json({ time: resv.time, secret: resv.secret })
  })

  login = afn(async (req, res, next) => {
    let va: Auth = await this.models.auth.findOne({ username: req.params.username }).exec()
    if (!va) throw new AuthError("no init")
    let secret = req.body.secret
    if (secret !== va.attempts.slice(-1)[0].secret) throw new AuthError("invalid secret")
    let password = req.body.password
    let user: User = await this.models.user.findOne({ username: req.params.username }).exec()
    if (!user) throw new AuthError("no user")
    let hmac = forge.hmac.create()
    hmac.start("sha256", secret)
    hmac.update(forge.util.decode64(user.password))
    let upass = forge.util.encode64(hmac.digest().getBytes())
    if (password !== upass) throw new AuthError(`invalid password`)
    let token = jwt.sign({ sub: va.username, role: user.roles, jti: secret }, config.auth.secret, {
      expiresIn: config.auth.tokenExpiry
    }) as string
    va.token = jwt.sign({ sub: va.username, jti: secret }, config.auth.secret, {
      expiresIn: "12h"
    }) as string
    await this.models.auth.update({ username: va.username }, va)
    user.password = null
    delete user.password
    res.json({ token: token, refreshToken: va.token, user: user })
  })

  user = afn(async (req, res, next) => {
    let token = jwt.verify(req.params.token, config.auth.secret)
    let user: User = await this.models.user.findOne({ username: token.sub }).exec()
    if (!user) throw new AuthError("no user")
    user.password = null
    delete user.password
    res.json(user)
  })

  refreshToken = afn(async (req, res, next) => {
    let refreshToken
    try {
      refreshToken = jwt.verify(req.params.token, config.auth.secret)
    } catch (err) {
      throw new TokenRefreshError("invalid refresh token")
    }
    let va: Auth = await this.models.auth
      .findOne({ username: refreshToken.sub, token: req.params.token })
      .exec()
    if (!va) throw new TokenRefreshError("invalid token")
    let user: User = await this.models.user.findOne({ username: va.username }).exec()
    if (!user) throw new TokenRefreshError("no user")
    let token = jwt.sign(
      { sub: va.username, role: user.roles, jti: refreshToken.secret },
      config.auth.secret,
      { expiresIn: config.auth.tokenExpiry }
    ) as string
    res.json({ token: token, refreshToken: va.token, user: user })
  })

  list = afn(async (req, res, next) => {
    res.json(this.models.permissions)
  })
}

const afn = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

export class AuthError extends Error {
  name = "AuthError"

  constructor(msg: string) {
    super(msg)
  }
}

export class TokenRefreshError extends Error {
  name = "TokenRefreshError"

  constructor(msg: string) {
    super(msg)
  }
}
