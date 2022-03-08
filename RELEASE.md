# Release procedure

* Make sure CHANGELOG.md is up to date
* Build locally
* `npm version {major|minor|patch}`
* Publish the release draft on Github
* Check the result of the release testing
* `npm publish`
* Run the npm package test workflow on Github
