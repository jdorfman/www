# How we do

### Development

* `$ cd ~/github/jdorfman/www`
* Open iTerm, split Pane
* `$ gr -b branchname`
* `$ grunt watch` (Pane 1)
  * `$ grunt imageoptim`
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
