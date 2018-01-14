# Payitoff

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

_Note that .angular-cli.json contains the following lines that are helpful for me. You may want to remove the ```serve``` property._
```
  "defaults": {
    "serve": {
      "host": "10.211.55.50"
    },

    "styleExt": "css",
    "component": {}
  }
```

## Production build

Run `npm run build` to build an optimized production build.

## Docker image

There is a Dockerfile available so you can quickly build an image. Simply do the following.

```
npm run docker-build
npm run docker-run
```

You will be able to access the app on port 8080 through whichever network interface you choose.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` or `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

_Note that there are not unit tests at this time._

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
