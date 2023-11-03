import { Module } from "@nestjs/common"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"


@Module({
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {


}

// initializing nest app-- \nest new name_of_app\
// creating module from terminal: nest g module name_of_module, E.g nest g module user

