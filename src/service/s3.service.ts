import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SupabaseClient, createClient } from "@supabase/supabase-js";

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

    async uploadOnS3(origin: string, file: Express.Multer.File) {
        const path = await this.pathUpload(origin, file);
        return await this.createURL(path.data.path);
    }

    async createURL(path: string) {
        return await this.supabase
            .storage
            .from('site_imagens_bucket')
            .createSignedUrl(path, 31557600)
    }

    async pathUpload(origin: string, file: Express.Multer.File) {
        return await this.supabase
            .storage
            .from('site_imagens_bucket')
            .upload(`${origin}/${file.originalname}_${Date.now().toString()}`, file.buffer, {
                upsert: false,
                cacheControl: '3600',
                contentType: file.mimetype
            });
    }

     async deleteImg(url: string) {
        const path = url.substring(url.search('site_imagens_bucket'), url.search('.?token')).slice(20);
        return await this.supabase
            .storage
            .from('site_imagens_bucket')
            .remove([`${path}`])
    }

} 