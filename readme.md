# BTNHACK

## TOOLS

[httpie](https://httpie.org/)

## TEST

http post localhost:3000/api/user/find page:='{"from":0,"to":9,"size":10}' sort:='{"by":"email","reverse":false}' filters:='[{"property":"email","value":"doe"}]'

## DOCKER

``` bash
docker rm -f btnhack-mongo
docker rm -f btnhack-mongo-express

docker run --name btnhack-mongo -p 27017:27017 -d mongo --auth

docker exec -it btnhack-mongo mongo admin
db.createUser({ user: 'admin', pwd: 'dodol123', roles: [ "root" ] });
exit

docker run --name btnhack-mongo-express --link btnhack-mongo:mongo -p 8081:8081 -d -e ME_CONFIG_MONGODB_ADMINUSERNAME=admin -e ME_CONFIG_MONGODB_ADMINPASSWORD=dodol123 mongo-express

docker exec -it btnhack-mongo mongo admin -u admin -p dodol123
use btnhack
db.createUser({ user: 'btnhack', pwd: 'dodol123', roles: [ { role: "readWrite", db: "btnhack" } ] });
db.createCollection('users');
```
