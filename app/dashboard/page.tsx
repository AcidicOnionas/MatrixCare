'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../components/Header'
import PatientModal from '../components/PatientModal'

// Expanded mock patient data with placeholder images
const mockPatients = [
  {
    id: 1,
    name: 'Catherine Albertson',
    age: 81,
    dob: '07/09/1939',
    sex: 'F',
    room: '12A',
    physician: 'Dr. Heartache',
    allergies: 'PCN, None',
    diagnoses: 'CHF, Arthritis',
    diet: 'Regular',
    adminInstructions: '',
    profileImage: '/api/placeholder/150/150'
  },
  {
    id: 2,
    name: 'Robert Johnson',
    age: 67,
    dob: '03/15/1956',
    sex: 'M',
    room: '8B',
    physician: 'Dr. Smith',
    allergies: 'Shellfish',
    diagnoses: 'Diabetes, Hypertension',
    diet: 'Diabetic',
    adminInstructions: 'Check blood sugar twice daily',
    profileImage: '/api/placeholder/150/150'
  },
  {
    id: 3,
    name: 'Maria Rodriguez',
    age: 54,
    dob: '11/22/1969',
    sex: 'F',
    room: '15C',
    physician: 'Dr. Wilson',
    allergies: 'None',
    diagnoses: 'Post-surgical recovery',
    diet: 'Soft foods',
    adminInstructions: 'Physical therapy 3x weekly',
    profileImage: '/api/placeholder/150/150'
  },
  {
    id: 4,
    name: 'James Thompson',
    age: 72,
    dob: '08/30/1951',
    sex: 'M',
    room: '22A',
    physician: 'Dr. Brown',
    allergies: 'Latex',
    diagnoses: 'COPD, Osteoporosis',
    diet: 'Regular',
    adminInstructions: 'Oxygen therapy as needed',
    profileImage: '/api/placeholder/150/150'
  },
  {
    id: 5,
    name: 'Linda Davis',
    age: 89,
    dob: '01/12/1934',
    sex: 'F',
    room: '5D',
    physician: 'Dr. Garcia',
    allergies: 'Morphine',
    diagnoses: 'Dementia, Osteoarthritis',
    diet: 'Pureed',
    adminInstructions: 'Assistance with all ADLs',
    profileImage: '/api/placeholder/150/150'
  },
  {
    id: 6,
    name: 'Michael Chen',
    age: 45,
    dob: '06/18/1978',
    sex: 'M',
    room: '18B',
    physician: 'Dr. Lee',
    allergies: 'Penicillin',
    diagnoses: 'Stroke recovery',
    diet: 'Regular',
    adminInstructions: 'Speech therapy daily',
    profileImage: '/api/placeholder/150/150'
  }
]

export default function Dashboard() {
  const router = useRouter()
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [patients, setPatients] = useState(mockPatients)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Trigger animations after component mounts
    setTimeout(() => setIsLoaded(true), 100)
  }, [])

  const handlePatientClick = (patient: any) => {
    // Redirect to patient detail page instead of opening modal
    router.push(`/patient/${patient.id}`)
  }

  const handleAddPatient = () => {
    setSelectedPatient(null)
    setIsModalOpen(true)
  }

  const handleSavePatient = (patientData: any) => {
    if (selectedPatient) {
      // Update existing patient
      setPatients(patients.map(p => p.id === selectedPatient.id ? { ...patientData, id: selectedPatient.id } : p))
    } else {
      // Add new patient
      const newPatient = { ...patientData, id: Date.now() }
      setPatients([...patients, newPatient])
    }
    setIsModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background floating elements - these continue floating */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-element absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-10"></div>
        <div className="floating-element-delayed absolute top-60 right-20 w-16 h-16 bg-purple-100 rounded-full opacity-15"></div>
        <div className="floating-element absolute bottom-40 left-40 w-24 h-24 bg-green-100 rounded-full opacity-10"></div>
      </div>

      <div className="relative z-10">
        {/* Header with one-time floating animation */}
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="animate-float-once">
            <Header onAddPatient={handleAddPatient} />
          </div>
        </div>
        
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <div className={`mb-8 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Patients</h1>
            <p className="text-gray-600">Manage and monitor your patient care</p>
          </div>

          {/* Patient Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {patients.map((patient, index) => (
              <div
                key={patient.id}
                className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${500 + index * 100}ms` }}
              >
                <div className="animate-float-once-delayed idle-state">
                  <div
                    onClick={() => handlePatientClick(patient)}
                    className="card cursor-pointer hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-white rounded-lg overflow-hidden"
                  >
                    {/* Patient Image */}
                    <div className="relative h-48 bg-gray-200">
                      <img
                        src={patient.profileImage}
                        alt={patient.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&size=300&background=e5e7eb&color=374151`
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-semibold text-gray-600">
                        Room {patient.room}
                      </div>
                    </div>

                    {/* Patient Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 truncate">
                        {patient.name}
                      </h3>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Age:</span>
                          <span className="font-medium">{patient.age}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sex:</span>
                          <span className="font-medium">{patient.sex}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Physician:</span>
                          <span className="font-medium truncate ml-2">{patient.physician}</span>
                        </div>
                      </div>

                      {/* Primary Diagnosis */}
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Primary Diagnosis:</p>
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {patient.diagnoses.split(',')[0]}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {patients.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patients yet</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first patient</p>
              <button
                onClick={handleAddPatient}
                className="btn-primary"
              >
                Add Patient
              </button>
            </div>
          )}
        </main>

        {/* Patient Modal - Only for adding new patients */}
        <PatientModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          patient={selectedPatient}
          onSave={handleSavePatient}
        />
      </div>
    </div>
  )
} 