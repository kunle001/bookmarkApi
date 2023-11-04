import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from "argon2";
import { AuthDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) { }
  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      }
    });

    if (!user) {
      throw new ForbiddenException("Invalid email credentials")
    };

    const pwMatch = await argon.verify(user.password, dto.password);

    if (!pwMatch) {
      throw new ForbiddenException("Incorrect password")
    }

    return {
      access_tok: await this.signtoken(user.id, user.email)
    }
  }

  async signup(dto: AuthDto) {
    const password = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password
        },
      });

      delete user.password;
      return user;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code == "P2002") {
          throw new ForbiddenException("Credentials taken")
        }
      }
      throw e;
    }

  }

  signtoken(
    userId: string,
    email: string
  ): Promise<string> {
    const payload = {
      id: userId,
      email
    };

    return this.jwt.signAsync(payload, {
      expiresIn: "15m",
      secret: this.config.get("JWTSEC")
    })
  }

}