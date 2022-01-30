import fp from 'fastify-plugin'
const oas = require('fastify-oas');
require("dotenv").config()

export interface SupportPluginOptions {
    // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<SupportPluginOptions>(async (fastify, opts) => {
    fastify.register(oas, {
        routePrefix: '/docs',
        swagger: {
            info: {
                title: 'User manager site',
                description: 'Testing my main routes',
                version: '0.1.0',
            },
            servers: [
                {url: `http://${process.env.FASTIFY_ADDRESS}:${process.env.FASTIFY_PORT}`}
            ],
            externalDocs: {
                url: 'https://swagger.io',
                description: 'Find more info here',
            },
            consumes: ['application/json'],
            produces: ['application/json'],
        },
        exposeRoute: true
    });
})

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
    export interface FastifyInstance {
        someSupport(): string
    }
}