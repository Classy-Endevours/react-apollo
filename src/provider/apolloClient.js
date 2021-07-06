import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from "@apollo/client";
import { onError } from "apollo-link-error";
import { fromPromise } from "apollo-link";

let apolloClient;
const getNewToken = () => {
  return apolloClient.query({ query: '' }).then((response) => {
    // extract your accessToken from your response data and return it
    const { accessToken } = response.data;
    return accessToken;
  });
};

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
