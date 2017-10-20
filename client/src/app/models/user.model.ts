import * as moment from "moment";

export interface User {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  birthdate?: Date;
  createdAt?: Date;
}

export const User_UI = {
  id: "user",
  label: "User",
  fields: [
    {
      id: "_id",
      label: "ID",
      readonly: true,
      control: {
        validator: { required: true }
      }
    },
    {
      id: "email",
      label: "Email",
      valueClass: "col-lg-8 col-md-8 col-sm-12 col-xs-12",
      detailOnly: true,
      control: {
        validator: {
          required: true,
          maxLength: 100,
          email: true
        }
      }
    },
    {
      id: "name",
      label: "Name",
      controls: [
        {
          id: "firstName",
          label: "First name",
          size: "40",
          control: {
            validator: {
              required: true,
              maxLength: 100
            }
          }
        },
        {
          id: "lastName",
          label: "Last name",
          size: "40",
          control: {
            validator: {
              required: true,
              maxLength: 100
            }
          }
        }
      ]
    },
    {
      id: "birthdate",
      label: "Birthdate",
      control: {
        format: v => moment(v).format("DD/MM/YYYY"),
        parse: v => moment(v, "DD/MM/YYYY").toDate(),
        validator: {
          required: true,
          maxLength: 20
        }
      }
    }
  ]
};
