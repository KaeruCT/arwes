import { createFrameSVGUnderline, renderFrameSVG } from '@arwes/frames'

const root = document.querySelector('#root')!
const frame = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
frame.style.setProperty('width', '300px')
frame.style.setProperty('height', '200px')
frame.style.setProperty('--arwes-frames-bg-color', 'hsl(180, 75%, 10%)')
frame.style.setProperty('--arwes-frames-line-color', 'hsl(180, 75%, 50%)')
root.appendChild(frame)

const settings = createFrameSVGUnderline({
  // styled: true,
  // squareSize: 16,
  // strokeWidth: 1,
  // padding: 0
})

renderFrameSVG(frame, settings)
