// the list of magic words according to
export const _magicWords = ['fixed', 'fixes']
// the regex to find a related issue
const regexSource = `(${_magicWords.join('|')}) #(\\d+)`
const globalRegex = new RegExp(regexSource, 'g')
const regex = new RegExp(regexSource)

export default body =>
    // return the number in each match (group 2)
    body.match(globalRegex).map(match => parseInt(regex.exec(match)[2]))
