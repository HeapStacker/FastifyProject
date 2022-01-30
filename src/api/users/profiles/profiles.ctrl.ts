import { User } from "../users.entity"
import { UsersConnection } from "./profiles.entity"


interface Name {
    firstName: string,
    lastName: string
}

interface Place {
    country: string,
    city?: string,
    town?: string,
    vilage?: string,
}

interface Someone {
    username: string,
    name?: Name,
    description?: string,
    place?: Place,
    dateOfBirth?: Date
}

export default function (fastify: any) {
    const isLogged = async (uuid: string) => {
        const user = await User.findOne({ uuid })
        if (user && user.isLogged) return true
        else if (user && !user.isLogged) return false
        else return false
    }

    const hasExpired = async (decodedToken: any) => {
        if (Date.now() < decodedToken.exp * 1000) return false
        return true
    }

    const validation = async (request: any) => {
        const { token } = request.query
        const decodedToken = fastify.jwt.decode(token)


        if (await isLogged(decodedToken.payload)) {
            if (await hasExpired(decodedToken) == false) {
                //Creating a new token (to replace the old one)
                const newToken = await fastify.createToken(decodedToken.payload, "7m")
                return { uuid: decodedToken.payload, newToken }

                //TODO: It would be also nice to invalidate the old one
            }
            //token has expired
            return null
        }
        //user's not logged in
        return null
    }

    const accessProfile = async (request: any, reply: any) => {
        const validatedToken = await validation(request)
        if (validatedToken?.uuid) {
            let user = await User.findOne({ uuid: validatedToken.uuid })
            if (user) {
                reply.code(200).send({
                    message: `Wellcome to your profile ${user.username}`,
                    data: {
                        username: user.username,
                        description: user?.description
                    },
                    visibility: {
                        nameVisibility: user?.nameVisibility,
                        descriptionVisibility: user?.descriptionVisibility,
                        placeVisibility: user?.placeVisibility,
                        dobVisibility: user?.dobVisibility
                    },
                    newToken: validatedToken.newToken
                })
            }
            reply.code(404).send({ message: "Requested user doesn't exist.", newToken: validatedToken.newToken })
        }
        reply.code(401).send("Authentification is needed.")
    }

    const getUserInformation = async (user: User) => {
        let someonesData: Someone = { username: user.username }
        if (user.nameVisibility) {
            someonesData.name = { firstName: user.firstName, lastName: user.lastName }
        }
        if (user.descriptionVisibility) someonesData.description = user.description
        if (user.placeVisibility) {
            someonesData.place = { country: user.place.country }
            if (user.city) someonesData.place.city = user.city
            if (user.town) someonesData.place.town = user.town
            if (user.vilage) someonesData.place.vilage = user.vilage
        }
        return someonesData
    }

    const getInformation = async (uuid: string) => {
        const someone = await User.findOne({ uuid }, { relations: [""] })
        if (someone) {
            const data = await getUserInformation(someone)
            reply.send({ data, newToken: validatedToken.newToken })
        }
        let someonesData: Someone = { username: user.username }
        if (user.nameVisibility) {
            someonesData.name = { firstName: user.firstName, lastName: user.lastName }
        }
        if (user.descriptionVisibility) someonesData.description = user.description
        if (user.placeVisibility) {
            someonesData.place = { country: user.place.country }
            if (user.city) someonesData.place.city = user.city
            if (user.town) someonesData.place.town = user.town
            if (user.vilage) someonesData.place.vilage = user.vilage
        }
        return someonesData
    }

    const getSomeonesProfile = async (request: any, reply: any) => {
        const { id } = request.params
        const validatedToken = await validation(request)
        if (validatedToken?.uuid) {
            let user = await User.findOne({ uuid: validatedToken?.uuid })
            if (user) {
                await getInformation(id)
                const someone = await User.findOne({ uuid: id })
                if (someone) {
                    const data = await getUserInformation(someone)
                    reply.send({ data, newToken: validatedToken.newToken })
                }
            }
            reply.code(404).send({ message: "Requested user doesn't exist.", newToken: validatedToken.newToken })
        }
        reply.code(401).send("Authentification is needed.")
    }

    const follow = async (me: User, user: User) => {
        if ((await UsersConnection.findOne({ followedUser: user, userThatFollows: me })) || user.id == me.id) {
            return false
        }
        let userConnection = new UsersConnection
        userConnection.followedUser = user
        userConnection.userThatFollows = me
        await UsersConnection.save(userConnection)
        return true
    }

    const followSomeone = async (request: any, reply: any) => {
        const { username } = request.params
        const validatedToken = await validation(request)
        if (validatedToken?.uuid) {
            let user = await User.findOne({ username })
            let me = await User.findOne({ uuid: validatedToken.uuid })
            if (me && user) {
                if (await follow(me, user)) {
                    reply.code(201).send({ message: `User ${me.username} is now following ${user.username}.`, newToken: validatedToken.newToken })
                }
                else {
                    reply.code(400).send("User connection already exists or you are trying to follow yourself.")
                }
            }
            reply.code(404).send({ message: "Requested user doesn't exist.", newToken: validatedToken.newToken })
        }
        reply.code(401).send("Authentification is needed.")
    }

    const getYourFollowers = async (me: User) => {
        const followers = await UsersConnection.find({ relations: ["userThatFollows"], where: { followedUser: me } })
        return followers
    }

    const getFollowers = async (request: any, reply: any) => {
        const validatedToken = await validation(request)
        if (validatedToken?.uuid) {
            let me = await User.findOne({ uuid: validatedToken.uuid })
            if (me) {
                const followers = await getYourFollowers(me)
                reply.send({ followers, newToken: validatedToken.newToken })
            }
            reply.code(404).send({ message: "Requested user doesn't exist.", newToken: validatedToken.newToken })
        }
        reply.code(401).send("Authentification is needed.")
    }

    // .redirect("http://localhost:4000/users/login")
    const logOut = async (request: any, reply: any) => {
        const validatedToken = await validation(request)
        if (validatedToken?.uuid) {
            let me = await User.findOne({ uuid: validatedToken.uuid })
            if (me) {
                me.isLogged = false
                await User.save(me)
                //Iako je za log out u normalnim okolnostima ruta delete, 
                //ovdje mijenjamo isLogged iz true u false pa će kod biti = 201
                reply.code(201).send(`${me.username}'s logged out.`)
                //morat ću redirectat na mateov link...
            }
        }
    }

    const changePassword = async (request: any, reply: any) => {
        const { oldPassword, newPassword, newRepeatedPassword } = request.body
        const validatedToken = await validation(request)
        if (validatedToken?.uuid) {
            let me = await User.findOne({ uuid: validatedToken.uuid })
            if (me) {
                if ((await fastify.comparePassword(oldPassword, me.password)) && newPassword == newRepeatedPassword) {
                    me.password = await fastify.hashPassword(newPassword)
                    await User.save(me)
                    reply.code(201).send({ message: "Password successfully changed.", newToken: validatedToken.newToken })
                }
                reply.code(400).send({ message: "Wrong password or new passwords don't match.", newToken: validatedToken.newToken })
            }
        }
        reply.code(401).send("Authentification is needed.")
    }

    const removeConnections = async (user: User) => {
        let connections = await UsersConnection.find({ userThatFollows: user })
        connections.forEach(async connection => {
            await UsersConnection.delete({ id: connection.id })
        });
        connections = await UsersConnection.find({ followedUser: user })
        connections.forEach(async connection => {
            await UsersConnection.delete({ id: connection.id })
        });
    }

    const removeAccount = async (request: any, reply: any) => {
        const { passwordCheck } = request.body
        const validatedToken = await validation(request)
        if (validatedToken?.uuid) {
            let me = await User.findOne({ uuid: validatedToken.uuid }, { relations: ["followedUsers", "usersThatFollowYou"] })
            if (me && (await fastify.comparePassword(passwordCheck, me.password))) {
                await removeConnections(me)
                await User.delete({ id: me.id })
                reply.code(404).send("Your account is successfully removed.")
            }
            reply.code(400).send({ message: "Wrong password.", newToken: validatedToken.newToken })
        }
        reply.code(401).send("Authentification is needed.")
    }

    const uploadProfilePicture = async (request: any, reply: any) => {
        // some code to handle file
        const files = request.raw.files
        console.log(files)
        let fileArr = []
        for (let key in files) {
            fileArr.push({
                name: files[key].name,
                mimetype: files[key].mimetype
            })
        }
        reply.code(201).send(fileArr)
    }

    return {
        accessProfile,
        getSomeonesProfile,
        followSomeone,
        getFollowers,
        logOut,
        changePassword,
        removeAccount,
        uploadProfilePicture
    }
}