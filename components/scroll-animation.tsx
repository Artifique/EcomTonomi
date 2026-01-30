"use client"

import { motion, useInView, useReducedMotion } from "framer-motion"
import { useRef, ReactNode, useEffect, useState } from "react"

interface ScrollAnimationProps {
  children: ReactNode
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "fade"
  className?: string
}

export function ScrollAnimation({
  children,
  delay = 0,
  direction = "up",
  className,
}: ScrollAnimationProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const prefersReducedMotion = useReducedMotion()

  const variants = {
    up: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
    },
    down: {
      initial: { opacity: 0, y: -50 },
      animate: { opacity: 1, y: 0 },
    },
    left: {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 },
    },
    right: {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
    },
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
  }

  const variant = variants[direction]

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      initial={variant.initial}
      animate={isInView ? variant.animate : variant.initial}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggeredListProps {
  children: ReactNode[]
  delay?: number
  className?: string
}

export function StaggeredList({ children, delay = 0.1, className }: StaggeredListProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className={className}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            duration: 0.4,
            delay: index * delay,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}

interface ParallaxProps {
  children: ReactNode
  speed?: number
  className?: string
}

export function Parallax({ children, speed = -10, className }: ParallaxProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      style={{
        y: useParallax(speed),
      }}
    >
      {children}
    </motion.div>
  )
}

function useParallax(speed: number) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * (speed / 100))
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed])

  return offset
}

