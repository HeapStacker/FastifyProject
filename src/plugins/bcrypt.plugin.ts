import fp from 'fastify-plugin'

export interface SupportPluginOptions {
  // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<SupportPluginOptions>(async (fastify: any, opts: any) => {
  //registering password hasher & checker...
  fastify.register(require('fastify-bcrypt'), {
    saltWorkFactor: 12
  })
  fastify.decorate("hashPassword", async function (password: string): Promise<string> {
    return await fastify.bcrypt.hash(password)
  })
  fastify.decorate("comparePassword", async function (password: string, hash: string): Promise<boolean> {
    return await fastify.bcrypt.compare(password, hash) //if true passwords match
  })
})

declare module "fastify" {
  export interface FastifyInstance {
    hashPasswrd(password: string): Promise<string>,
    comparePassword(password: string, hash: string): Promise<boolean>
  }
}