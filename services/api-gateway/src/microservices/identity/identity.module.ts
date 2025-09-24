import { Module } from "@nestjs/common";
import { UsersController } from "./controllers/users.controller";
import { IdentityProxy } from "./proxy/identity.proxy";
import { MicroservicesModule } from "../microservices.module";

@Module({
  imports: [
    MicroservicesModule
  ],
  controllers: [
    UsersController
  ],
  providers: [
    IdentityProxy
  ],
  exports: [
    IdentityProxy
  ]
})

export class IdentityModule{}