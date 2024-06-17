import { Body, Controller, Delete, FileTypeValidator, Get, Param, ParseFilePipe, Post, Put, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from 'express';
import { User } from "../dto/user.dto";
import { S3Service } from "../service/s3.service";
import { UserService } from "../service/user.service";
import { Public } from "../utils/public.decorator";

@Controller('user')
export class UserController {
    constructor(private userService: UserService, private s3Service: S3Service) { }

    @Public()
    @Post('/register')
    async setUser(@Body() user: User, @Res() res: Response) {
        try {
            const userFoundByUsername = await this.userService.getUserByUsername(user.usuario);
            const userFoundByEmail = await this.userService.getUserByEmail(user.email);

            if (userFoundByUsername.length != 0) {
                return res.status(422).send({ message: "Nome de usuário já existe." });
            } else if (userFoundByEmail.length != 0) {
                return res.status(422).send({ message: "Email já cadastrado." });
            }
            else {
                user.criadoEm = new Date();
                this.userService.setUser(user);
                return res.status(201).send({ message: `Usuário "${user.usuario}" criado com sucesso.` });
            }
        } catch (error) {
            return res.status(500).send({ message: error });
        }
    }

    @Get('/list')
    async getAllUsers(@Res() res: Response) {
        const userList = await this.userService.getAllUsers();
        if (userList.length == 0) {
            return res.status(422).send({ message: "Não foi encontrado usuários cadastrados." });
        } else {
            return res.status(200).send(userList);
        }
    }

    @Get('/:username')
    async getUser(@Param() username, @Res() res: Response) {
        const usernameFound = await this.userService.getUserByUsername(username.username);
        if (usernameFound.length == 0) {
            return res.status(404).send({ message: "Usuário não foi encontrado." });
        } else {
            return res.status(200).send(usernameFound[0]);
        }
    }

    @Get('email/:email')
    async getUserByEmail(@Param() email, @Res() res: Response) {
        const emailFound = await this.userService.getUserByEmail(email.email);
        if (emailFound.length == 0) {
            return res.status(422).send({ message: "Email não foi encontrado." });
        } else {
            return res.status(200).send(emailFound[0]);
        }
    }

    @Put('/:username')
    async updateUser(@Param() username, @Body() user: User, @Res() res: Response) {
        if (Object.keys(user).length == 0) {
            return res.status(422).send({ message: 'Sem dados para atualizar!' })
        }

        if (user.email) {
            const userFoundByEmail = await this.userService.getUserByEmail(user.email);
            if (userFoundByEmail.length != 0) {
                return res.status(422).send({ message: "Email já cadastrado." });
            }
        }

        if (user.usuario) {
            const userFoundByUsername = await this.userService.getUserByUsername(user.usuario);
            if (userFoundByUsername.length != 0) {
                return res.status(422).send({ message: "Nome de usuário já existe." });
            }
        }

        const updatedUser = await this.userService.updateUser(username.username, user);
        if (updatedUser.modifiedCount == 0) {
            return res.status(422).send({ message: "Usuário não foi encontrado." });
        } else {
            return res.status(200).send({ message: "Usuário atualizado com sucesso." });
        }
    }

    @Delete('/remove/:username')
    async deleteUser(@Param() username, @Res() res: Response) {
        const deletedUser = await this.userService.deleteUser(username.username);
        if (deletedUser.deletedCount == 0) {
            return res.status(422).send({ message: "Usuário não encontrado para remover." });
        } else {
            return res.status(200).send({ message: "Usuário deletado com sucesso." });
        }
    }

    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile(
        new ParseFilePipe({
            validators: [
                new FileTypeValidator({ fileType: 'image/jpeg' }),
            ],
        }),
    ) file: Express.Multer.File, @Res() res: Response) {
        try {
            const upload = await this.s3Service.uploadOnS3('profile', file);
            return res.status(201).send({ url: upload.data.signedUrl });
        } catch (error) {
            return res.status(500).send({ message: "Erro no upload." });
        }
    }

}