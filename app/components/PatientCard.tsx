import React from 'react'
import { User } from 'lucide-react'

interface Patient {
  id: number
  name: string
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
}

interface PatientCardProps {
  patient: Patient
  onClick: () => void
}

export default function PatientCard({ patient, onClick }: PatientCardProps) {
  return (
    <div 
      className="card hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        {/* Patient Photo */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <User size={32} className="text-gray-400" />
          </div>
        </div>

        {/* Patient Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
              <div className="text-sm text-gray-500 space-y-1">
                <div>Age: {patient.age} years • D.O.B: {patient.dob} • Sex: {patient.sex}</div>
                <div>Room: {patient.room}</div>
                <div>Primary Physician: {patient.physician}</div>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Provider CPR
              </span>
            </div>
          </div>

          {/* Medical Info */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Allergies:</span>
              <div className="text-gray-600">{patient.allergies}</div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Diagnoses:</span>
              <div className="text-gray-600">{patient.diagnoses}</div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Diet:</span>
              <div className="text-gray-600">{patient.diet}</div>
            </div>
          </div>

          {patient.adminInstructions && (
            <div className="mt-3">
              <span className="font-medium text-gray-700">Administration Instructions:</span>
              <div className="text-gray-600">{patient.adminInstructions}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 