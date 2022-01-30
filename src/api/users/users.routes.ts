import usersController from "./users.ctrl";
import { changeForgottenPasswordSchema, forgotPasswordSchema, loginUserSchema, registerUserSchema, validateUserSchema } from "./users.schema"


export default async (fastify: any) => {
    const handler = usersController(fastify);
    fastify.route({
        method: 'POST',
        url: '/users/register',
        schema: registerUserSchema,
        handler: handler.registerUser
    });
    fastify.route({
        method: "POST",
        url: "/users/validation/:fingerprint",
        schema: validateUserSchema,
        handler: handler.validateUser
    })
    fastify.route({
        method: "POST",
        url: "/users/login",
        schema: loginUserSchema,
        handler: handler.loginUser
    })
    fastify.route({
        method: "PUT",
        url: "/users/forgotPassword",
        schema: forgotPasswordSchema,
        handler: handler.forgotPassword
    })
    fastify.route({
        method: "PUT",
        url: "/users/forgotPassword/:uniqid",
        schema: changeForgottenPasswordSchema,
        handler: handler.changeForgottenPassword
    })
}