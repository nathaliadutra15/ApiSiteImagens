export default () => (
    {
        mongoConfig: {
            user: process.env.DATABASE_USER as string,
            password: process.env.DATABASE_PASSWORD as string
        },
        jwtConstants: {
            secret: process.env.JWT_SECRET as string
        },
        s3: {
            url: process.env.S3_URL as string,
            key: process.env.S3_KEY as string
        }
    }
);