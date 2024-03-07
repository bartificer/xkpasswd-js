# Development notes

If you want to participate in the development of this webapp here are some instructions to help you set up.

* clone the repository on [Github](https://github.com/bartificer/xkpasswd-js)
* set up your environment
```shell
npm ci # install the modules
npm run build # run the build for the first time. It should finish successfully.
npm test # run the tests for the first time. They should all pass.
npm run cov # run the tests again but this time with test coverage. Coverage should be above 80%
```
* during development you can use the `watch` scripts to have an automatic webpack build and an automatic webserver reload

## Hot build and reload

The easiest way to achieve this is opening a Terminal window in the root directory of this project.

In the Terminal enter `npm run start` to start a local webserver.
This script will watch for any change in any file, and automatically start a
a webpack build and restarts the server when there is a new build.

In your webbrowser enter `http://localhost:8080` to find the webapp.

## JS Docs

If you want to see the docs locally, run `npm run docs`.
You will find them in /dist/docs and also through the webapp in the Actions menu.
