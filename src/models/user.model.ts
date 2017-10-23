import * as moment from "moment";

export interface User {
  name?: string;
  username?: string;
  avatar?: string;
  email?: string;
  dob?: Date;
  phone?: string;
  address: {
    street?: string;
    suite?: string;
    city?: string;
    zipcode?: string;
    geo?: {
      lat?: string;
      lng?: string;
    };
  }
  website?: string;
  company?: {
    name?: string;
    catchPhrase?: string;
    bs?: string;
  };
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
      type: "date",
      control: {
        format: v => moment(v).format("DD/MM/YYYY"),
        parse: v => moment(v, "DD/MM/YYYY").toDate(),
        edit_format: v => moment(v).format("YYYY-MM-DD"),
        edit_parse: v => moment(v, "YYYY-MM-DD").toDate(),
        validator: {
          required: true,
          maxLength: 20
        }
      }
    }
  ]
};
