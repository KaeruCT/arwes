import React, {
  type ForwardedRef,
  type CSSProperties,
  type ReactElement,
  useRef,
  useEffect
} from 'react'
import { cx } from '@arwes/tools'
import { memo, mergeRefs } from '@arwes/react-tools'
import { useAnimator } from '@arwes/react-animator'
import { type CreateBackgroundMovingLinesSettings, createBackgroundMovingLines } from '@arwes/bgs'

import { positionedStyle } from '../internal/styles.js'

interface MovingLinesProps extends CreateBackgroundMovingLinesSettings {
  elementRef?: ForwardedRef<HTMLCanvasElement>
  id?: string
  className?: string
  style?: CSSProperties
  positioned?: boolean
}

const MovingLines = memo((props: MovingLinesProps): ReactElement => {
  const { elementRef: elementRefExternal, id, className, style, positioned = true } = props

  const animator = useAnimator()
  const elementRef = useRef<HTMLCanvasElement>(null)
  const settingsRef = useRef(props)

  settingsRef.current = props

  useEffect(() => {
    const canvas = elementRef.current

    if (!canvas) {
      return
    }

    const background = createBackgroundMovingLines({
      canvas,
      animator: animator?.node,
      settingsRef
    })

    background.start()

    return () => background.stop()
  }, [animator])

  return (
    <canvas
      role="presentation"
      ref={mergeRefs(elementRef, elementRefExternal)}
      id={id}
      className={cx('arwes-bgs-movinglines', className)}
      style={{ ...(positioned ? positionedStyle : null), ...style }}
    />
  )
})

export { MovingLines }
