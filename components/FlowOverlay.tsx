"use client"

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FlowStep {
  highlight: string[]
  action: string
  videoTime: number
  description: string
  connections?: Array<{
    from: string
    to: string
    label?: string
  }>
}

interface FlowOverlayProps {
  isVisible: boolean
  role: 'participant' | 'community' | 'admin' | 'donor'
  currentTime: number
  onCardClick: (ngoId: string) => void
}

const flows: Record<string, FlowStep[]> = {
  participant: [
    {
      highlight: ['beam-education'],
      action: 'learn',
      videoTime: 0,
      description: 'Start your learning journey with BEAM Education'
    },
    {
      highlight: ['beam-skills'],
      action: 'practice',
      videoTime: 15,
      description: 'Develop practical skills through our exchange program',
      connections: [{ from: 'beam-education', to: 'beam-skills', label: 'Skill Development' }]
    },
    {
      highlight: ['beam-library'],
      action: 'research',
      videoTime: 30,
      description: 'Access 24/7 resources at our knowledge hub',
      connections: [{ from: 'beam-skills', to: 'beam-library', label: 'Knowledge Access' }]
    }
  ],
  donor: [
    {
      highlight: ['beam-fcu'],
      action: 'fund',
      videoTime: 0,
      description: 'Financial services and investment opportunities'
    },
    {
      highlight: ['beam-health'],
      action: 'impact',
      videoTime: 20,
      description: 'Support healthcare initiatives in communities',
      connections: [{ from: 'beam-fcu', to: 'beam-health', label: 'Health Funding' }]
    },
    {
      highlight: ['beam-band', 'beam-orchestra'],
      action: 'sponsor',
      videoTime: 40,
      description: 'Sponsor cultural and arts programs',
      connections: [
        { from: 'beam-health', to: 'beam-band', label: 'Cultural Support' },
        { from: 'beam-health', to: 'beam-orchestra', label: 'Arts Funding' }
      ]
    }
  ],
  admin: [
    {
      highlight: ['beam-legal'],
      action: 'govern',
      videoTime: 0,
      description: 'Legal and governance framework'
    },
    {
      highlight: ['beam-education', 'beam-skills'],
      action: 'manage',
      videoTime: 25,
      description: 'Manage educational programs and partnerships',
      connections: [{ from: 'beam-legal', to: 'beam-education', label: 'Policy Framework' }]
    }
  ],
  community: [
    {
      highlight: ['beam-band', 'beam-orchestra'],
      action: 'participate',
      videoTime: 0,
      description: 'Join cultural and community programs'
    },
    {
      highlight: ['beam-library'],
      action: 'access',
      videoTime: 20,
      description: 'Access community resources and learning',
      connections: [{ from: 'beam-band', to: 'beam-library', label: 'Community Learning' }]
    },
    {
      highlight: ['beam-health'],
      action: 'benefit',
      videoTime: 40,
      description: 'Benefit from healthcare and wellness programs',
      connections: [{ from: 'beam-library', to: 'beam-health', label: 'Wellness Access' }]
    }
  ]
}

export function FlowOverlay({ isVisible, role, currentTime, onCardClick }: FlowOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [highlightedCards, setHighlightedCards] = useState<string[]>([])
  const [connections, setConnections] = useState<Array<{ from: string; to: string; label?: string }>>([])
  const svgRef = useRef<SVGSVGElement>(null)

  // Update current step based on video time
  useEffect(() => {
    const roleFlows = flows[role] || []
    const step = roleFlows.findIndex(flow => currentTime >= flow.videoTime)
    if (step !== -1 && step !== currentStep) {
      setCurrentStep(step)
      const flowStep = roleFlows[step]
      setHighlightedCards(flowStep.highlight)
      setConnections(flowStep.connections || [])
    }
  }, [currentTime, role, currentStep])

  if (!isVisible) return null

  const roleFlows = flows[role] || []
  const currentFlowStep = roleFlows[currentStep]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none z-40"
        >
          {/* SVG for drawing connections */}
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: 'none' }}
          >
            {connections.map((connection, index) => (
              <g key={index}>
                {/* Connection line */}
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="0"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  className="animate-pulse"
                />
                {/* Connection label */}
                <text
                  x="0"
                  y="0"
                  fill="#f59e0b"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="drop-shadow-lg"
                >
                  {connection.label}
                </text>
              </g>
            ))}
          </svg>

          {/* Step indicator */}
          <div className="absolute top-4 right-4 bg-black/80 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
            <div className="text-sm font-medium">{role.charAt(0).toUpperCase() + role.slice(1)} Journey</div>
            <div className="text-xs text-gray-300">
              Step {currentStep + 1} of {roleFlows.length}
            </div>
          </div>

          {/* Current step description */}
          {currentFlowStep && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 right-4 bg-black/80 text-white p-4 rounded-lg backdrop-blur-sm"
            >
              <div className="text-sm font-medium">{currentFlowStep.action}</div>
              <div className="text-xs text-gray-300">{currentFlowStep.description}</div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
