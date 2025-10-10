import { Module } from "@nestjs/common";
import { UsersController } from "./controllers/users.controller";
import { IdentityProxy } from "./proxy/identity.proxy";
import { MicroservicesModule } from "../microservices.module";
import { AuthController } from "src/auth/auth.controller";

@Module({
  imports: [
    MicroservicesModule
  ],
  controllers: [
    UsersController,
    AuthController,
  ],
  providers: [
    IdentityProxy
  ],
  exports: [
    IdentityProxy
  ]
})

export class IdentityModule{}