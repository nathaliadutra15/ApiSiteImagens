import { Injectable } from "@nestjs/common";
import mongoose from "mongoose";
import { ConfigService } from '@nestjs/config';


@Injectable()
export class DBConnection {
    constructor(
        private configService: ConfigService
    ) {
        const databaseUser = this.configService.get('mongoConfig.user');
        const databasePass = this.configService.get('mongoConfig.password');

        mongoose.connect(`mongodb+srv://${databaseUser}:${databasePass}@clustersiteimagens.fjfxopf.mongodb.net/?retryWrites=true&w=majority`)
            .then(() => {
                console.log("BANCO MONGODB CONECTADO");
            }).catch((err) => console.log(err));
    }
}