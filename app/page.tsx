'use client'

import React, { useState } from 'react'
import Header from './components/Header'
import PatientCard from './components/PatientCard'
import PatientModal from './components/PatientModal'
import ResidentCharting from './components/ResidentCharting'

// Mock patient data
const mockPatients = [
  {
    id: 1,
    name: 'Albertson, Catherine',
    age: 81,
    dob: '07/09/1939',
    sex: 'F',
    room: '12A',
    physician: 'Dr Heartache',
    allergies: 'PCN, None',
    diagnoses: 'CHF, Arthritis',
    diet: 'Regular',
    adminInstructions: '',
    profileImage: '/api/placeholder/80/80'
  }
]

export default function Dashboard() {
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [patients, setPatients] = useState(mockPatients)

  const handlePatientClick = (patient: any) => {
    setSelectedPatient(patient)
    setIsModalOpen(true)
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
    <div className="min-h-screen bg-gray-50">
      <Header onAddPatient={handleAddPatient} />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Patient List */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Patients</h2>
          <div className="grid gap-4">
            {patients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onClick={() => handlePatientClick(patient)}
              />
            ))}
          </div>
        </div>

        {/* Resident Charting */}
        <ResidentCharting />
      </main>

      {/* Patient Modal */}
      <PatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patient={selectedPatient}
        onSave={handleSavePatient}
      />
    </div>
  )
} 