import { Injectable } from "@nestjs/common";
import { User } from "src/dto/user.dto";
const userMongoDB = require('../dto/user.schema.mongo');
import * as bcrypt from 'bcrypt';
import { S3Service } from "./s3.service";


@Injectable()
export class UserService {
    constructor(private s3Service: S3Service) { }

    async setUser(user: User) {
        try {
            user = {...user, senha: await bcrypt.hash(user.senha, 10)} // Senha criptografada antes de enviar para o banco
            return userMongoDB.create(user);
        } catch (error) {
            return error;
        }
    }

    getAllUsers() {
        try {
            return userMongoDB.find();
        } catch (error) {
            return error;
        }
    }

     getUserByUsername(username: String) {
        try {
            return userMongoDB.find({ usuario: username }).exec();
        } catch (error) {
            return error;
        }
    }

    getUserByEmail(email: String) {
        try {
            return userMongoDB.find({ email: email }).exec();
        } catch (error) {
            return error;
        }
    }

    updateUser(username: String, user: User) {
        let userUpdates = {};

        Object.keys(user).map(key => {
            userUpdates[key] = user[key]
        })
        
        try {
            return userMongoDB.updateOne( { usuario: username }, { $set: userUpdates }).exec();
        } catch (error) {
            return error;
        }
    }
 
    async deleteUser(username: String) {
        try {
            const userInfo = await this.getUserByUsername(username);
            await this.s3Service.deleteImg(userInfo[0].pathFotoPerfil);

            return userMongoDB.deleteOne({ usuario: username });
        } catch (error) {
            return error;
        }
    }
} 