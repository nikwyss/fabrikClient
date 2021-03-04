export const linebreaker = (label, maxlen = 20) => {
  // const maxlen = 20
  if (label.length <= maxlen) {
    return (label)
  }

  const words = label.split(" ")
  const startlines = []
  const endlines = []
  var start = ''
  var end = ''
  while (words.length > 0) {

    // add first word to 'start' string
    let first = words.shift()
    start += ' ' + first

    // add last word to end string
    if (words.length > 0) {
      let last = words.pop()
      end = last + ' ' + end
    }

    // if start or end string are overlength, put them into startlines resp. endlines lists
    if (start.length > maxlen) {
      startlines.push(start)
      start = ''
    }
    if (end.length > maxlen) {
      endlines.unshift(end)
      end = ''
    }
    // end loop
  }

  // assign the rest either to the startlines list (or both)
  if ((start + end).length > maxlen) {
    startlines.push(start)
    endlines.unshift(end)
  } else {
    startlines.push(start + " " + end)
  }

  return (startlines.concat(endlines))
}