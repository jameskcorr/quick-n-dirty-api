# quick-n-dirty-api

[![NPM](https://nodei.co/npm/quickndirtyapi.png?downloads=true&stars=true)](https://nodei.co/npm/quickndirtyapi/)

[![NPM](https://nodei.co/npm-dl/quickndirtyapi.png?months=6)](https://nodei.co/npm/quickndirtyapi/)

Install
========

```bash
$ npm install quickndirtyapi
```

## Description

The Quick N Dirty API will connect to your mongo database and dynamically create basic endpoints based for all your collections. Basic endpoints include /*collection* and /*collection*/:id where *collection* is the name of a collection in your mongo database.

Usage
========
To connect with the Quick N Dirty API ...

1.Require Express:

```js
var express = require('express'); // require express package
var app = express(); // define express instance
```

2.Require Quick N Dirty API:

```js
var qnd = require('quickndirtyapi'); // require quickndirtyapi package
qnd(app, '127.0.0.1:27017/{dbName}'); // replace {dbName} with the name of your mongo database
```

3.Add a sample collection called `user` in your mongo database.

4.Start your server.js file.

5.Quick N Dirty will scan your mongo database and automatically create the **GET**, **POST**, **PUT** and **DELETE** endpoints for your `user` collection.

You will have access to the following endpoints:

POST /user<br />
GET /user<br />

GET /user/:id<br />
PUT /user/:id<br />
DELETE /user/:id

There is no validation on input fields as each project has its own requirements. This package is a "Quick N Dirty" way to get your project's API up and running as quick as possible to reduce bottlenecks when starting a project. As you build out your own endpoints, with validation and other requirements, add them to the bottom of your server.js file to overwrite the endpoints created by the Quick N Dirty API package.

## Dependencies

- [mongodb](https://github.com/mongodb/node-mongodb-native): A node.js driver for MongoDB
- [mongoskin](https://github.com/kissjs/node-mongoskin): The promise wrapper for node-mongodb-native

## License

(The ISC License)

Copyright (c) 2015, James Corr <james@onlygrowth.com>

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.
