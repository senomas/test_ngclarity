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
      "id": "email",
      "label": "Email"
    },
    {
      "id": "username",
      "label": "Username"
    },
    {
      "id": "dob",
      "label": "Date of Birth"
    }
  ],
  "edit": [
    {
      "id": "_id",
      "label": "ID"
    },
    {
      "id": "email",
      "label": "Email"
    },
    {
      "id": "name",
      "label": "Name"
    },
    {
      "id": "dob",
      "label": "Date of Birth",
      "type": "date"
    }
  ],
  "id": "user"
};
