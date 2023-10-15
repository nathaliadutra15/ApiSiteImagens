import { Injectable } from "@nestjs/common";
const userMongoDB = require('../dto/user.schema.mongo');


@Injectable()
export class FollowerService {

    getUserById(id: string) {
        try {
            return userMongoDB.find({ _id: id }).exec();
        } catch (error) {
            return error;
        }
    }

    async followUser(seguidorId: string, seguidoId: string) {
        try {
            let userSeguidor = await this.getUserById(seguidorId);
            let userSeguido = await this.getUserById(seguidoId);

            if (!userSeguidor[0].seguindo.includes(userSeguido[0].usuario)) {
                await userMongoDB.updateOne(
                    { "_id": seguidorId },
                    { $push: { 'seguindo': userSeguido[0].usuario } }
                )

                await userMongoDB.updateOne(
                    { "_id": seguidoId },
                    { $push: { 'seguidores': userSeguidor[0].usuario } }
                )

            } else {
                await userMongoDB.updateOne(
                    { "_id": seguidorId },
                    { $pull: { 'seguindo': { $in: [userSeguido[0].usuario] } } }
                )

                await userMongoDB.updateOne(
                    { "_id": seguidoId },
                    { $pull: { 'seguidores': { $in: [userSeguidor[0].usuario] } } }
                )
            }
            return {};
        } catch (error) {
            return error;
        }
    }
} 