
import {
    gql
} from "@apollo/client";
  
export const LOGIN_MUTATION = gql`
mutation {
  login(userInput: {email: "test@test.com", password: "test"}){
      email
      password
  }
}
`;
