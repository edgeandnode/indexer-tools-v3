import { loadDefaultsConfig, replaceAPI } from "./defaultsConfig";
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { configureLogger } from "./logger";
import { withQueryLogging } from "./queryLoggingLink";

const defaultsConfigVariables = await loadDefaultsConfig();
const defaultsConfig = defaultsConfigVariables.variables;
configureLogger(defaultsConfig.logLevel);
// HTTP connection to the API
const httpLink = withQueryLogging(
  'graph-network-mainnet',
  createHttpLink({
    uri: replaceAPI(defaultsConfig.subgraphMainnet, defaultsConfig.apiKey),
  }),
);

const arbitrumHttpLink = withQueryLogging(
  'graph-network-arbitrum',
  createHttpLink({
    uri: replaceAPI(defaultsConfig.subgraphArbitrum, defaultsConfig.apiKey),
  }),
);

const sepoliaHttpLink = withQueryLogging(
  'graph-network-sepolia',
  createHttpLink({
    uri: replaceAPI(defaultsConfig.subgraphSepolia, defaultsConfig.apiKey),
  }),
);

const arbitrumSepoliaHttpLink = withQueryLogging(
  'graph-network-arbitrum-sepolia',
  createHttpLink({
    uri: replaceAPI(defaultsConfig.subgraphArbitrumSepolia, defaultsConfig.apiKey),
  }),
);

// Cache implementation
const cache = new InMemoryCache();
const arbitrumCache = new InMemoryCache();
const sepoliaCache = new InMemoryCache();
const arbitrumSepoliaCache = new InMemoryCache();

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
});

export const arbitrumApolloClient = new ApolloClient({
  link: arbitrumHttpLink,
  cache: arbitrumCache,
});

export const sepoliaApolloClient = new ApolloClient({
  link: sepoliaHttpLink,
  cache: sepoliaCache,
});

export const arbitrumSepoliaApolloClient = new ApolloClient({
  link: arbitrumSepoliaHttpLink,
  cache: arbitrumSepoliaCache,
});
