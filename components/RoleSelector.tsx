"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, GraduationCap, Building2, Heart, Play, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RoleSelectorProps {
  onRoleSelect: (role: 'participant' | 'community' | 'admin' | 'donor') => void
}

const roles = [
  {
    id: 'participant',
    name: 'Participant',
    icon: GraduationCap,
    description: 'I want to learn and grow',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'community',
    name: 'Community Member',
    icon: Users,
    description: 'I want to participate and connect',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'admin',
    name: 'Administrator',
    icon: Building2,
    description: 'I want to manage and govern',
    color: 'from-purple-500 to-violet-500'
  },
  {
    id: 'donor',
    name: 'Donor',
    icon: Heart,
    description: 'I want to fund and support',
    color: 'from-red-500 to-pink-500'
  }
]

export function RoleSelector({ onRoleSelect }: RoleSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const handleRoleSelect = (role: 'participant' | 'community' | 'admin' | 'donor') => {
    setSelectedRole(role)
    setIsExpanded(false)
    onRoleSelect(role)
  }

  const handleClose = () => {
    setIsExpanded(false)
    setSelectedRole(null)
  }

  return (
    <>
      {/* Floating Role Selector Button */}
      <motion.div
        className="fixed bottom-6 left-6 z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
      >
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative h-12 px-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 backdrop-blur-xl border border-orange-400/50 hover:from-orange-600 hover:to-red-600 shadow-2xl transition-all duration-200 hover:scale-105"
        >
          <Users className="h-5 w-5 text-white mr-2" />
          <span className="text-white font-medium">Choose Your Path</span>
        </Button>
      </motion.div>

      {/* Role Selection Panel */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={handleClose}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: -300, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -300, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-6 bottom-24 w-80 max-w-[90vw] bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-orange-400" />
                  <div>
                    <h2 className="text-xl font-semibold text-white">Choose Your Role</h2>
                    <p className="text-sm text-gray-400">Discover your personalized journey</p>
                  </div>
                </div>
                <Button
                  onClick={handleClose}
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white hover:bg-gray-800/50"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Role Options */}
              <div className="p-4 space-y-3">
                {roles.map((role) => {
                  const IconComponent = role.icon
                  return (
                    <motion.button
                      key={role.id}
                      onClick={() => handleRoleSelect(role.id as any)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full p-4 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200 group ${
                        selectedRole === role.id ? 'ring-2 ring-orange-500' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${role.color} group-hover:scale-110 transition-transform duration-200`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="text-white font-semibold group-hover:text-orange-400 transition-colors">
                            {role.name}
                          </h3>
                          <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                            {role.description}
                          </p>
                        </div>
                        <Play className="h-5 w-5 text-gray-500 group-hover:text-orange-400 transition-colors" />
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-700/50 bg-gray-800/30">
                <p className="text-xs text-gray-500 text-center">
                  Each role has a unique journey through the BEAM network
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
