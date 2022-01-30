import { join } from 'path';
import AutoLoad, { AutoloadPluginOptions } from 'fastify-autoload';
import { FastifyPluginAsync } from 'fastify'
const fileUpload = require('fastify-file-upload')

require("dotenv").config()

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application

  void fastify.register(require("fastify-cors"), {
    origin: true
  });

  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts
  })

  fastify.register(fileUpload, {
    limits: { fileSize: 50 * 1024 * 1024 },
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, './api'),
    indexPattern: /.*routes(\.ts|\.js|\.cjs|\.mjs)$/,
    dirNameRoutePrefix: false,
  });

};

export default app;
export { app }
