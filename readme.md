# ANGULAR CLARITY MONGODB

## TOOLS

[httpie](https://httpie.org/)

## TEST

http post localhost:3000/api/user/find page:='{"from":0,"to":9,"size":10}' sort:='{"by":"email","reverse":false}' filters:='[{"property":"email","value":"doe"}]'

http post localhost:3000/api/user/find page:='{"size":1}' filters:='[{ "address.geo": { "$near": [ 131.399, 32.2014 ], "$maxDistance": 0.000156961230576 }}]'

## SETUP MONGO USER

``` bash
docker exec -it btnhack_mongo_1 mongo admin
db.createUser({ user: 'admin', pwd: 'dodol123', roles: [ "root" ] });
exit

docker exec -it btnhack_mongo_1 mongo admin -u admin -p dodol123
use btnhack
db.createUser({ user: 'btnhack', pwd: 'dodol123', roles: [ { role: "readWrite", db: "btnhack" } ] });
```


## HOW TO MAKE CRUD

1.	create <file_model_name>.yaml at ..\btnhackathon\src\models

		example : blog.yaml
``` yaml
			schema:
				id: 
					type: String
					index: true
					length: 100
				title: 
					type: String
					length: 200
				content:
					type: String
					length: 1000
				author:
					type: String
					length: 100
				createdAt: Date

			view:
				label: Blog
				list:
					- id: id
						label: ID
					- id: title
						label: Title
					- id: content
						label: Content
					- id: author
						label: Author
				edit:
					- id: id
						label: ID
					- id: title
						label: Title
					- id: content
						label: Content
					- id: author
						label: Author
```						
2.	after save will be created blog.ts and blog.model.ts in path ..\btnhackathon\src\.models
3.	edit ..\btnhackathon\src\models\models.ts
		add:
```ts		
			import { BlogModel, BlogSchema } from "../.models/blog";
			import { Blog } from "../.models/blog.model";		
			
			export class Models {
				constructor(public conn: mongoose.Connection) {}
				...
				blog: Model<BlogModel> = this.conn.model<BlogModel>("blog", BlogSchema);
			}
```		
4.	Now we have created for model on server nodejs

5. 	edit ..\btnhackathon\client\src\app\app.service.ts
```ts	
			import { Blog } from "./models/blog.model";
			
			export class AppService {
				public blogRepo = new Repository<Blog>(this.http, "blog");
```				
6.	edit ..\btnhackathon\client\src\app\app.routing.ts
```ts
			import { BlogView } from "./models/blog.model";
			
			...
				{
					path: "blog",
					component: GenericListComponent,
					data: { ui: BlogView }
				},
				{
					path: "blog/:id",
					component: GenericEditComponent,
					data: { ui: BlogView }
				},
				{
					path: "blog-new",
					component: GenericEditComponent,
					data: { ui: BlogView }
				}
```
7. 	Now we have created for app client service, 
		test use API on command prompt:
```httpie		
			http post localhost:3000/api/blog/find page:=0
```		
		test on browser open url:
```url		
			http://localhost:3000/blog
```			
8. 	To view on menu, edit file ...\btnhackathon\client\src\app\app.component.ts
```ts
			items: any[] = [
				...
				{ id: "blog", label: "Blog" },
				...
			];
```		
9. 	Open browser : http://localhost:3000, open rightsidebar, will be appear Blog menu