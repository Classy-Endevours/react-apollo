import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
  createHttpLink,
  gql,
} from "@apollo/client";
import { onError } from "apollo-link-error";
import { fromPromise } from "apollo-link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setContext } from "@apollo/client/link/context";
import { AUTH_TOKEN } from "../constant/app";

const query = gql`
  query refreshToken($token: String!) {
    refreshToken(token: $token) {
      token
    }
  }
`;
let client;
const getNewToken = async () => {
  try {
    const { data } = await client.query({
      query,
      variables: {
        token: localStorage.getItem(AUTH_TOKEN),
      },
    });
    console.log("here", data);
    // extract your accessToken from your response data and return it
    const { token } = data.refreshToken;
    localStorage.setItem(AUTH_TOKEN, token);
    return token;
  } catch (error) {
    console.error({error})
    window.history.replaceState(null, null, "/#/login");
    window.location.reload( );
  }
};

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem(AUTH_TOKEN);
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        toast.error(err.message);
        switch (err.message) {
          case "Unauthenticated!":
            // error code is set to UNAUTHENTICATED
            // when AuthenticationError thrown in resolver
            // modify the operation context with a new token
            fromPromise(
              getNewToken().catch((error) => {
                // Handle token refresh errors e.g clear stored tokens, redirect to login
                return;
              })
            )
              .filter((value) => Boolean(value))
              .flatMap((accessToken) => {
                const oldHeaders = operation.getContext().headers;
                // modify the operation context with a new token
                operation.setContext({
                  headers: {
                    ...oldHeaders,
                    authorization: `Bearer ${accessToken}`,
                  },
                });

                // retry the request, returning the new observable
                return forward(operation);
              });
            break;
          default:
            return null;
        }
      }
    }
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
      // retry automatically
      // return forward(operation);
      // if you would also like to retry automatically on
      // network errors, we recommend that you use
      // apollo-link-retry
    }
  }
);

const httpLink = createHttpLink({
  uri: "http://localhost:3001/graphql/",
});

const link = from([
  authLink,
  errorLink,
  new HttpLink({
    uri: "http://localhost:3000/graphql/",
  }),
]);

client = new ApolloClient({
  cache: new InMemoryCache(),
  link: errorLink.concat(authLink.concat(httpLink)),
});

export default function ApolloCustomProvider({ children }) {
  return (
    <ApolloProvider client={client}>
      <ToastContainer />
      {children}
    </ApolloProvider>
  );
}
