import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
// import { onError } from "apollo-link-error";
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    console.log({ graphQLErrors, networkError });

    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        switch (err.extensions.code) {
          case "UNAUTHENTICATED":
            // error code is set to UNAUTHENTICATED
            // when AuthenticationError thrown in resolver

            // modify the operation context with a new token
            const oldHeaders = operation.getContext().headers;
            operation.setContext({
              headers: {
                ...oldHeaders,
                authorization: () => {},
              },
            });
            // retry the request, returning the new observable
            return forward(operation);
          default:
            return null;
        }
      }
    }
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
      // retry automatically
      return forward(operation);
      // if you would also like to retry automatically on
      // network errors, we recommend that you use
      // apollo-link-retry
    }
  }
);

const link = from([
  errorLink,
  new HttpLink({
    uri: "https://rickandmortyapi.com/graphql/",
  })
])

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
});

export default function ApolloCustomProvider({ children }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
