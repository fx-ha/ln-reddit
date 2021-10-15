### How to create initial migration file
- add ormconfig.json
```
{
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "postgres",
  "password": "postgres",
  "database": "reddit_clone_2",
  "entities": ["dist/entities/*.js"],
  "migrations": ["dist/migrations/*.js"]
}
```

- run:
```
npx typeorm migration:generate -n Initial
```
