import { Body, Controller, Delete, Get, Param, Post, Put, Res } from "@nestjs/common";
import { Response } from 'express';
import { Comentario } from "../dto/user.dto";
import { CommentService } from "../service/comment.service"
import { PostService } from "../service/post.service";

@Controller('comment')
export class CommentController {
    constructor(private commentService: CommentService, private postService: PostService) { }

    @Post('/create/:_postId')
    async createComment(@Param() _postId, @Body() comment: Comentario, @Res() res: Response) {
        try {
            comment.criadoEm = new Date();
            comment.atualizadoEm = new Date();
            await this.commentService.createComment(_postId._postId, comment);

            let comments = await this.commentService.getCommentsById(_postId._postId);
            comments = comments["posts"].map(item => item.comentarios).flat();
            return res.status(201).send(comments[(Object.keys(comments).length) - 1]);
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

    @Put('/update/:_commentId/post/:_postId')
    async updateCommentById(@Param() _commentId, @Param() _postId, @Body() comment: Comentario, @Res() res: Response) {
        try {
            comment.atualizadoEm = new Date();
            await this.commentService.updateCommentById(_commentId._commentId, comment);
            const postInfos = await this.postService.getPostByPostId(_postId._postId);
            return res.status(201).send(postInfos[0].posts[0])
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