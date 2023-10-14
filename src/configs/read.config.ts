export default () => (
    {
        mongoConfig: {
            user: process.env.DATABASE_USER as string,
            password: process.env.DATABASE_PASSWORD as string
        }
    }
);