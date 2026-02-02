import {defineConfig} from 'drizzle-kit';
import 'dotenv/config'

export default defineConfig({
    schema:'./src/config/db/schema.js',
    out:'./src/config/db',
    dialect:'postgresql',
    dbCredentials:{
        url:process.env.DATABASE_URL
    }
})