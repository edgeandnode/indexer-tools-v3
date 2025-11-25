import { loadDefaultsConfig, replaceAPI } from "./defaultsConfig";
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { configureLogger } from "./logger";
import { withQueryLogging } from "./queryLoggingLink";

const defaultsConfigVariables = await loadDefaultsConfig();
const defaultsConfig = defaultsConfigVariables.variables;
configureLogger(defaultsConfig.logLevel);

// HTTP connection to the API
const httpLink = withQueryLogging(
  'qos-subgraph',
  createHttpLink({
    uri: replaceAPI(defaultsConfig.qosSubgraph, defaultsConfig.apiKey),
  }),
);

const cache = new InMemoryCache();

export const qosSubgraphClient = new ApolloClient({
  link: httpLink,
  cache,
});
