import { createAnimatorSystem } from '@arwes/animator'
import { createBackgroundPuffs } from '@arwes/bgs'

const root = document.querySelector('#root')!
const canvas = document.createElement('canvas')
Object.assign(canvas.style, { position: 'absolute', inset: 0, width: '100%', height: '100%' })
root.appendChild(canvas)

let active = false
const system = createAnimatorSystem()
const animator = system.register(undefined, {
  getSettings: () => ({ active, duration: { enter: 1, exit: 1 } }),
  setSettings: () => {},
  getForeignRef: () => {},
  setForeignRef: () => {}
})

const bg = createBackgroundPuffs({
  canvas,
  animator,
  settingsRef: {
    current: {
      color: 'hsla(180, 100%, 75%, 0.25)',
      quantity: 100
    }
  }
})

const update = (): void => {
  active = !active
  animator.send('update')
  setTimeout(update, active ? 3_000 : 1_500)
}

bg.start()
animator.send('setup')
update()
