import fp from "fastify-plugin";

require("dotenv").config()

export default fp(async function (fastify: any, opts: any) {
    fastify.register(require('fastify-jwt'), {
        secret: process.env.TOKEN_SECRET //get from coworker
    })
    fastify.decorate("createToken", async (payload: any, expiresIn?: string) => {
        if (expiresIn) {
            return fastify.jwt.sign({ payload }, { expiresIn })
        }
        else {
            return fastify.jwt.sign({ payload })
        }
    })
})

declare module "fastify" {
    export interface FastifyInstance {
        createToken(payload: any, expiresIn: string): Promise<string>
    }
}