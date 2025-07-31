'use client'

import React, { useState, useEffect } from 'react'
import { X, Edit2, User, Calendar, MapPin, Stethoscope, AlertTriangle, FileText, Utensils, Clipboard } from 'lucide-react'

interface Patient {
  id?: number
  firstName: string
  lastName: string
  age: number
  dob: string
  sex: string
  room: string
  physician: string
  allergies: string
  diagnoses: string
  diet: string
  adminInstructions: string
  profileImage?: string
  // Keep name as computed property for backward compatibility
  name?: string
}

interface PatientModalProps {
  isOpen: boolean
  onClose: () => void
  patient?: Patient | null
  onSave: (patient: Patient) => void
}

export default function PatientModal({ isOpen, onClose, patient, onSave }: PatientModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Patient>({
    firstName: '',
    lastName: '',
    age: 0,
    dob: '',
    sex: '',
    room: '',
    physician: '',
    allergies: '',
    diagnoses: '',
    diet: '',
    adminInstructions: ''
  })

  useEffect(() => {
    if (patient) {
      // If patient has separate firstName/lastName, use them
      if (patient.firstName && patient.lastName) {
        setFormData(patient)
      } else if (patient.name) {
        // If patient has combined name, split it
        const nameParts = patient.name.trim().split(' ')
        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ') || 'Unknown'
        setFormData({
          ...patient,
          firstName,
          lastName
        })
      } else {
        setFormData(patient)
      }
      setIsEditing(false) // Always start in view mode for existing patients
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        age: 0,
        dob: '',
        sex: '',
        room: '',
        physician: '',
        allergies: '',
        diagnoses: '',
        diet: '',
        adminInstructions: ''
      })
      setIsEditing(true) // Start in edit mode for new patients
    }
  }, [patient])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Create confirmation message with data summary
    const summary = `
Patient Information:
• Name: ${formData.firstName} ${formData.lastName}
• Age: ${formData.age}
• Date of Birth: ${formData.dob}
• Sex: ${formData.sex}
• Room: ${formData.room}
• Physician: ${formData.physician}
• Allergies: ${formData.allergies || 'None'}
• Diet: ${formData.diet || 'Not specified'}
• Diagnoses: ${formData.diagnoses || 'None'}
• Instructions: ${formData.adminInstructions || 'None'}

Do you want to save this patient?`

    // Show native browser confirmation dialog
    if (window.confirm(summary)) {
      onSave(formData)
      setIsEditing(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value
    }))
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    if (patient) {
      setFormData(patient) // Reset to original data
      setIsEditing(false)
    } else {
      onClose() // Close modal if it's a new patient
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-float-once">
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-4">
            {patient && patient.profileImage && (
              <img
                src={patient.profileImage}
                alt={patient.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name || patient.firstName + ' ' + patient.lastName || 'Patient')}&size=64&background=e5e7eb&color=374151`
                }}
              />
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {patient ? (isEditing ? 'Edit Patient' : `${formData.firstName} ${formData.lastName}`) : 'Add New Patient'}
              </h2>
              {patient && !isEditing && (
                <p className="text-gray-600">Room {formData.room} • {formData.physician}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {patient && !isEditing && (
              <button
                onClick={handleEdit}
                className="btn-secondary flex items-center space-x-2"
              >
                <Edit2 size={16} />
                <span>Edit</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {isEditing ? (
          // Edit Mode
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sex
                </label>
                <input
                  type="text"
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="M or F"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room
                </label>
                <input
                  type="text"
                  name="room"
                  value={formData.room}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Physician
                </label>
                <input
                  type="text"
                  name="physician"
                  value={formData.physician}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allergies
                </label>
                <input
                  type="text"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., PCN, None"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diet
                </label>
                <input
                  type="text"
                  name="diet"
                  value={formData.diet}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Regular, Diabetic"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diagnoses
              </label>
              <input
                type="text"
                name="diagnoses"
                value={formData.diagnoses}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., CHF, Arthritis"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Administration Instructions
              </label>
              <textarea
                name="adminInstructions"
                value={formData.adminInstructions}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any special instructions..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {patient ? 'Save Changes' : 'Save Patient'}
              </button>
            </div>
          </form>
        ) : (
          // View Mode
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Patient Information</p>
                    <p className="text-lg font-semibold text-gray-900">{`${formData.firstName} ${formData.lastName}`}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Age & Date of Birth</p>
                    <p className="text-lg font-semibold text-gray-900">{formData.age} years old</p>
                    <p className="text-sm text-gray-600">{formData.dob}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Room & Sex</p>
                    <p className="text-lg font-semibold text-gray-900">Room {formData.room} • {formData.sex === 'M' ? 'Male' : 'Female'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Stethoscope className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Primary Physician</p>
                    <p className="text-lg font-semibold text-gray-900">{formData.physician}</p>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Allergies</p>
                    <p className="text-lg font-semibold text-gray-900">{formData.allergies || 'None reported'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-orange-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Diagnoses</p>
                    <p className="text-lg font-semibold text-gray-900">{formData.diagnoses || 'No diagnoses recorded'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Utensils className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Diet</p>
                    <p className="text-lg font-semibold text-gray-900">{formData.diet || 'Regular'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Administration Instructions */}
            {formData.adminInstructions && (
              <div className="border-t pt-6">
                <div className="flex items-start space-x-3">
                  <Clipboard className="w-5 h-5 text-gray-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-2">Administration Instructions</p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-900 whitespace-pre-wrap">{formData.adminInstructions}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 