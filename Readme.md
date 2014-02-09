# path-observer

[![Build Status](https://travis-ci.org/ripplejs/path-observer.png?branch=master)](https://travis-ci.org/ripplejs/path-observer)

  Watch a path of an object for changes. If the path value is an
  array it will wrap it and listen for changes when the array
  is mutated via `push`, `shift`, `sort` etc.

## Installation

  Install with [component(1)](http://component.io):

    $ component install ripplejs/path-observer

## API

```js
var observe = require('path-observer');

var data = {
  foo: 'bar',
  bar: [1,2,3],
  baz: {
    foo: {
      foo: 'bar'
    }
  }
};

// Wraps an object and returns a constructor
// for watching paths
var PathObserver = observe(data);
```

Now you can use this constructor to watch paths on the object for changes:

```js
var path = new PathObserver('baz.foo.foo');

path.change(function(){
  console.log('changed');
});

path.set('baz');
```

For now, this doesn't define getters so you'll need to use the .set method.

## License

  The MIT License (MIT)

  Copyright (c) 2014 <copyright holders>

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.