import React, { type ReactElement, useRef, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Animator } from '@arwes/react-animator'
import { FrameSVGNefrex, useFrameSVGAssemblingAnimation } from '@arwes/react-frames'

const Frame = (): ReactElement => {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const { onRender } = useFrameSVGAssemblingAnimation(svgRef)

  return (
    <>
      <style>{`
        .frame {
          position: relative;
          width: 300px;
          height: 500px;
        }
        .frame [data-name=bg] {
          color: hsl(60, 75%, 10%);
          filter: drop-shadow(0 0 4px hsl(60, 75%, 10%));
        }
        .frame [data-name=line] {
          color: hsl(60, 75%, 50%);
          filter: drop-shadow(0 0 4px hsl(60, 75%, 50%));
        }
      `}</style>

      <FrameSVGNefrex
        elementRef={svgRef}
        className="frame"
        padding={4}
        strokeWidth={2}
        squareSize={32}
        smallLineLength={32}
        largeLineLength={128}
        onRender={onRender}
      />
    </>
  )
}

const Sandbox = (): ReactElement => {
  const [active, setActive] = useState(true)

  useEffect(() => {
    const tid = setInterval(() => setActive((active) => !active), 2_000)
    return () => clearInterval(tid)
  }, [])

  return (
    <Animator active={active}>
      <Frame />
    </Animator>
  )
}

createRoot(document.querySelector('#root')!).render(<Sandbox />)
