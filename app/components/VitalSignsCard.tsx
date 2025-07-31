'use client'

import React, { useState, useEffect } from 'react'
import { Activity, Edit3, Save, X, Plus, Clock, User, TrendingUp } from 'lucide-react'
import { tokenStorage } from '../lib/auth'
import { useAuth } from '../contexts/AuthContext'
import ConfirmationModal from './ConfirmationModal'

interface VitalSignsEntry {
  id?: number
  bloodPressureSystolic?: number
  bloodPressureDiastolic?: number
  temperature?: number
  temperatureUnit?: string
  pulse?: number
  respiration?: number
  oxygenSaturation?: number
  painLevel?: number
  notes?: string
  recordedAt?: string
  recordedAtFormatted?: string
  userName?: string
  userId?: number
}

interface VitalSignsCardProps {
  patientId: number
  isLoaded: boolean
}

export default function VitalSignsCard({ patientId, isLoaded }: VitalSignsCardProps) {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [vitalHistory, setVitalHistory] = useState<VitalSignsEntry[]>([])
  const [latestVitals, setLatestVitals] = useState<VitalSignsEntry>({})
  const [loading, setLoading] = useState(false)
  const [editingData, setEditingData] = useState<VitalSignsEntry>({
    temperatureUnit: 'F'
  })
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmationDetails, setConfirmationDetails] = useState<string[]>([])

  const API_BASE_URL = 'http://localhost:8080/api'

  useEffect(() => {
    if (patientId) {
      fetchLatestVitals()
      fetchVitalHistory()
    }
  }, [patientId])

  const fetchLatestVitals = async () => {
    try {
      const token = tokenStorage.getToken()
      const headers: any = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(`${API_BASE_URL}/patients/${patientId}/vitals/latest`, { headers })
      if (response.ok) {
        const data = await response.json()
        setLatestVitals(data)
      }
    } catch (error) {
      console.error('Error fetching latest vitals:', error)
    }
  }

  const fetchVitalHistory = async () => {
    try {
      setLoading(true)
      const token = tokenStorage.getToken()
      const headers: any = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(`${API_BASE_URL}/patients/${patientId}/vitals?limit=20`, { headers })
      if (response.ok) {
        const data = await response.json()
        setVitalHistory(data)
      }
    } catch (error) {
      console.error('Error fetching vital history:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setEditingData({
      bloodPressureSystolic: latestVitals.bloodPressureSystolic || undefined,
      bloodPressureDiastolic: latestVitals.bloodPressureDiastolic || undefined,
      temperature: latestVitals.temperature || undefined,
      temperatureUnit: latestVitals.temperatureUnit || 'F',
      pulse: latestVitals.pulse || undefined,
      respiration: latestVitals.respiration || undefined,
      oxygenSaturation: latestVitals.oxygenSaturation || undefined,
      painLevel: latestVitals.painLevel || undefined,
      notes: latestVitals.notes || ''
    })
    setIsEditing(true)
  }

  const handleSave = async () => {
    // Create confirmation message with vital signs summary
    const vitalsSummary = []
    if (editingData.bloodPressureSystolic && editingData.bloodPressureDiastolic) {
      vitalsSummary.push(`Blood Pressure: ${editingData.bloodPressureSystolic}/${editingData.bloodPressureDiastolic} mmHg`)
    }
    if (editingData.temperature) {
      vitalsSummary.push(`Temperature: ${editingData.temperature}°${editingData.temperatureUnit || 'F'}`)
    }
    if (editingData.pulse) {
      vitalsSummary.push(`Pulse: ${editingData.pulse} bpm`)
    }
    if (editingData.respiration) {
      vitalsSummary.push(`Respiration: ${editingData.respiration} rpm`)
    }
    if (editingData.oxygenSaturation) {
      vitalsSummary.push(`Oxygen Saturation: ${editingData.oxygenSaturation}%`)
    }
    if (editingData.painLevel !== undefined) {
      vitalsSummary.push(`Pain Level: ${editingData.painLevel}/10`)
    }
    if (editingData.notes) {
      vitalsSummary.push(`Notes: ${editingData.notes}`)
    }

    // Show confirmation modal
    setConfirmationDetails(vitalsSummary)
    setShowConfirmModal(true)
  }

  const confirmSave = async () => {

    try {
      const token = tokenStorage.getToken()
      const headers: any = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const requestData = {
        ...editingData,
        userId: user?.id || 1,
        userName: user?.fullName || user?.firstName + ' ' + user?.lastName || 'Unknown User'
      }

      const response = await fetch(`${API_BASE_URL}/patients/${patientId}/vitals`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestData)
      })

      if (response.ok) {
        await fetchLatestVitals()
        await fetchVitalHistory()
        setIsEditing(false)
        setEditingData({ temperatureUnit: 'F' })
      } else {
        throw new Error('Failed to save vital signs')
      }
    } catch (error) {
      console.error('Error saving vital signs:', error)
      alert('Failed to save vital signs. Please try again.')
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingData({ temperatureUnit: 'F' })
  }

  const handleInputChange = (field: string, value: string | number) => {
    setEditingData(prev => ({
      ...prev,
      [field]: value === '' ? undefined : value
    }))
  }

  return (
    <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="card hover:shadow-lg transition-all duration-300 idle-state relative w-full">
        {/* Header with Edit Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-pink-600" />
            <h3 className="font-semibold text-gray-900 text-lg">
              Vital Signs
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEdit}
              className="px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center space-x-2 transition-all duration-200"
              title="Add new entry"
            >
              <Plus size={16} />
              <span>Add Entry</span>
            </button>
          </div>
        </div>

        {isEditing ? (
          /* Edit Mode */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Edit Form */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">New Vital Signs Entry</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">BP Systolic</label>
                  <input
                    type="number"
                    value={editingData.bloodPressureSystolic || ''}
                    onChange={(e) => handleInputChange('bloodPressureSystolic', parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">BP Diastolic</label>
                  <input
                    type="number"
                    value={editingData.bloodPressureDiastolic || ''}
                    onChange={(e) => handleInputChange('bloodPressureDiastolic', parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="80"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingData.temperature || ''}
                    onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="98.6"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <select
                    value={editingData.temperatureUnit || 'F'}
                    onChange={(e) => handleInputChange('temperatureUnit', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="F">°F</option>
                    <option value="C">°C</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pulse (bpm)</label>
                  <input
                    type="number"
                    value={editingData.pulse || ''}
                    onChange={(e) => handleInputChange('pulse', parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="72"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Respiration (/min)</label>
                  <input
                    type="number"
                    value={editingData.respiration || ''}
                    onChange={(e) => handleInputChange('respiration', parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="16"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">O2 Saturation (%)</label>
                  <input
                    type="number"
                    value={editingData.oxygenSaturation || ''}
                    onChange={(e) => handleInputChange('oxygenSaturation', parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="98"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pain Level (1-10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={editingData.painLevel || ''}
                    onChange={(e) => handleInputChange('painLevel', parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={editingData.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Additional notes or observations..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>Save Entry</span>
                </button>
              </div>
            </div>
            
            {/* History Panel During Edit */}
            <div className="lg:col-span-1">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Recent History</h4>
              <div className="max-h-96 overflow-y-auto space-y-2 bg-gray-50 rounded-lg p-3">
                {loading ? (
                  <p className="text-sm text-gray-400">Loading...</p>
                ) : vitalHistory.length > 0 ? (
                  vitalHistory.slice(0, 10).map((entry, index) => (
                    <div key={entry.id || index} className="bg-white rounded p-3 border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-800">{entry.recordedAtFormatted}</span>
                        <span className="text-xs text-gray-500">{entry.userName}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {entry.bloodPressureSystolic && entry.bloodPressureDiastolic && (
                          <div><span className="text-gray-500">BP:</span> <span className="font-medium">{entry.bloodPressureSystolic}/{entry.bloodPressureDiastolic}</span></div>
                        )}
                        {entry.temperature && (
                          <div><span className="text-gray-500">Temp:</span> <span className="font-medium">{entry.temperature}°{entry.temperatureUnit}</span></div>
                        )}
                        {entry.pulse && (
                          <div><span className="text-gray-500">Pulse:</span> <span className="font-medium">{entry.pulse}</span></div>
                        )}
                        {entry.respiration && (
                          <div><span className="text-gray-500">Resp:</span> <span className="font-medium">{entry.respiration}</span></div>
                        )}
                        {entry.oxygenSaturation && (
                          <div><span className="text-gray-500">O2:</span> <span className="font-medium">{entry.oxygenSaturation}%</span></div>
                        )}
                        {entry.painLevel && (
                          <div><span className="text-gray-500">Pain:</span> <span className="font-medium">{entry.painLevel}/10</span></div>
                        )}
                      </div>
                      {entry.notes && (
                        <p className="text-xs text-gray-600 italic mt-2 pt-2 border-t border-gray-100">"{entry.notes}"</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No history available</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* View Mode */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Vitals Display */}
            <div className="lg:col-span-2 space-y-6">
              {/* Latest Vitals Display */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Current Vitals</h4>
                {(latestVitals.bloodPressureSystolic || latestVitals.temperature || latestVitals.pulse) ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {latestVitals.bloodPressureSystolic && latestVitals.bloodPressureDiastolic && (
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <p className="text-sm text-red-600 font-medium">Blood Pressure</p>
                        <p className="text-2xl font-bold text-red-700">{latestVitals.bloodPressureSystolic}/{latestVitals.bloodPressureDiastolic}</p>
                        <p className="text-xs text-red-500">mmHg</p>
                      </div>
                    )}
                    {latestVitals.temperature && (
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <p className="text-sm text-orange-600 font-medium">Temperature</p>
                        <p className="text-2xl font-bold text-orange-700">{latestVitals.temperature}°{latestVitals.temperatureUnit || 'F'}</p>
                      </div>
                    )}
                    {latestVitals.pulse && (
                      <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                        <p className="text-sm text-pink-600 font-medium">Pulse</p>
                        <p className="text-2xl font-bold text-pink-700">{latestVitals.pulse}</p>
                        <p className="text-xs text-pink-500">bpm</p>
                      </div>
                    )}
                    {latestVitals.respiration && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-600 font-medium">Respiration</p>
                        <p className="text-2xl font-bold text-blue-700">{latestVitals.respiration}</p>
                        <p className="text-xs text-blue-500">/min</p>
                      </div>
                    )}
                    {latestVitals.oxygenSaturation && (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="text-sm text-green-600 font-medium">O2 Saturation</p>
                        <p className="text-2xl font-bold text-green-700">{latestVitals.oxygenSaturation}%</p>
                      </div>
                    )}
                    {latestVitals.painLevel && (
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <p className="text-sm text-purple-600 font-medium">Pain Level</p>
                        <p className="text-2xl font-bold text-purple-700">{latestVitals.painLevel}/10</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-8 rounded-lg text-center border-2 border-dashed border-gray-300">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-lg text-gray-500 font-medium">No vitals recorded yet</p>
                    <p className="text-sm text-gray-400 mt-1">Click "Add Entry" to record the first vital signs</p>
                  </div>
                )}
              </div>

              {/* Latest Entry Info */}
              {latestVitals.recordedAtFormatted && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h5 className="text-sm font-semibold text-gray-700 mb-3">Last Entry Details</h5>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Clock size={16} />
                      <span>{latestVitals.recordedAtFormatted}</span>
                    </div>
                    {latestVitals.userName && (
                      <div className="flex items-center space-x-2">
                        <User size={16} />
                        <span>{latestVitals.userName}</span>
                      </div>
                    )}
                  </div>
                  {latestVitals.notes && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600 italic">"{latestVitals.notes}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* History Panel */}
            <div className="lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800">History</h4>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {vitalHistory.length} entries
                </span>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto border border-gray-200">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-gray-400">Loading history...</p>
                  </div>
                ) : vitalHistory.length > 0 ? (
                  <div className="space-y-3">
                    {vitalHistory.map((entry, index) => (
                      <div key={entry.id || index} className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-sm transition-shadow">
                        {/* Entry Header */}
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-gray-800">
                            {entry.recordedAtFormatted}
                          </span>
                          <span className="text-xs text-gray-500">
                            {entry.userName}
                          </span>
                        </div>
                        
                        {/* Vitals Grid */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {entry.bloodPressureSystolic && entry.bloodPressureDiastolic && (
                            <div>
                              <span className="text-gray-500">BP:</span>
                              <span className="ml-1 font-medium">{entry.bloodPressureSystolic}/{entry.bloodPressureDiastolic}</span>
                            </div>
                          )}
                          {entry.temperature && (
                            <div>
                              <span className="text-gray-500">Temp:</span>
                              <span className="ml-1 font-medium">{entry.temperature}°{entry.temperatureUnit}</span>
                            </div>
                          )}
                          {entry.pulse && (
                            <div>
                              <span className="text-gray-500">Pulse:</span>
                              <span className="ml-1 font-medium">{entry.pulse}</span>
                            </div>
                          )}
                          {entry.respiration && (
                            <div>
                              <span className="text-gray-500">Resp:</span>
                              <span className="ml-1 font-medium">{entry.respiration}</span>
                            </div>
                          )}
                          {entry.oxygenSaturation && (
                            <div>
                              <span className="text-gray-500">O2:</span>
                              <span className="ml-1 font-medium">{entry.oxygenSaturation}%</span>
                            </div>
                          )}
                          {entry.painLevel && (
                            <div>
                              <span className="text-gray-500">Pain:</span>
                              <span className="ml-1 font-medium">{entry.painLevel}/10</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Notes */}
                        {entry.notes && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <p className="text-xs text-gray-600 italic">"{entry.notes}"</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">No history available</p>
                      <p className="text-xs text-gray-400 mt-1">Add the first vital signs entry</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmSave}
        title="Confirm Vital Signs Entry"
        message="Please review the vital signs data before saving:"
        confirmText="Add Entry"
        cancelText="Cancel"
        type="info"
        details={confirmationDetails}
      />
    </div>
  )
} 