# redux-wordpress

[![npm version](https://badge.fury.io/js/redux-wordpress.svg)](https://badge.fury.io/js/redux-wordpress) [![Build Status](https://travis-ci.org/eugene-manuilov/redux-wordpress.svg?branch=master)](https://travis-ci.org/eugene-manuilov/redux-wordpress)

This package is intended to help you to build Redux actions and reducers for WordPress REST API endpoints.

## Installation

NPM:

```
npm install redux-wordpress --save
```

Yarn:

```
yarn add redux-wordpress
```

## Usage

The package exports three function which you can use to create actions and build a reducer.

### createActions(name, host, endpoints, namespace)

Returns an object with a set of function which you can use to fetch data from REST API.

- **name** _(string)_ - Arbitrary name which will be used in action types to distinguish different actions.
- **host** _(string)_ - URL address to your API's root. Usually it will look like: `http://mysite.com/wp-json/`.
- **endpoints** _(array)_ - A list of endpoints which you want to build actions for. It could be something like `['posts', 'categories']`.
- **namespace** _(string)_ - Optional. The namespace for your endpoints. By default it is `wp/v2`.

```js
// actionCreators.js

import { createActions } from 'redux-wordpress';

const actions = createActions('my-api', 'http://mysite.test/wp-json/', ['books', 'authors']);
export default actions;

// will export:
//
// {
//     fetchBooks(params) { ... },
//     fetchBooksEndpoint(endpoint, params) { ... },
//     fetchBooksById(id, params) { ... },
//     fetchBooksEndpointById(id, endpoint, params) { ... },
//     fetchAllBooks(params) { ... },
//     fetchAllBooksEndpoint(endpoint, params) { ... },
//     fetchAllBooksEndpointById(id, endpoint, params) { ... },
//     fetchAuthors(params) { ... },
//     fetchAuthorsEndpoint(endpoint, params) { ... },
//     fetchAuthorsById(id, params) { ... },
//     fetchAuthorsEndpointById(id, endpoint, params) { ... },
//     fetchAllAuthors(params) { ... },
//     fetchAllAuthorsEndpoint(endpoint, params) { ... },
//     fetchAllAuthorsEndpointById(id, endpoint, params) { ... }
// }
```

### createReducer(name)

Returns a reducer function which you can use to catch data returned by a fetch action.

- **name** _(string)_ - A name which will be used to catch proper actions. It should be the same name as you passed to `createActions` function.

```js
// reducers.js

import { createReducer } from 'redux-wordpress';

const rootReducer = combineReducers({
    wp: createReducer('my-api') // name should match to what we passed to "createActions" function
});

export default rootReducer;
```
### createRequests(host, endpoints, namespace)

Helper function which generates request functions to endpoints which you can use to group multiple requests into one action:

- **host** _(string)_ - URL address to your API's root. Usually it will look like: `http://mysite.com/wp-json/`.
- **endpoints** _(array)_ - A list of endpoints which you want to build actions for. It could be something like `['posts', 'categories']`.
- **namespace** _(string)_ - Optional. The namespace for your endpoints. By default it is `wp/v2`.

```js
// actionCreators.js

import { createRequests } from 'redux-wordpress';

const requests = createRequests('my-api', 'http://mysite.test/wp-json/', ['books', 'authors']);

export function fetchInitialData() {
    return dispatch => {
        return Promise
            .all([
                requestBooks(...).then((data, response) => dispatch({action: 'books', data})),
                requestAuthors(...).then((data, response) => dispatch({action: 'authors', data}))
            ])
            .then(() => dispatch({action: 'loaded-initial-data'}));
    };
}
```

## Contribute

What to help or have a suggestion? Open a [new ticket](https://github.com/eugene-manuilov/redux-wordpress/issues/new) and we can discuss it or submit pull request. Please, make sure you run `npm test` before submitting a pull request.

## LICENSE

The MIT License (MIT)