let fs = require('fs')
let path = require('path')
let jwt = require('jsonwebtoken')

const privateKey = fs.readFileSync(path.join(__dirname, '..', 'keys', 'private.key'), 'utf8')
const publicKey = fs.readFileSync(path.join(__dirname, '..', 'keys', 'public.key'), 'utf8')

module.exports = {
    signAccessToken: function (payload) {
        return jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1h'
        })
    },
    verifyAccessToken: function (token) {
        return jwt.verify(token, publicKey, {
            algorithms: ['RS256']
        })
    }
}
