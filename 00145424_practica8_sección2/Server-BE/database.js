import pkg from 'pg'
const { Pool } = pkg

export const pool = new Pool({
  user: 'neondb_owner',
  host: 'ep-curly-sound-ahcrxe5b-pooler.c-3.us-east-1.aws.neon.tech',
  database: 'neondb',
  password: 'npg_WUmQdXwNZ2f6',
  ssl: { rejectUnauthorized: false },
})
/**Gracias a este codigo nos conectamos a la base de datos en la nube */