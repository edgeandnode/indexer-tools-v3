import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { withQueryLogging } from "./queryLoggingLink";

// HTTP connection to the API
const httpLink = withQueryLogging(
  'upgrade-indexer',
  createHttpLink({
    uri: "https://indexer.upgrade.thegraph.com/status",
  }),
);

const cache = new InMemoryCache();

export const upgradeIndexerClient = new ApolloClient({
  link: httpLink,
  cache,
});
