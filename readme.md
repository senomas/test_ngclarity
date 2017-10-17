# BTNHACK

## DOCKER

``` bash
docker rm -f kaching-mongo
docker rm -f kaching-mongo-express

docker run --name kaching-mongo -p 27017:27017 -d mongo --auth

docker exec -it kaching-mongo mongo admin
db.createUser({ user: 'admin', pwd: 'dodol123', roles: [ "root" ] });
exit

docker run --name kaching-mongo-express --link kaching-mongo:mongo -p 8081:8081 -d -e ME_CONFIG_MONGODB_ADMINUSERNAME=admin -e ME_CONFIG_MONGODB_ADMINPASSWORD=dodol123 mongo-express

docker exec -it kaching-mongo mongo btnhack -u admin -p dodol123
use btnhack
db.createUser({ user: 'btnhack', pwd: 'dodol123', roles: [ { role: "readWrite", db: "btnhack" } ] });
db.createCollection('users');
```

User mongo-express to create database "kaching" and collection "users"
