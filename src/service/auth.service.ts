import { HttpException, Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { HttpStatusCode } from 'axios';


@Injectable()
export class AuthService {
    private user: any;

    constructor(private userService: UserService, private jwtService: JwtService) { }

    async validateUser(email: string, senha: string): Promise<any> {
        this.user = await this.userService.getUserByEmail(email);

        if (this.user.length == 0) throw new HttpException('Usuário não encontrado.', HttpStatusCode.UnprocessableEntity)

        const isValidPass = bcrypt.compareSync(senha, this.user[0].senha);

        return this.user && isValidPass ? this.user : null;
    }

    async login() {
        const token = await this.jwtService.signAsync({
            _id: this.user[0]._id,
            email: this.user[0].email
        });

        return {
            access_token: token
        }
    }

}