# How we do

### Development
* `$ ~/github/jdorfman/docs/2018`
* Open Hyper, split Pane
* `$ gr -b branchname`
* `$ grunt watch` (Pane 1)
  * `$ grunt imageoptim`
* `$ atom .` (Pane 2)
  * `$ shttp`
  * `$ git commit -am "foo"`
  * `$ gr master`
  * `$ git merge branchname`
  * `$ git push origin master`
* `node  ~/github/jdorfman/jdc/bin/purge.js` (or: [GitHub hook](http://j.mp/2FjSAAU) or grunt task)

### Clean up
* `$ dab` (remove all branches)

### Troubleshoot
* `$ npm install`
