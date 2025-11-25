import { ApolloLink } from '@apollo/client/core';
import { logger } from './logger';

const toSerializable = (value) => {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (_err) {
    return '[unserializable]';
  }
};

const createLoggingLink = (clientName) =>
  new ApolloLink((operation, forward) => {
    if (!forward) {
      return null;
    }

    const operationName = operation.operationName || 'anonymous';
    const startedAt = Date.now();

    logger.info('graphql.request', {
      client: clientName,
      operation: operationName,
      variables: toSerializable(operation.variables),
    });

    return forward(operation).map((result) => {
      const durationMs = Date.now() - startedAt;
      const hasErrors = Boolean(result.errors && result.errors.length);

      logger[hasErrors ? 'warn' : 'debug']('graphql.response', {
        client: clientName,
        operation: operationName,
        durationMs,
        errors: result.errors?.map((error) => error.message),
      });

      return result;
    });
  });

export const withQueryLogging = (clientName, httpLink) =>
  ApolloLink.from([createLoggingLink(clientName), httpLink]);
