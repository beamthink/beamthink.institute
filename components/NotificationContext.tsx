"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface NotificationContextType {
  isNotificationOpen: boolean
  openNotifications: () => void
  closeNotifications: () => void
  unreadCount: number
  setUnreadCount: (count: number) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const openNotifications = () => setIsNotificationOpen(true)
  const closeNotifications = () => setIsNotificationOpen(false)

  return (
    <NotificationContext.Provider
      value={{
        isNotificationOpen,
        openNotifications,
        closeNotifications,
        unreadCount,
        setUnreadCount
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
