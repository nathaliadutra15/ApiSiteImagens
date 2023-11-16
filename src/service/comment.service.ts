import { Injectable } from "@nestjs/common";
import { Comentario } from "../dto/user.dto";
const userMongoDB = require('../dto/user.schema.mongo');


@Injectable()
export class CommentService {

    createComment(postId: string, comment: Comentario) {
        try {
            return userMongoDB.updateOne({ "posts._id": postId }, { $push: { "posts.$.comentarios": comment } });
        } catch (error) {
            return error;
        }
    }

    getCommentsById(postId: string) {
        try {
            return userMongoDB.findOne({ "posts._id": postId }, "posts.comentarios.$").exec();
        } catch (error) {
            return error;
        }
    }

    updateCommentById (commentId: string, comment: Comentario) {
      
        let commentUpdates = {};

        Object.keys(comment).map(key => {
            commentUpdates[`posts.$.comentarios.$[r].${key}`] = comment[key];
        });

        try {
            return userMongoDB.updateOne(
                { "posts.comentarios._id": commentId },
                { $set: commentUpdates },
                { arrayFilters: [{ 'r._id': commentId }] }
            );
        } catch (error) {
            return error;
        }
    }

    deleteCommentById(commentId: string) {
        try {
            return userMongoDB.updateOne(
                { "posts.comentarios._id": commentId },
                { $pull: { "posts.$.comentarios": { _id: commentId } } },
                { arrayFilters: [{ 'r._id': commentId }] }
            );
        } catch (error) {
            return error;
        }
    }
} 