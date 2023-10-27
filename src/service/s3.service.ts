import { Injectable, StreamableFile } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { ReadStream, createReadStream } from "fs";
import { Readable } from "stream";

@Injectable()
export class S3Service {
    private supabase: SupabaseClient;

    constructor(private configService: ConfigService) {
        this.supabase = createClient(
            this.configService.get('s3.url'),
            this.configService.get('s3.key'),
            {
                auth: {
                    persistSession: false
                }
            }
        );
    }

    async uploadOnS3(file: Express.Multer.File) {
        return await this.supabase
            .storage
            .from('site_imagens_bucket')
            .upload(`post/${file.originalname}_${Date.now().toString()}`, file.buffer, {
                upsert: false,
                cacheControl: '3600',
                contentType: file.mimetype
            });
    }

    async createURL(path: string) {
        return await this.supabase
            .storage
            .from('site_imagens_bucket')
            .createSignedUrl(path, 31557600)
    }

} 