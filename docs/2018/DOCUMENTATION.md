# How we do

### Development
* `$ ~/github/jdorfman/jdc/public/2016`
* Open iTerm, split Pane
* `$ gr -b branchname`
* `$ grunt watch` (Pane 1)
  * `$ grunt imageoptim`
* `$ atom .` (Pane 2)
  * `$ shttp`
  * `$ git commit -am "foo"`
  * `$ gr master`
  * `$ git merge branchname`
  * `$ git push origin master`
* `$ sdo` (Pane 3)
  * `$ ./deploy`

### Clean up
* `$ dab` (remove all branches)
