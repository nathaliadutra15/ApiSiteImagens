export default () => (
    {
        mongoConfig: {
            user: process.env.DATABASE_USER as string,
            password: process.env.DATABASE_PASSWORD as string
        },
        s3: {
            awsAccessKey: process.env.S3_ACCESS_KEY as string,
            awsSecretKey: process.env.S3_SECRET_KEY as string
        }
    }
);