# Redux WordPress

This package is intended to help to build Redux actions and reducers for WordPress REST API endpoints. **This package is not ready yet**, so please, don't use it in your projects.

## The idea

The main idea behind this package is to create helper functions which will allow us to easily generate action functions and reducers for custom WordPress REST API endpoints. It could be something like this:

```js
// actionCreators.js

import { createActions } from 'redux-wordpress';

export default createActions('my-api', 'http://mysite.test/wp-json/', ['books', 'authors']);

// will export:
//
// {
//     fetchBooks(params) { ... },
//     fetchAuthors(params) { ... }
// }
```

```js
// reducers.js

import { createReducer } from 'redux-wordpress';

const rootReducer = combineReducers({
    wp: createReducer('my-api') // name should match to what we passed to "createActions" function
});

export default rootReducer;
```

Generated reducer will listen to action types dispatched from actions and update state using endpoint names as holders for received data. It will look like this:

```json
{
    "books": {
        "total": 999,
        "totalPages": 999,
        "results": [{}, {}, {}]
    },
    "authors": {
        "total": 999,
        "totalPages": 999,
        "results": [{}, {}, {}]
    }
}
```

## Contribute

What to help or have a suggestion? Open a [new ticket](https://github.com/eugene-manuilov/redux-wordpress/issues/new) and we can discuss it or submit pull request. Please, make sure you run `npm run test` before submitting a pull request.

## LICENSE

The MIT License (MIT)