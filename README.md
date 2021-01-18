Recipe Box API

This app allows users to add their recipes and give them a tag so they are easier to find!

A live version of the app can be found at https://recipe-box-12.vercel.app/

The front end code can be found at https://github.com/LeahArden175/recipe-box-client

-------------------------

Back End

    -Node and Express
        -Authentication via JWT
        -RESTful Api

    -Testing
        -Supertest (integration)
        -Mocha and Chai (unit)

    -DataBase    
        -Postgres
        -Knex.js

Production

    -Deployed using Heroku

-------------------------

## Local dev setup

```bash
mv example.env .env
createdb -U YOUR_USER_NAME recipe-box
createdb -U YOUR-USER-NAME recipe-box-test
```

And `npm test` should work at this point

## Configuring Postgres

For tests involving time to run properly, configure your Postgres database to run in the UTC timezone.

1. Locate the `postgresql.conf` file for your Postgres installation.
   1. E.g. for an OS X, Homebrew install: `/usr/local/var/postgres/postgresql.conf`
   2. E.g. on Windows, _maybe_: `C:\Program Files\PostgreSQL\11.2\data\postgresql.conf`
   3. E.g  on Ubuntu 18.04 probably: '/etc/postgresql/10/main/postgresql.conf'
2. Find the `timezone` line and set it to `UTC`:

```conf
# - Locale and Formatting -

datestyle = 'iso, mdy'
#intervalstyle = 'postgres'
timezone = 'UTC'
#timezone_abbreviations = 'Default'     # Select the set of available time zone
```

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests mode `npm test`

Run the migrations up `npm run migrate`

Run the migrations down `npm run migrate -- 0`
