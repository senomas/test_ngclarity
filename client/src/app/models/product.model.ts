export interface Product {
  id?: string;
  name?: string;
  description?: string;
}

export const Product_UI = {
  id: "product",
  label: "Product",
  fields: [
    {
      id: "id",
      label: "ID",
      control: {
        validator: {
          required: true,
          maxLength: 100
        }
      }
    },
    {
      id: "name",
      label: "Name",
      control: {
        validator: {
          required: true,
          maxLength: 100
        }
      }
    },
    {
      id: "description",
      label: "Description",
      control: {
        validator: {
          required: true,
          maxLength: 2000
        }
      }
    }
  ]
};
