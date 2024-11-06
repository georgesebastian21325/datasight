'use client'

import { motion } from 'framer-motion'
import Image from "next/image"
import { useEffect, useState } from 'react'

import CompanyLogo from '../assets/company-logo.jpg'

import { useLoadingMessage } from '@/app/context/LoadingMessageContext'

export default function LoadingScreen() {
  const [activeConnection, setActiveConnection] = useState(0)
  const [activePath, setActivePath] = useState(0)
  const { message } = useLoadingMessage();

  // Define node positions for our grid
  const topRow = [
    { x: 50, y: 50 }, { x: 150, y: 50 }, { x: 250, y: 50 }, { x: 350, y: 50 }
  ]
  const middleRow = [
    { x: 50, y: 150 }, { x: 150, y: 150 }, { x: 250, y: 150 }, { x: 350, y: 150 }
  ]
  const bottomRow = [
    { x: 50, y: 250 }, { x: 150, y: 250 }, { x: 250, y: 250 }, { x: 350, y: 250 }
  ]

  // Calculate total number of connections
  const totalConnections = (topRow.length * middleRow.length) + (middleRow.length * bottomRow.length)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveConnection((prev) => (prev + 1) % totalConnections)
      setActivePath((prev) => (prev + 1) % 2) // Toggle between top-middle and middle-bottom
    }, 200) // Adjust speed here

    return () => clearInterval(interval)
  }, [totalConnections])

  const isConnectionActive = (index: number, pathType: 'top' | 'bottom') => {
    const topConnections = topRow.length * middleRow.length
    if (pathType === 'top') {
      return activeConnection < topConnections && index === activeConnection
    } else {
      return activeConnection >= topConnections && 
             index === (activeConnection - topConnections)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-3xl mx-auto px-4">

        <svg width="400" height="300" viewBox="0 0 400 300" className="mx-auto">
          <defs>
            <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#08296C', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#F47820', stopOpacity: 1 }} />
            </linearGradient>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#F47820"
                opacity="0.8"
              />
            </marker>
          </defs>

          {/* Top to Middle Connections */}
          {topRow.map((start, i) =>
            middleRow.map((end, j) => {
              const connectionIndex = i * middleRow.length + j
              return (
                <motion.path
                  key={`top-mid-${i}-${j}`}
                  d={`M ${start.x} ${start.y} Q ${(start.x + end.x) / 2} ${(start.y + end.y) / 2 - 20} ${end.x} ${end.y}`}
                  stroke="url(#nodeGradient)"
                  strokeWidth={isConnectionActive(connectionIndex, 'top') ? "2" : "1"}
                  fill="none"
                  markerEnd="url(#arrowhead)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: isConnectionActive(connectionIndex, 'top') ? 0.8 : 0.2,
                    strokeWidth: isConnectionActive(connectionIndex, 'top') ? 2 : 1
                  }}
                  transition={{ duration: 1.5, delay: i * 0.1 }}
                />
              )
            })
          )}

          {/* Middle to Bottom Connections */}
          {middleRow.map((start, i) =>
            bottomRow.map((end, j) => {
              const connectionIndex = i * bottomRow.length + j
              return (
                <motion.path
                  key={`mid-bottom-${i}-${j}`}
                  d={`M ${start.x} ${start.y} Q ${(start.x + end.x) / 2} ${(start.y + end.y) / 2 + 20} ${end.x} ${end.y}`}
                  stroke="url(#nodeGradient)"
                  strokeWidth={isConnectionActive(connectionIndex, 'bottom') ? "2" : "1"}
                  fill="none"
                  markerEnd="url(#arrowhead)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: isConnectionActive(connectionIndex, 'bottom') ? 0.8 : 0.2,
                    strokeWidth: isConnectionActive(connectionIndex, 'bottom') ? 2 : 1
                  }}
                  transition={{ duration: 1.5, delay: 0.5 + i * 0.1 }}
                />
              )
            })
          )}

          {/* Nodes */}
          {[...topRow, ...middleRow, ...bottomRow].map((node, i) => (
            <motion.g key={i}>
              <motion.rect
                x={node.x - 30}
                y={node.y - 15}
                width="60"
                height="30"
                rx="4"
                fill="url(#nodeGradient)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              />
              <motion.circle
                cx={node.x - 20}
                cy={node.y}
                r="4"
                fill="#fff"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 + 0.2 }}
              />
            </motion.g>
          ))}
        </svg>

        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 2 }}
        >
          <h2 className="text-2xl font-bold text-[#08296C] mb-2">{message}</h2>
          <p className="text-[#F47820]">Establishing network connections...</p>
        </motion.div>

        <motion.div
          className="mt-6 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <div className="w-8 h-8 border-4 border-[#F47820] border-t-transparent rounded-full animate-spin" />
        </motion.div>
      </div>
    </div>
  )
}