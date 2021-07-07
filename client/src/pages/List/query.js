
import { gql } from "@apollo/client";

export const GET_ALL_EVENTS =  gql`
query{
  events {
      _id
      title
      description
      price
      date
      creator {
          email
      }
  }
}
`;