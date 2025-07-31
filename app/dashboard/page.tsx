'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '../components/Header'
import PatientModal from '../components/PatientModal'
import ProtectedRoute from '../components/ProtectedRoute'
import ConfirmationModal from '../components/ConfirmationModal'
import { useAuth } from '../contexts/AuthContext'

// API base URL
const API_BASE_URL = 'http://localhost:8080/api'

// Patient interface to match backend
interface Patient {
  id: number
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: 'M' | 'F' | 'Other'
  roomNumber?: string
  primaryPhysician?: string
  medicalRecordNumber: string
  admissionDate?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  isActive: boolean
  // Add computed properties for compatibility
  name: string
  age: number
  sex: string
  room: string
  physician: string
  profileImage: string
  allergies?: any[]
  diagnoses?: any[]
  medications?: any[]
}

function DashboardContent() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null)

  // Fetch patients from API
  const fetchPatients = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/patients`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch patients')
      }
      
      const data = await response.json()
      
      // Transform backend data to frontend format
      const transformedPatients = data.map((patient: any) => ({
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        name: `${patient.firstName} ${patient.lastName}`, // Combined name for backward compatibility
        age: patient.age || calculateAge(patient.dateOfBirth),
        dob: patient.dateOfBirth,
        sex: patient.gender,
        room: patient.roomNumber,
        physician: patient.primaryPhysician,
        allergies: 'None', // These will come from related tables later
        diagnoses: 'None',
        diet: 'Regular',
        adminInstructions: '',
        profileImage: `/api/placeholder/150/150`
      }))
      
      setPatients(transformedPatients)
      setError(null)
    } catch (err) {
      console.error('Error fetching patients:', err)
      setError('Failed to load patients. Please try again.')
      // Fallback to empty array
      setPatients([])
    } finally {
      setLoading(false)
    }
  }

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    if (!dateOfBirth) return 0
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  useEffect(() => {
    fetchPatients()
    // Trigger animations after component mounts
    setTimeout(() => setIsLoaded(true), 100)
    
    // Check if we should show the modal from query params
    if (searchParams.get('showModal') === 'true') {
      setIsModalOpen(true)
      // Clean up the URL
      router.replace('/dashboard')
    }
  }, [searchParams, router])

  const handlePatientClick = (patient: any) => {
    // Redirect to patient detail page instead of opening modal
    router.push(`/patient/${patient.id}`)
  }

  const handleAddPatient = () => {
    setSelectedPatient(null)
    setIsModalOpen(true)
  }

  const handleDeletePatient = (patient: Patient) => {
    setPatientToDelete(patient)
    setShowDeleteModal(true)
  }

  const confirmDeletePatient = async () => {
    if (!patientToDelete) return

    try {
      const response = await fetch(`${API_BASE_URL}/patients/${patientToDelete.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Refresh the patient list after successful deletion
        await fetchPatients()
      } else {
        throw new Error('Failed to delete patient')
      }
    } catch (error) {
      console.error('Error deleting patient:', error)
      alert('Failed to delete patient. Please try again.')
    }
  }

  const handleSavePatient = async (patientData: any) => {
    try {
      // Transform frontend data to backend format
      const backendData = {
        firstName: patientData.firstName?.trim() || 'Patient',
        lastName: patientData.lastName?.trim() || 'Unknown',
        dateOfBirth: patientData.dob,
        gender: patientData.sex,
        roomNumber: patientData.room,
        primaryPhysician: patientData.physician,
        // Optional fields
        emergencyContactName: patientData.emergencyContactName || null,
        emergencyContactPhone: patientData.emergencyContactPhone || null,
        insuranceInfo: patientData.insuranceInfo || null
      }

      // Validate required fields
      if (!backendData.firstName || !backendData.lastName || !backendData.dateOfBirth || !backendData.gender) {
        throw new Error('Please fill in all required fields (First Name, Last Name, Date of Birth, Sex)')
      }

      console.log('Sending data to backend:', backendData) // Debug log

      let response
      if (selectedPatient) {
        // Update existing patient
        response = await fetch(`${API_BASE_URL}/patients/${selectedPatient.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(backendData)
        })
      } else {
        // Create new patient
        response = await fetch(`${API_BASE_URL}/patients`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(backendData)
        })
      }

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Backend error:', errorText)
        throw new Error(`Failed to save patient: ${response.status} ${response.statusText}`)
      }

      const savedPatient = await response.json()
      console.log('Patient saved successfully:', savedPatient)

      // Refresh the patient list
      await fetchPatients()
      setIsModalOpen(false)
      setError(null) // Clear any previous errors
    } catch (err) {
      console.error('Error saving patient:', err)
      setError(err instanceof Error ? err.message : 'Failed to save patient. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Patients...</h2>
          <p className="text-gray-600">Fetching data from database</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchPatients}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    )
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.firstName || 'User'}
            </h1>
            <p className="text-gray-600">Manage and monitor your patient care • {patients.length} active patients</p>
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
                      <div className="absolute top-2 left-2 bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs font-semibold">
                        {patient.medicalRecordNumber}
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

                      {/* Status Badge and Actions */}
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Status:</span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                            Active
                          </span>
                        </div>
                        <div className="mt-2 flex justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeletePatient(patient)
                            }}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            title="Delete patient"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {patients.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first patient to the database</p>
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

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setPatientToDelete(null)
          }}
          onConfirm={confirmDeletePatient}
          title="Delete Patient"
          message={`Are you sure you want to delete patient ${patientToDelete?.name}?`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          details={[
            "This action cannot be undone",
            "All patient data will be permanently removed"
          ]}
        />
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
} 