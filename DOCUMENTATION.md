# How we do

### Development
* `$ ~/github/jdorfman/www`
* Open Hyper, split Pane
* `$ gr -b branchname`
* `$ grunt watch` (Pane 1)
  * `$ grunt imageoptim`
* `$ atom .` (Pane 2)
  * `$ bundle exec jekyll s`
  * `$ git commit -am "foo"`
  * `$ gr master`
  * `$ git rebase branchname`
  * `$ git push origin master`

### Clean up
* `$ dabm` (remove all branches)

### Troubleshoot
* `$ npm install`
