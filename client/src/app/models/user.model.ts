export interface User {
  name?:string
  username?:string
  avatar?:String
  email?:string
  dob?:Date
  phone?:String
  address?: {
    street?:String
    suite?:String
    city?:String
    zipcode?:String
    geo?: {
      lat?:String
      lng?:String
    }
  }
  website?:String
  company?: {
    name?:String
    catchPhrase?:String
    bs?:String
  }
  createdAt?:Date
}

export const UserView = {
  "label": "User",
  "list": [
    {
      "id": "_id",
      "label": "ID"
    },
    {
      "id": "username",
      "label": "Username",
      "schema": {
        "type": "String",
        "index": {
          "unique": true
        },
        "required": true,
        "minLength": 3,
        "length": 200
      }
    },
    {
      "id": "address.city",
      "label": "City"
    },
    {
      "id": "dob",
      "label": "Date of Birth",
      "schema": {
        "type": "Date",
        "required": true
      }
    }
  ],
  "edit": [
    {
      "id": "_id",
      "label": "ID",
      "readonly": true
    },
    {
      "label": "Username",
      "items": [
        {
          "id": "username",
          "label": "Username",
          "schema": {
            "type": "String",
            "index": {
              "unique": true
            },
            "required": true,
            "minLength": 3,
            "length": 200
          }
        },
        {
          "id": "email",
          "label": "Email",
          "schema": {
            "type": "String",
            "index": {
              "unique": true
            },
            "required": true,
            "email": true,
            "minLength": 3,
            "length": 200
          }
        }
      ]
    },
    {
      "id": "name",
      "label": "Name",
      "schema": {
        "type": "String",
        "index": true,
        "required": true,
        "minLength": 3,
        "length": 200
      }
    },
    {
      "id": "address.city",
      "label": "City"
    },
    {
      "id": "phone",
      "label": "Phone"
    },
    {
      "id": "dob",
      "label": "Date of Birth",
      "schema": {
        "type": "Date",
        "required": true
      }
    }
  ],
  "id": "user"
};
