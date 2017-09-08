const {
    Environment,
    Network,
    RecordSource,
    Store,
} = require('relay-runtime');

/**
 * See RelayNetwork.js:43 for details how it used in Relay
 */
function pollingSubscription(
  operation,
  variables,
  cacheConfig,
  config
) {
  let {onError, onNext} = config;

  let intervalId = setInterval(() => {
    fetchQuery(operation, variables).then(response => {
      if (process.env.NODE_ENV === 'development') {
        console.log(response);
      }
      onNext(response);
    }, error => {
      onError && onError(error)
    });
  }, 3333);

  return { dispose: () => clearInterval(intervalId) }
}

function fetchQuery(
    operation,
    variables
) {
  let query = {
    query: operation.text, // GraphQL text from input
    variables,
  };
  if (process.env.NODE_ENV === 'development') {
    console.log(query);
  }
  return fetch('http://api.cirrus-ci.org/graphql', {
        method: 'POST',
        credentials: 'include', // cookies
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(query),
    }).then(response => {
        return response.json();
    });
}

// Create a network layer from the fetch function
const network = Network.create(fetchQuery, pollingSubscription);

const source = new RecordSource();
const store = new Store(source);

export default new Environment({
    network,
    store,
});