/** AUTO-GENERATE FILES */

export interface Auth {
  username?: String
  token?: String
  attempts?: {
    time?: Date
    secret?: String
  }[]
}

export interface Meta {
  id?: String
  value?: String
}

export interface Role {
  code?: String
  name?: String
  permissions?: String[]
}

export interface User {
  name?: String
  username?: String
  password?: String
  roles?: String[]
  avatar?: String
  email?: String
  dob?: Date
  phone?: String
  address?: {
    street?: String
    suite?: String
    city?: String
    zipcode?: String
    geo?: Number[]
  }
  website?: String
  company?: {
    name?: String
    catchPhrase?: String
    bs?: String
  }
  createdAt?: Date
}
