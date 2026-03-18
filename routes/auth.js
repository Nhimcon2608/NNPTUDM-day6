var express = require("express");
var router = express.Router();
let userController = require('../controllers/users')
let bcrypt = require('bcrypt')
const { CheckLogin } = require("../utils/authHandler");
const { signAccessToken } = require("../utils/jwtHandler");
const { ChangePasswordValidator, validatedResult } = require('../utils/validateHandler')

function buildSafeUserResponse(user) {
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

router.post('/register', async function (req, res, next) {
    try {
        let { username, password, email } = req.body;
        let newUser = await userController.CreateAnUser(
            username, password, email, "69b0ddec842e41e8160132b8"
        )
        res.send(newUser)
    } catch (error) {
        res.status(404).send(error.message)
    }

})
router.post('/login', async function (req, res, next) {
    try {
        let { username, password } = req.body;
        let user = await userController.GetAnUserByUsername(username);
        if (!user) {
            res.status(404).send({
                message: "thong tin dang nhap sai"
            })
            return;
        }
        if (user.lockTime && user.lockTime > Date.now()) {
            res.status(403).send({
                message: "ban dang bi ban"
            })
            return
        }
        if (bcrypt.compareSync(password, user.password)) {
            user.loginCount = 0;
            user.lockTime = undefined;
            await user.save()
            let token = signAccessToken({
                id: user._id
            })
            res.send({
                token: token
            })
        } else {
            user.loginCount++;
            if (user.loginCount == 3) {
                user.loginCount = 0;
                user.lockTime = Date.now() + 3600 * 1000
            }
            await user.save()
            res.status(404).send({
                message: "thong tin dang nhap sai"
            })
        }
    } catch (error) {
        res.status(404).send({
            message: error.message
        })
    }

})
router.get('/me',CheckLogin,function(req,res,next){
    res.send(buildSafeUserResponse(req.user))
})

router.post(['/change-password', '/changepassword'], CheckLogin, ChangePasswordValidator, validatedResult, async function (req, res, next) {
    try {
        let { oldPassword, newPassword } = req.body;
        if (!bcrypt.compareSync(oldPassword, req.user.password)) {
            res.status(400).send({
                message: "oldPassword khong dung"
            })
            return;
        }

        req.user.password = newPassword;
        await req.user.save();

        res.send({
            message: "doi mat khau thanh cong"
        })
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
})


module.exports = router;
