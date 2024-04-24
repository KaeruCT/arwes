import React, { type ReactElement, useRef, useEffect } from 'react'
import { animate } from 'motion'
import { cx } from '@arwes/tools'
import { mergeRefs } from '@arwes/react-tools'
import { ANIMATOR_STATES, type AnimatorNode } from '@arwes/animator'
import { useAnimator } from '@arwes/react-animator'

import { type DotsProps } from './Dots.types.js'
import { getDistanceFromOriginToCornerProgress } from './getDistanceFromOriginToCornerProgress.js'

const { entering, exiting } = ANIMATOR_STATES

const defaultProps: Required<
  Pick<DotsProps, 'color' | 'type' | 'distance' | 'size' | 'crossSize' | 'origin'>
> = {
  color: '#777',
  type: 'box',
  distance: 30,
  size: 4,
  crossSize: 1,
  origin: 'center'
}

const Dots = (props: DotsProps): ReactElement => {
  const propsFull = { ...defaultProps, ...props }
  const { elementRef: elementRefExternal, className, style } = propsFull

  const animator = useAnimator()
  const elementRef = useRef<HTMLCanvasElement>(null)
  const propsFullRef = useRef(propsFull)

  propsFullRef.current = propsFull

  useEffect(() => {
    const canvas = elementRef.current

    if (!animator || !canvas) {
      return
    }

    let animationControl: ReturnType<typeof animate> | undefined
    let resizeObserver: ResizeObserver | undefined

    const ctx = canvas.getContext('2d')!
    const dpr = window.devicePixelRatio || 2

    const setupCanvasSize = (): void => {
      const { width, height } = canvas.getBoundingClientRect()

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr
        canvas.height = height * dpr
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0) // Reset scale to identical.
      ctx.scale(dpr, dpr)
    }

    setupCanvasSize()

    const cancelAnimationSubscriptions = (): void => {
      animationControl?.cancel()
      resizeObserver?.disconnect()
    }

    const animatorSubscription = (node: AnimatorNode): void => {
      if (node.state !== entering && node.state !== exiting) {
        return
      }

      cancelAnimationSubscriptions()

      const active = node.state === entering
      const { duration } = node.control.getSettings()
      const transitionDuration = (active ? duration?.enter : duration?.exit) || 0

      const draw = (progress: number): void => {
        const { color, type, distance, size, crossSize, origin, originInverted } =
          propsFullRef.current

        const { width, height } = canvas

        const xLength = 1 + Math.floor(width / distance)
        const yLength = 1 + Math.floor(height / distance)

        const xMargin = width % distance
        const yMargin = height % distance

        ctx.clearRect(0, 0, width, height)

        for (let xIndex = 0; xIndex < xLength; xIndex++) {
          const x = xMargin / 2 + xIndex * distance

          for (let yIndex = 0; yIndex < yLength; yIndex++) {
            const y = yMargin / 2 + yIndex * distance

            const distanceFromOriginProgress = getDistanceFromOriginToCornerProgress(
              width / dpr,
              height / dpr,
              x,
              y,
              origin
            )

            const distancePercentage =
              (active && originInverted) || (!active && !originInverted)
                ? 1 - distanceFromOriginProgress
                : distanceFromOriginProgress

            const alphaProgress = progress / distancePercentage
            const alpha = Math.max(0, Math.min(1, alphaProgress))

            ctx.beginPath()
            ctx.globalAlpha = active ? alpha : 1 - alpha

            if (type === 'circle') {
              ctx.arc(x, y, size, 0, 2 * Math.PI)
            }
            //
            else if (type === 'cross') {
              const l = size / 2
              const b = crossSize / 2

              // left
              ctx.moveTo(x - l, y + b)
              ctx.lineTo(x - l, y - b)
              ctx.lineTo(x - b, y - b)

              // top
              ctx.lineTo(x - b, y - l)
              ctx.lineTo(x + b, y - l)
              ctx.lineTo(x + b, y - b)

              // right
              ctx.lineTo(x + l, y - b)
              ctx.lineTo(x + l, y + b)
              ctx.lineTo(x + b, y + b)

              // bottom
              ctx.lineTo(x + b, y + l)
              ctx.lineTo(x - b, y + l)
              ctx.lineTo(x - b, y + b)
            }
            //
            else {
              ctx.rect(x - size / 2, y - size / 2, size, size)
            }

            ctx.fillStyle = color
            ctx.fill()
            ctx.closePath()
          }
        }
      }

      animationControl = animate(draw, {
        duration: transitionDuration,
        easing: 'ease-in-out'
      })

      if (window.ResizeObserver) {
        resizeObserver = new window.ResizeObserver(() => {
          setupCanvasSize()

          const currentTime = animationControl?.currentTime || 0
          if (active && currentTime >= transitionDuration) {
            draw(1)
          }
        })

        resizeObserver.observe(canvas)
      }
    }

    animator.node.subscribers.add(animatorSubscription)

    return () => {
      animator.node.subscribers.delete(animatorSubscription)
      cancelAnimationSubscriptions()
    }
  }, [animator])

  return (
    <canvas
      role="presentation"
      ref={mergeRefs(elementRef, elementRefExternal)}
      className={cx('arwes-react-bgs-dots', className)}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        display: 'block',
        border: 0,
        margin: 0,
        padding: 0,
        width: '100%',
        height: '100%',
        ...style
      }}
    />
  )
}

export { Dots }
