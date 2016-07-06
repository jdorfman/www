function msg () {
  var theDate = new Date()
  var today = theDate.getDay()

  switch (today) {
    case 1: document.write("Looks like somebody's got a case of the Mondays")
      break
    case 2: document.write('Only 3 more days till Friday...')
      break
    case 3: document.write('Hump Day!')
      break
    case 4: document.write('Throw it back!')
      break
    case 5: document.write("It's Friday, Friday, Gotta get down on Friday.")
      break
    case 6: document.write('Remember Saturday morning cartoons? #GoodOlDays')
      break
    case 0: document.write('Look at the bright side, you get to go to work tomorrow.')
      break
  }
}
