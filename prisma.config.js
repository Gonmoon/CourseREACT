import { defineConfig } from '@prisma/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import "dotenv/config";

export default defineConfig({
  earlyAccess: true,
  datasource: {
    url: process.env.DATABASE_URL,
    adapter: new PrismaPg(new Pool({ 
      connectionString: process.env.DATABASE_URL 
    })),
  },
});
