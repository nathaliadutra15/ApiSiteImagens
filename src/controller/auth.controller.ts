import { Body, Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from 'src/service/auth.service';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';
import { LocalAuthGuard } from 'src/utils/local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async signIn(@Res() res: Response) {
        try {
            const token = await this.authService.login();
            return res.status(200).send(token)
        } catch (error) {
            if (error.status) {
                return res.status(error.status).send({ message: error.message })
            } else {
                return res.status(500).send({ message: error });
            }
        }
    }
}