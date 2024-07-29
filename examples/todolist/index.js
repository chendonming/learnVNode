import { h } from '../../build/index.js'

const g = h('div.page',
  {
    style: { opacity: 1, color: 'red' }
  },
  [
    h('div.header',
      {
        style: {
          color: 'white',
          width: '100px'
        }
      },
      'hello world'
    )
  ]
)

console.log('res: ============>', g)