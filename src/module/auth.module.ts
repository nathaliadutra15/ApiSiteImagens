import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from 'src/controller/auth.controller';
import { AuthService } from 'src/service/auth.service';
import { UserService } from 'src/service/user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/utils/local.strategy';
import { JwtStrategy } from 'src/utils/jwt.strategy';


@Module({
    imports: [
        JwtModule.registerAsync({
            global: true,
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('jwtConstants.secret'),
            }),
            inject: [ConfigService],
        }),
        PassportModule,
        ConfigModule
    ],
    providers: [UserService, AuthService, LocalStrategy, JwtStrategy, ConfigService],
    controllers: [AuthController],
})
export class AuthModule { }