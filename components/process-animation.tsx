"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Building, RotateCcw, User, Coins } from "lucide-react"

// Define the sequence of icons and text for the animation
const processSteps = [
  {
    id: "user-submit",
    text: "User Submits Project",
    icon: User,
    color: "text-blue-400",
  },
  {
    id: "map-pods",
    text: "BEAM Maps to PODs/Nodes",
    icon: ArrowRight,
    color: "text-green-400",
  },
  {
    id: "pods-money",
    text: "PODs/Nodes Produce Value",
    icon: Building,
    color: "text-purple-400",
  },
  {
    id: "money-user",
    text: "Value Returns to User",
    icon: Coins,
    color: "text-yellow-400",
  },
  {
    id: "repeat",
    text: "Cycle Repeats",
    icon: RotateCcw,
    color: "text-cyan-400",
  },
]

export default function ProcessAnimation() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setTransitioning(true) // Start fade-out/slide-out animation
      setTimeout(() => {
        // After fade-out, change content and fade-in
        setCurrentIndex((prevIndex) => (prevIndex + 1) % processSteps.length)
        setTransitioning(false) // Start fade-in/slide-in animation
      }, 500) // Duration of fade-out animation
    }, 3000) // Time each slide is visible before starting to transition (3 seconds)

    return () => clearInterval(cycleInterval)
  }, [])

  const currentStep = processSteps[currentIndex]
  const IconComponent = currentStep.icon

  return (
    <div className="flex items-center gap-3 overflow-hidden h-full min-w-0">
      <div
        key={currentStep.id} // Key changes to trigger re-render and animation
        className={`flex items-center gap-3 transition-all duration-500 ease-in-out whitespace-nowrap ${
          transitioning ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <IconComponent className={`h-6 w-6 ${currentStep.color} flex-shrink-0`} />
        <span className="text-white text-xl font-bold tracking-tight">{currentStep.text}</span>
      </div>
    </div>
  )
}
