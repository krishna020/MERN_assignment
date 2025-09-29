require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `);

    // Categories
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL
      );
    `);

    // Transactions
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        amount NUMERIC(12,2) NOT NULL,
        type TEXT CHECK(type IN ('income','expense')) NOT NULL,
        category_id INTEGER REFERENCES categories(id),
        description TEXT,
        transaction_date TIMESTAMPTZ DEFAULT now(),
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `);

    // indexes
    await client.query(`CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, transaction_date);`);

    // seed categories
    const categories = ['Food','Transport','Entertainment','Salary','Utilities','Others'];
    for (const c of categories) {
      await client.query(`INSERT INTO categories(name) VALUES($1) ON CONFLICT DO NOTHING;`, [c]);
    }

   
    const adminEmail = 'krishnasahu@gmail.com';
    const adminPass = 'password';
    const hashed = await bcrypt.hash(adminPass, parseInt(process.env.BCRYPT_SALT_ROUNDS || 10));
    await client.query(
      `INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4) ON CONFLICT (email) DO NOTHING;`,
      ['Admin', adminEmail, hashed, 'admin']
    );

    await client.query('COMMIT');
    console.log('DB initialized. Admin user: admin@local / Admin@123');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
  } finally {
    client.release();
    pool.end();
  }
}

run();
