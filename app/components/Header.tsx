'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Bell, User, HelpCircle, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface HeaderProps {
  onAddPatient: () => void
}

export default function Header({ onAddPatient }: HeaderProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogoClick = () => {
    router.push('/')
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <button 
                className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200" 
                onClick={handleLogoClick}
              >
                HealthTrack
              </button>
              <div className="ml-2 text-sm text-gray-500">CareAssist</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="/dashboard" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Dashboard
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
              Reports
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
              To-Do List
            </a>
            <a href="#" className="text-orange-500 hover:text-orange-600 px-3 py-2 text-sm font-medium border-b-2 border-orange-500">
              Tasks
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
              eMAR
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
              Manage My Residents
            </a>

          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onAddPatient}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Add Patient</span>
            </button>
            
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Bell size={20} />
            </button>
            
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <HelpCircle size={20} />
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-sm text-gray-700 hover:text-blue-600 font-medium p-2 rounded-md hover:bg-gray-50"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={16} className="text-blue-600" />
                  </div>
                  <span>{user.firstName}</span>
                  <ChevronDown size={16} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-400">{user.role} • {user.hospital}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <LogOut size={16} />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a 
                href="/login"
                className="text-sm text-gray-700 hover:text-blue-600 font-medium"
              >
                Login
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 