let userController = require('../controllers/users')
let { verifyAccessToken } = require('./jwtHandler')

function sendUnauthorized(res) {
    res.status(401).send({
        message: "ban chua dang nhap"
    })
}

module.exports = {
    CheckLogin: async function (req, res, next) {
        try {
            if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
                return sendUnauthorized(res);
            }
            let token = req.headers.authorization.split(" ")[1];
            let result = verifyAccessToken(token)
            let user = await userController.GetAnUserById(result.id);
            if (!user) {
                return sendUnauthorized(res);
            }
            req.user = user;
            next()
        } catch (error) {
            sendUnauthorized(res)
        }

    }
}
