import { Body, Controller, Delete, Get, Param, Post, Put, Res } from "@nestjs/common";
import { Response } from 'express';
import { User, Postagem } from "src/dto/user.dto";
import { PostService } from "src/service/post.service";

@Controller('post')
export class PostsController {
    constructor(private postService: PostService) { }

    @Post('/create/:_id')
    async createPost(@Param() _id, @Body() post: Postagem, @Res() res: Response) {
        post.comentarios = [];
        post.criadoEm = new Date();
        post.atualizadoEm = new Date();
        post.curtidas = [];
        post.tags = [];

        try {
            await this.postService.createPost(_id._id, post);
            return res.status(201).send({ message: "Post criado com sucesso." })
        } catch (error) {
            return res.status(500).send({ message: error })
        }
    }

    @Get('/list/user/:_id')
    async getPostsByUserId(@Param() _id, @Res() res: Response) {
        const postsList = await this.postService.getPostsByUserId(_id);
        if (postsList.length == 0) {
            return res.status(422).send({ message: "Usuário não encontrado." });
        } else if (postsList[0].posts.length == 0) {
            return res.status(422).send({ message: "Este usuário não possui posts." });
        } else {
            return res.status(200).send(postsList[0]);
        }
    }

    @Get('/list/:_id')
    async getPostByPostId(@Param() _postId, @Res() res: Response) {
        const postsList = await this.postService.getPostByPostId(_postId);
        if (postsList.length == 0) {
            return res.status(422).send({ message: "Usuário não encontrado." });
        } else if (postsList[0].posts.length == 0) {
            return res.status(422).send({ message: "Este usuário não possui posts." });
        } else {
            return res.status(200).send(postsList[0].posts);
        }
    }

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
            await this.postService.likePostById(_postId._id, user.usuario);
            return res.status(201).send({ message: "Curtida atualizada com sucesso." })
        } catch (error) {
            return res.status(500).send({ message: error })
        }
    }
}