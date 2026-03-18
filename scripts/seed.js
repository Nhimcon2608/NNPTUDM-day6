const mongoose = require('mongoose')
const roleModel = require('../schemas/roles')
const userModel = require('../schemas/users')

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/NNPTUD-S4'

async function main() {
    await mongoose.connect(mongoUri)

    const role = await roleModel.findOneAndUpdate(
        { name: 'Nguoi dung' },
        {
            name: 'Nguoi dung',
            description: 'Tai khoan dung de test auth'
        },
        {
            upsert: true,
            setDefaultsOnInsert: true,
            returnDocument: 'after'
        }
    )

    const existingUser = await userModel.findOne({ username: 'postmanuser', isDeleted: false })
    if (existingUser) {
        existingUser.password = 'Password@123'
        existingUser.email = 'postmanuser@example.com'
        existingUser.fullName = 'Postman User'
        existingUser.role = role._id
        existingUser.status = true
        existingUser.loginCount = 0
        existingUser.lockTime = undefined
        await existingUser.save()
    } else {
        await userModel.create({
            username: 'postmanuser',
            password: 'Password@123',
            email: 'postmanuser@example.com',
            fullName: 'Postman User',
            avatarUrl: 'https://i.sstatic.net/l60Hf.png',
            status: true,
            loginCount: 0,
            role: role._id
        })
    }

    console.log('Seeded account:')
    console.log('username=postmanuser')
    console.log('password=Password@123')
    console.log('newPassword=Newpass@123')

    await mongoose.disconnect()
}

main().catch(async function (error) {
    console.error(error)
    try {
        await mongoose.disconnect()
    } catch (disconnectError) {
        console.error(disconnectError)
    }
    process.exit(1)
})
