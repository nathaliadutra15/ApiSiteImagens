import { Body, Controller, Delete, Get, Param, Post, Put, Res } from "@nestjs/common";
import { Response } from 'express';
import { Comentario } from "src/dto/user.dto";
import { CommentService } from "../service/comment.service"

@Controller('comment')
export class CommentController {
    constructor(private commentService: CommentService) { }

    @Post('/create/:_postId')
    async createComment(@Param() _postId, @Body() comment: Comentario, @Res() res: Response) {
        try {
            comment.criadoEm = new Date();
            comment.atualizadoEm = new Date();
            comment.curtidas = [];
            await this.commentService.createComment(_postId._postId, comment);
            return res.status(201).send({ message: "Comentário criado com sucesso." });
        } catch (error) {
            return res.status(500).send({ message: error });
        }
    }

    @Get('/list/:_postId')
    async getCommentsById(@Param() _postId, @Res() res: Response) {
        try {
            let comments = await this.commentService.getCommentsById(_postId._postId);
            return res.status(200).send(comments["posts"].map(item => item.comentarios).flat());
        } catch (error) {
            return res.status(500).send({ message: error });
        }

    }

    @Put('/update/:_commentId')
    async updateCommentById(@Param() _commentId, @Body() comment: Comentario, @Res() res: Response) {
        try {
            comment.atualizadoEm = new Date();
            await this.commentService.updateCommentById(_commentId._commentId, comment);
            return res.status(201).send({ message: "Comentário atualizado com sucesso." })
        } catch (error) {
            return res.status(500).send({ message: error });
        }
    }

    @Delete('/remove/:_commentId')
    async deleteCommentById(@Param() _commentId, @Res() res: Response) {
        try {
            await this.commentService.deleteCommentById(_commentId._commentId);
            return res.status(201).send({ message: "Comentário deletado com sucesso." })
        } catch (error) {
            return res.status(500).send({ message: error });
        }
    }
}