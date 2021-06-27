import b from './b.js'

const a = {
  value: 'a',
  getA: () => b.value + 'from a.js'
}

export default a