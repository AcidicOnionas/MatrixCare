'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Header from '../../components/Header'
import { ArrowLeft, User, Edit3, Save, X } from 'lucide-react'
import ProtectedRoute from '../../components/ProtectedRoute'
import { tokenStorage } from '../../lib/auth'
import VitalSignsCard from '../../components/VitalSignsCard'

// Mock patient data with placeholder images
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

// Resident charting categories
const chartingCategories = [
  {
    title: "Activities of Daily Living",
    icon: "👤",
    color: "blue",
    items: ["Bathing", "Dressing", "Grooming", "Mobility"]
  },
  {
    title: "Cognitive, Psychosocial",
    icon: "⚠️",
    color: "yellow",
    items: ["Memory", "Orientation", "Behavior", "Social interaction"]
  },
  {
    title: "Health related services",
    icon: "❤️",
    color: "red",
    items: ["Vital signs", "Medications", "Treatments", "Assessments"]
  },
  {
    title: "Housekeeping, laundry",
    icon: "🏠",
    color: "green",
    items: ["Room cleaning", "Laundry", "Bed making", "Organization"]
  },
  {
    title: "Mobility, transfer, escort",
    icon: "↗️",
    color: "purple",
    items: ["Transfers", "Walking", "Wheelchair", "Positioning"]
  },
  {
    title: "Nutrition, dining services",
    icon: "🍽️",
    color: "orange",
    items: ["Meal assistance", "Hydration", "Special diets", "Feeding"]
  },
  {
    title: "Intakes",
    icon: "💧",
    color: "cyan",
    items: ["Fluid intake", "Food intake", "Medication intake", "Monitoring"]
  },
  {
    title: "Outputs",
    icon: "📊",
    color: "indigo",
    items: ["Urine output", "Bowel movements", "Drainage", "Vomiting"]
  },
  {
    title: "Vital Signs",
    icon: "🩺",
    color: "pink",
    items: ["Blood pressure", "Temperature", "Pulse", "Respiration"]
  },
  {
    title: "Bowel/Bladder",
    icon: "🔄",
    color: "teal",
    items: ["Incontinence", "Catheter care", "Toileting", "Hygiene"]
  },
  {
    title: "Behavior",
    icon: "😊",
    color: "yellow",
    items: ["Mood", "Agitation", "Cooperation", "Social behavior"]
  },
  {
    title: "Mood",
    icon: "🔴",
    color: "red",
    items: ["Depression", "Anxiety", "Happiness", "Irritability"]
  },
  {
    title: "Communication",
    icon: "💬",
    color: "gray",
    items: ["Verbal", "Non-verbal", "Hearing", "Understanding"]
  },
  {
    title: "Skin (Notes)",
    icon: "👁️",
    color: "green",
    items: ["Wound care", "Skin integrity", "Pressure sores", "Rashes"]
  },
  {
    title: "Activities",
    icon: "📋",
    color: "purple",
    items: ["Recreation", "Therapy", "Exercise", "Social activities"]
  }
]

function PatientDetailContent() {
  const router = useRouter()
  const params = useParams()
  const patientId = parseInt(params.id as string)
  const [patient, setPatient] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  // API base URL
  const API_BASE_URL = 'http://localhost:8080/api'

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
    const fetchPatient = async () => {
      try {
        setLoading(true)
        const token = tokenStorage.getToken()
        const headers: any = {
          'Content-Type': 'application/json'
        }
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
        
        const response = await fetch(`${API_BASE_URL}/patients/${patientId}`, {
          headers
        })
        
        if (!response.ok) {
          throw new Error('Patient not found')
        }
        
        const patientData = await response.json()
        
        // Transform backend data to frontend format
        const transformedPatient = {
          id: patientData.id,
          firstName: patientData.firstName,
          lastName: patientData.lastName,
          name: `${patientData.firstName} ${patientData.lastName}`,
          age: calculateAge(patientData.dateOfBirth),
          dob: patientData.dateOfBirth,
          sex: patientData.gender,
          room: patientData.roomNumber || 'N/A',
          physician: patientData.primaryPhysician || 'Not assigned',
          medicalRecordNumber: patientData.medicalRecordNumber,
          admissionDate: patientData.admissionDate,
          emergencyContactName: patientData.emergencyContactName,
          emergencyContactPhone: patientData.emergencyContactPhone,
          allergies: patientData.allergies || 'None known',
          diagnoses: patientData.diagnoses || 'None recorded',
          diet: 'Regular', // This would come from additional patient data
          adminInstructions: 'Standard care', // This would come from care plans
          profileImage: `/api/placeholder/150/150`
        }
        
        setPatient(transformedPatient)
        setError(null)
      } catch (err) {
        console.error('Error fetching patient:', err)
        setError('Failed to load patient data')
        setPatient(null)
      } finally {
        setLoading(false)
        setTimeout(() => setIsLoaded(true), 100)
      }
    }

    if (patientId) {
      fetchPatient()
    }
  }, [patientId])

  const handleAddPatient = () => {
    // Navigate to dashboard where the modal works properly
    router.push('/dashboard?showModal=true')
  }

  const handleBackToDashboard = () => {
    router.push('/dashboard')
  }



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Patient...</h2>
          <p className="text-gray-600">Fetching patient data from database</p>
        </div>
      </div>
    )
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Patient Not Found'}</h2>
          <p className="text-gray-600 mb-4">The patient you're looking for doesn't exist or couldn't be loaded.</p>
          <button
            onClick={handleBackToDashboard}
            className="btn-primary flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-element absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-10"></div>
        <div className="floating-element-delayed absolute top-60 right-20 w-16 h-16 bg-purple-100 rounded-full opacity-15"></div>
        <div className="floating-element absolute bottom-40 left-40 w-24 h-24 bg-green-100 rounded-full opacity-10"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="animate-float-once">
            <Header onAddPatient={handleAddPatient} />
          </div>
        </div>

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className={`mb-6 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <button
              onClick={handleBackToDashboard}
              className="btn-secondary flex items-center space-x-2 hover:scale-105 transition-transform duration-200"
            >
              <ArrowLeft size={16} />
              <span>Back to Dashboard</span>
            </button>
          </div>

          {/* Patient Header Section */}
          <div className={`mb-8 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Patients</h2>
            
            <div className="card animate-float-once-delayed">
              <div className="flex items-start space-x-4">
                {/* Patient Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                </div>

                {/* Patient Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{patient.name}</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Age: {patient.age} years • D.O.B: {patient.dob} • Sex: {patient.sex}</p>
                        <p>Room: {patient.room}</p>
                        <p>Primary Physician: {patient.physician}</p>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                      Provider CPR
                    </div>
                  </div>

                  {/* Medical Details */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-700 mb-1">Allergies:</p>
                      <p className="text-gray-600">{patient.allergies}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 mb-1">Diagnoses:</p>
                      <p className="text-gray-600">{patient.diagnoses}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 mb-1">Diet:</p>
                      <p className="text-gray-600">{patient.diet}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vital Signs Section */}
          <div className={`transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Vital Signs</h2>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                View All History
              </button>
            </div>

            {/* Vital Signs Card Only */}
            <div className="w-full">
              {/* Special Vital Signs Card */}
              <VitalSignsCard patientId={patientId} isLoaded={isLoaded} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function PatientDetailPage() {
  return (
    <ProtectedRoute>
      <PatientDetailContent />
    </ProtectedRoute>
  )
} 