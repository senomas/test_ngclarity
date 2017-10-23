export interface Product {
  id?:string
  name?:string
  description?:string
  createdAt?:Date
}

export const ProductView = {
  "label": "Product",
  "list": [
    {
      "id": "id",
      "label": "ID",
      "schema": {
        "type": "String",
        "index": true,
        "length": 100
      }
    },
    {
      "id": "name",
      "label": "Name",
      "schema": {
        "type": "String",
        "index": true,
        "length": 100
      }
    }
  ],
  "edit": [
    {
      "id": "id",
      "label": "ID",
      "schema": {
        "type": "String",
        "index": true,
        "length": 100
      }
    },
    {
      "id": "name",
      "label": "Name",
      "schema": {
        "type": "String",
        "index": true,
        "length": 100
      }
    },
    {
      "id": "description",
      "label": "Description",
      "schema": {
        "type": "String",
        "length": 1000
      }
    }
  ],
  "id": "product"
};
