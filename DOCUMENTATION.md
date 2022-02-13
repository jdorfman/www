# How we do

### Development

* `$ cd ~/github/jdorfman/www`
* `$ gr -b branchname`
* `$ code .` (Pane 2)
  * `$ bundle exec jekyll serve --livereload`
  * bump version in `_config.yml`
  * `$ git commit -am "foo"`
  * `$ gr master`
  * `$ git rebase branchname`
  * `$ git push origin master`

### Clean up

* `$ dabm` (remove all branches)

### Troubleshoot

* `$ npm install`
