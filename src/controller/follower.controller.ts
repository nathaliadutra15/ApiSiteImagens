import { Body, Controller, Delete, Get, Param, Post, Put, Res } from "@nestjs/common";
import { Response } from 'express';
import { FollowerService } from "src/service/follower.service";

@Controller('')
export class FollowerController {
    constructor(private followerService: FollowerService) { }

    @Post('/follow/:_seguidor/:_seguido')
    async followUser(@Param() _seguidor, @Param() _seguido, @Res() res: Response) {
        try {
            const seguidores = await this.followerService.followUser(_seguidor._seguidor, _seguido._seguido);
            return res.status(201).send(seguidores)
        } catch (error) {
            return res.status(500).send({ message: error })
        }
    }
}