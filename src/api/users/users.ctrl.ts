import { User } from "./users.entity"
const uniqid = require("uniqid")


export default function (fastify: any) {

    const registerUser = async (request: any, reply: any) => {
        try {
            const user: User = request.body
            if (await User.findOne({ username: user.username }) || await User.findOne({ email: user.email })) {
                reply.code(400).send("User already exists.")
            }
            user.password = await fastify.hashPassword(user.password)
            user.fingerprint = uniqid()
            await User.save(user)
            reply.code(201).send({ message: "User created", fingerprint: user.fingerprint })
        } catch (error) {
            reply.code(500).send("Someting went wrong.")
        }
    }

    const validateUser = async (request: any, reply: any) => {
        try {
            const fingerprint = request.params.fingerprint
            let user = await User.findOne({ fingerprint })
            if (user) {
                user.validated = true
                await User.save(user)
                reply.code(201).send(`User ${user.username}'s validated.`)
            }
            reply.code(404).send("User not found.")
        } catch (error) {
            reply.code(500).send(error)
        }
    }

    const loginUser = async (request: any, reply: any) => {
        try {
            const { email, password } = request.body
            let user = await User.findOne({ email })
            if (user && user.validated) {
                if (await fastify.comparePassword(password, user.password)) {
                    user.isLogged = true;
                    const token = await fastify.createToken(user.uuid, "7m")
                    await User.save(user)
                    reply.code(201).send({ message: "User's logged in.", token })
                }
                reply.code(401).send("Wrong password or email.")
            }
            else if (user && !user.validated) {
                reply.code(403).send("User's not validated.")
            }
            else {
                reply.code(400).send("Mail & password are not correct.")
            }
        } catch (error) {
            reply.code(500).send(error)
        }
    }

    const forgotPassword = async (request: any, reply: any) => {
        const { email } = request.body
        let user = await User.findOne({ email })
        if (user) {
            //TODO: pošalji mail na userov email s linkom na kojem će moći izmjeniti pass (valjda mi je zato trebao google app)
            user.passwordFingerprint = uniqid()
            user.canChangePassword = true
            await User.save(user)
            reply.code(201).send({message: "Change-password link generated & sent.", uniqid: user.passwordFingerprint})
        } 
        reply.code(404).send("User with that email address doesn't exist.")
    }

    const changeForgottenPassword = async (request: any, reply: any) => {
        const { uniqid } = request.params
        const { newPassword, repeatedNewPassword } = request.body
        let user = await User.findOne({passwordFingerprint: uniqid})
        if (user && user.canChangePassword) {
            if (newPassword == repeatedNewPassword && (await fastify.comparePassword(newPassword, user.password) == false)) {
                user.password = await fastify.hashPassword(newPassword)
                user.canChangePassword = false
                await User.save(user)
                reply.code(201).send("Password changed.")
            }
            reply.code(400).send("Passwords don't match or a new password is same as the old one.")
        }
        reply.code(400).send("Bad fingerprint or the password can't be changed.")
    }

    return {
        registerUser,
        validateUser,
        loginUser,
        forgotPassword,
        changeForgottenPassword
    }
}