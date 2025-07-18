import React from 'react'
import { Plus, Bell, User, HelpCircle } from 'lucide-react'

interface HeaderProps {
  onAddPatient: () => void
}

export default function Header({ onAddPatient }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="text-2xl font-bold text-blue-600">MatrixCaare</div>
              <div className="ml-2 text-sm text-gray-500">CareAssist</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">
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
            
            <a 
              href="/login" 
              className="text-sm text-gray-700 hover:text-blue-600 font-medium"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </header>
  )
} 