import profileController from "./profiles.ctrl"
import { accessProfileSchema, changePasswordSchema, followSomeoneSchema, getFollowersSchema, getSomeonesProfileSchema, logOutSchema, removeAccountSchema, uploadProfilePictureSchema } from "./profiles.schema"

export default async (fastify: any) => {
    const handler = profileController(fastify)
    
    fastify.route({
        method: "GET",
        url: "/users/profiles/me",
        schema: accessProfileSchema,
        handler: handler.accessProfile
    })
    fastify.route({
        method: "GET",
        url: "/users/profiles/:id",
        schema: getSomeonesProfileSchema,
        handler: handler.getSomeonesProfile
    })
    fastify.route({
        method: "POST",
        url: "/users/profiles/follow/:username",
        schema: followSomeoneSchema,
        handler: handler.followSomeone
    })
    fastify.route({
        method: "GET",
        url: "/users/profiles/followers",
        schema: getFollowersSchema,
        handler: handler.getFollowers
    })
    fastify.route({
        method: "PUT",
        url: "/users/profiles/logOut",
        schema: logOutSchema,
        handler: handler.logOut
    })
    fastify.route({
        method: "PUT",
        url: "/users/profiles/changePassword",
        schema: changePasswordSchema,
        handler: handler.changePassword
    })
    fastify.route({
        method: "DELETE",
        url: "/users/profiles/removeAccount",
        schema: removeAccountSchema,
        handler: handler.removeAccount
    })
    fastify.route({
        method: "POST",
        url: "/users/profiles/uploadProfilePicture",
        schema: uploadProfilePictureSchema,
        handler: handler.uploadProfilePicture
    })

}