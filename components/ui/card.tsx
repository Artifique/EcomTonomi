"use client"

import * as React from 'react'
import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

interface CardProps extends React.ComponentProps<'div'> {
  hover?: 'lift' | 'scale' | 'glow' | 'none'
}

function Card({ className, hover = 'lift', ...props }: CardProps) {
  const hoverVariants = {
    lift: {
      whileHover: { y: -4, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)' },
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
    },
    scale: {
      whileHover: { scale: 1.02, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' },
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
    },
    glow: {
      whileHover: { 
        boxShadow: '0 0 20px rgba(220, 178, 101, 0.3)',
        borderColor: 'rgba(220, 178, 101, 0.5)',
      },
      transition: { duration: 0.2 },
    },
    none: {},
  }

  const MotionCard = motion.div

  return (
    <MotionCard
      data-slot="card"
      className={cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm transition-shadow',
        hover !== 'none' && 'cursor-pointer',
        className,
      )}
      {...(hover !== 'none' ? hoverVariants[hover] : {})}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-6', className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
