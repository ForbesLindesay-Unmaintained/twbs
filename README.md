# twbs

[![Greenkeeper badge](https://badges.greenkeeper.io/ForbesLindesay/twbs.svg)](https://greenkeeper.io/)

Twitter bootstrap with support for module systems

[![Build Status](https://img.shields.io/travis/ForbesLindesay/twbs/master.svg)](https://travis-ci.org/ForbesLindesay/twbs)
[![Dependency Status](https://img.shields.io/david/ForbesLindesay/twbs.svg)](https://david-dm.org/ForbesLindesay/twbs)
[![NPM version](https://img.shields.io/npm/v/twbs.svg)](https://www.npmjs.com/package/twbs)

## Installation

    npm install twbs

## Usage

To use the less/css, use [less-fixed](https://github.com/ForbesLindesay/less-fixed) to compile code along the lines of:

```less
@import (npm) "twbs";

//rest of your less here
```

To import specific files you can also do something like:

```less
@import (npm) "twbs/less/code.less";
```

To load the JavaScript just do:

```js
var $ = require('twbs');
```

## Contributing

To download the latest code and build just update `bootstrap-version` in package.json then run:

```
npm install
node build
```

Then to release a new version, run:

```
npm install component-release -g
component-release x.y.z
```

where x.y.z is replaced with the appropriate version number.

## License

  MIT