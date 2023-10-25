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

    async uploadOnS3(file: Express.Multer.File): Promise<any> {
        try {
            return await this.supabase
                .storage
                .from('site_imagens_bucket')
                .upload(`post/a5d0cb1d2ca368e71926b546dadbdafb`, file.buffer, {
                    upsert: false,
                    cacheControl: '3600',
                    contentType: file.mimetype
                });
        } catch (error) {
            return error;
        }

    }

} 