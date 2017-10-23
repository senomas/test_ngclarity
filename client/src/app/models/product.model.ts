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
      "label": "ID"
    },
    {
      "id": "name",
      "label": "Name"
    }
  ],
  "id": "product"
};
