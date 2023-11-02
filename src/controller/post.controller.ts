import { Body, Controller, Delete, FileTypeValidator, Get, Param, ParseFilePipe, Post, Put, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from 'express';
import { Postagem } from "src/dto/user.dto";
import { PostService } from "src/service/post.service";
import { S3Service } from "src/service/s3.service";
import { Public } from "src/utils/public.decorator";

@Controller('post')
export class PostsController {
    constructor(private postService: PostService, private s3Service: S3Service) { }

    @Post('/create/:_id')
    async createPost(@Param() _id, @Body() post: Postagem, @Res() res: Response) {
        post.comentarios = [];
        post.criadoEm = new Date();
        post.atualizadoEm = new Date();
        post.curtidas = [];
        post.tags = [];
        try {
            if (!post.usuario || !post.pathFotoPost) {
                return res.status(422).send({ message: "Forneça todos os campos para criar o post." });
            }
            await this.postService.createPost(_id._id, post);
            return res.status(201).send({ message: "Post criado com sucesso." })
        } catch (error) {
            return res.status(500).send({ message: error })
        }
    }

    @Get('/list/user/:username')
    async getPostsByUsername(@Param() _username, @Res() res: Response) {
        const postsList = await this.postService.getPostsByUsername(_username.username);
        if (postsList.length == 0) {
            return res.status(422).send({ message: "Usuário não encontrado." });
        } else if (postsList[0].posts.length == 0) {
            return res.status(422).send({ message: "Este usuário não possui posts." });
        } else {
            return res.status(200).send(postsList[0]);
        }
    }

    @Public()
    @Get('/list/:_id')
    async getPostByPostId(@Param() _postId, @Res() res: Response) {
        const postsList = await this.postService.getPostByPostId(_postId);
        if (postsList.length == 0) {
            return res.status(422).send({ message: "Post não encontrado." });
        } else if (postsList[0].posts.length == 0) {
            return res.status(422).send({ message: "Post não encontrado." });
        } else {
            return res.status(200).send(postsList[0].posts[0]);
        }
    }

    @Public()
    @Get('/list')
    async getPosts(@Res() res: Response) {
        const postsList = await this.postService.getPosts();
        return res.status(200).send(postsList);
    }

    @Put('/update/:_id')
    async updatePostById(@Param() _id, @Body() post: Postagem, @Res() res: Response) {
        post.atualizadoEm = new Date();

        try {
            await this.postService.updatePostById(_id._id, post);
            return res.status(201).send({ message: "Post atualizado com sucesso." })
        } catch (error) {
            return res.status(500).send({ message: error })
        }
    }

    @Delete('/remove/:_id')
    async deletePostById(@Param() _postId, @Res() res: Response) {
        try {
            await this.postService.deletePostById(_postId._id);
            return res.status(201).send({ message: "Post deletado com sucesso." })
        } catch (error) {
            return res.status(500).send({ message: error })
        }
    }

    @Post('/like/:_id')
    async likePostById(@Param() _postId, @Body() user, @Res() res: Response) {
        try {
            const type = await this.postService.likePostById(_postId._id, user.usuario);
            return res.status(201).send(type)
        } catch (error) {
            return res.status(500).send({ message: error })
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
            const upload = await this.s3Service.uploadOnS3('post',file);
            return res.status(201).send({ url: upload.data.signedUrl });
        } catch (error) {
            return res.status(500).send({ message: "Erro no upload." });
        }
    }
}