import fp from 'fastify-plugin'
import { UsersConnection } from '../api/users/profiles/profiles.entity';
import { User } from '../api/users/users.entity';
require("dotenv").config()

export interface SupportPluginOptions {
  // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<SupportPluginOptions>(async (fastify, opts) => {

  //setting up database connection...
  fastify.register(require('fastify-typeorm-plugin'), {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: process.env.BASE_USERNAME,
    password: process.env.BASE_PASSWORD,
    database: process.env.BASE,
    entities: [User, UsersConnection],
    synchronize: true,
    logging: true
  });

})