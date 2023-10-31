import { Injectable } from "@nestjs/common";
import { Postagem } from "src/dto/user.dto";
import { S3Service } from "./s3.service";
const userMongoDB = require('../dto/user.schema.mongo');


@Injectable()
export class PostService {
    constructor(private s3Service: S3Service) { }

    async createPost(userId: string, post: Postagem) {
        try {
            return userMongoDB.updateOne({ _id: userId }, { $push: { "posts": post } });
        } catch (error) {
            return error;
        }
    }

    getPostsByUsername(username: string) {
        try {
            return userMongoDB.find({ usuario: username }, { "_id": 1, "usuario": 1, "pathFotoPerfil": 1, "posts": 1 }).exec();
        } catch (error) {
            return error;
        }
    }

    getPostByPostId(postId: string) {
        try {
            return userMongoDB.find({ "posts._id": postId }, { "_id": 0, "posts": { "$elemMatch": { "_id": postId } } }).exec();
        } catch (error) {
            return error;
        }
    }

    getPosts() {
        try {
            return userMongoDB.find({ $expr: { $gt: [{ $size: "$posts" }, 0] } }, { "_id": 1, "usuario": 1, "pathFotoPerfil": 1, "posts": 1 }).exec();
        } catch (error) {
            return error;
        }
    }

    updatePostById(postId: string, post: Postagem) {
        let postUpdates = {};

        Object.keys(post).map(key => {
            postUpdates[`posts.$.${key}`] = post[key]
        })

        try {
            return userMongoDB.updateOne({ "posts._id": postId }, { $set: postUpdates });
        } catch (error) {
            return error;
        }
    }

    async deletePostById(postId: string) {
        try {
            const postInfo = await this.getPostByPostId(postId);
            await this.s3Service.deleteImg(postInfo[0].posts[0].pathFotoPost);

            return userMongoDB.updateOne(
                { "posts._id": postId },
                { $pull: { "posts": { _id: postId } } },
                { arrayFilters: [{ 'r._id': postId }] }
            );
        } catch (error) {
            return error;
        }
    }

    async likePostById(postId: string, username: String) {
        try {
            let likes = await this.getPostByPostId(postId);

            if (likes[0].posts[0].curtidas.includes(username)) {
                return userMongoDB.updateOne(
                    { "posts._id": postId },
                    { $pull: { 'posts.$.curtidas': { $in: [username] } } }
                );
            } else {
                return userMongoDB.updateOne(
                    { "posts._id": postId },
                    { $push: { 'posts.$[r].curtidas': username } },
                    { arrayFilters: [{ 'r._id': postId }] }
                );
            }
        } catch (error) {
            return error;
        }
    }
} 