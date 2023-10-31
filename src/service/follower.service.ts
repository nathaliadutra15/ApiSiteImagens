import { Injectable } from "@nestjs/common";
import { UserService } from "./user.service";
const userMongoDB = require('../dto/user.schema.mongo');


@Injectable()
export class FollowerService {
    constructor(private userService: UserService) {}

    async followUser(seguidor: string, seguido: string) {
        try {

            let userSeguidor = await this.userService.getUserByUsername(seguidor);
            let userSeguido = await this.userService.getUserByUsername(seguido);

            if (!userSeguidor[0].seguindo.includes(userSeguido[0].usuario)) {
                await userMongoDB.updateOne(
                    { "usuario": seguidor },
                    { $push: { 'seguindo': userSeguido[0].usuario } }
                )

                await userMongoDB.updateOne(
                    { "usuario": seguido },
                    { $push: { 'seguidores': userSeguidor[0].usuario } }
                )

            } else {
                await userMongoDB.updateOne(
                    { "usuario": seguidor },
                    { $pull: { 'seguindo': { $in: [userSeguido[0].usuario] } } }
                )

                await userMongoDB.updateOne(
                    { "usuario": seguido },
                    { $pull: { 'seguidores': { $in: [userSeguidor[0].usuario] } } }
                )
            }
            return {};
        } catch (error) {
            return error;
        }
    }
} 