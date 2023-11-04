import { Module } from "@nestjs/common"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { PrismaModule } from "src/prisma/prisma.module"
import { JwtModule } from "@nestjs/jwt"
import { JwtStrategy } from "./strategy"


@Module({
  imports: [
    PrismaModule,
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {


}

// initializing nest app-- \nest new name_of_app\
// creating module from terminal: nest g module name_of_module, E.g nest g module user

