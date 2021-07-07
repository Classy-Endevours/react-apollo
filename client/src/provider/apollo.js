import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import { onError } from "apollo-link-error";
import ApolloClient from "apollo-boost";
const errorLink = (
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
        return forward(operation);
        // if you would also like to retry automatically on
      // network errors, we recommend that you use
      // apollo-link-retry
    }
  }
);
const client = new ApolloClient({
  uri: "https://rickandmortyapi.com/graphql1/",
  onError: errorLink,
});

export default function ApolloCustomProvider({ children }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
