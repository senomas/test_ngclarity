# ANGULAR CLARITY MONGODB

## INSTALL ANGULAR CLI

``` bash
npm install -g @angular/cli
```

## TOOLS

[httpie](https://httpie.org/)

## TEST

http post localhost:3000/api/user/find page:='{"from":0,"to":9,"size":10}' sort:='{"by":"email","reverse":false}' filters:='[{"property":"email","value":"doe"}]'

## SETUP MONGO USER

``` bash
docker exec -it btnhack_mongo_1 mongo admin
db.createUser({ user: 'admin', pwd: 'dodol123', roles: [ "root" ] });
exit

docker exec -it btnhack_mongo_1 mongo admin -u admin -p dodol123
use btnhack
db.createUser({ user: 'btnhack', pwd: 'dodol123', roles: [ { role: "readWrite", db: "btnhack" } ] });
```
