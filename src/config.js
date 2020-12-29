module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://leaharden@localhost/recipe-box',
  TEST_DATABSE_URL: process.env.TEST_DATABASE_URL || 'postgresql://leaharden@localhost/recipe-box-test',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
}