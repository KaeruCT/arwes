// React integration of `createFrameSVGOctagon`.

import React, { type ReactElement } from 'react'
import { createRoot } from 'react-dom/client'
import { FrameSVGOctagon } from '@arwes/react-frames'

const Sandbox = (): ReactElement => {
  return (
    <div style={{ position: 'relative', width: 300, height: 300 }}>
      <FrameSVGOctagon
        style={{
          // @ts-expect-error css variables
          '--arwes-frames-bg-color': 'hsl(180, 75%, 10%)',
          '--arwes-frames-line-color': 'hsl(180, 75%, 50%)'
        }}
      />
    </div>
  )
}

createRoot(document.querySelector('#root')!).render(<Sandbox />)
