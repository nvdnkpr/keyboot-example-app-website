# getting started

first, install the necessary dependencies:

```
$ npm install
```

now build a [hyperboot](http://hyperboot.org) release:

```
$ npm run release -- -v 1.0.0 -m 'basic example of signing'
```

and run the hyperboot server:

```
$ npm start -- -p 8000
```

Now at `http://localhost:8000` you can log in with the URL of a keyboot app and
sign messages after logging in.

# building for development

To iterate without building a full release every time, just do:

```
$ npm run dev -- -p 8000
```

This starts up watchify to rebundle browser source and hosts a static file
server on `8000`.
