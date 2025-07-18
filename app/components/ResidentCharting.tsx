import React from 'react'
import { 
  User, 
  Brain, 
  Heart, 
  Utensils, 
  Activity, 
  Stethoscope,
  Eye,
  MessageCircle,
  Droplets,
  ArrowUp,
  ArrowDown,
  Smile,
  Clipboard,
  Home
} from 'lucide-react'

const careCategories = [
  {
    title: 'Activities of Daily Living',
    icon: User,
    color: 'bg-blue-100 text-blue-600',
    items: ['Bathing', 'Dressing', 'Grooming', 'Mobility']
  },
  {
    title: 'Cognitive, Psychosocial',
    icon: Brain,
    color: 'bg-amber-100 text-amber-600',
    items: ['Memory', 'Orientation', 'Behavior', 'Social interaction']
  },
  {
    title: 'Health related services',
    icon: Heart,
    color: 'bg-red-100 text-red-600',
    items: ['Vital signs', 'Medications', 'Treatments', 'Assessments']
  },
  {
    title: 'Housekeeping, laundry',
    icon: Home,
    color: 'bg-green-100 text-green-600',
    items: ['Room cleaning', 'Laundry', 'Bed making', 'Organization']
  },
  {
    title: 'Mobility, transfer, escort',
    icon: Activity,
    color: 'bg-purple-100 text-purple-600',
    items: ['Transfers', 'Walking', 'Wheelchair', 'Positioning']
  },
  {
    title: 'Nutrition, dining services',
    icon: Utensils,
    color: 'bg-orange-100 text-orange-600',
    items: ['Meal assistance', 'Hydration', 'Special diets', 'Feeding']
  },
  {
    title: 'Intakes',
    icon: Droplets,
    color: 'bg-cyan-100 text-cyan-600',
    items: ['Fluid intake', 'Food intake', 'Medication intake', 'Monitoring']
  },
  {
    title: 'Outputs',
    icon: ArrowDown,
    color: 'bg-indigo-100 text-indigo-600',
    items: ['Urine output', 'Bowel movements', 'Drainage', 'Vomiting']
  },
  {
    title: 'Vital Signs',
    icon: Stethoscope,
    color: 'bg-pink-100 text-pink-600',
    items: ['Blood pressure', 'Temperature', 'Pulse', 'Respiration']
  },
  {
    title: 'Bowel/Bladder',
    icon: Droplets,
    color: 'bg-teal-100 text-teal-600',
    items: ['Incontinence', 'Catheter care', 'Toileting', 'Hygiene']
  },
  {
    title: 'Behavior',
    icon: Smile,
    color: 'bg-yellow-100 text-yellow-600',
    items: ['Mood', 'Agitation', 'Cooperation', 'Social behavior']
  },
  {
    title: 'Mood',
    icon: Smile,
    color: 'bg-rose-100 text-rose-600',
    items: ['Depression', 'Anxiety', 'Happiness', 'Irritability']
  },
  {
    title: 'Communication',
    icon: MessageCircle,
    color: 'bg-slate-100 text-slate-600',
    items: ['Verbal', 'Non-verbal', 'Hearing', 'Understanding']
  },
  {
    title: 'Skin (Notes)',
    icon: Eye,
    color: 'bg-emerald-100 text-emerald-600',
    items: ['Wound care', 'Skin integrity', 'Pressure sores', 'Rashes']
  },
  {
    title: 'Activities',
    icon: Clipboard,
    color: 'bg-violet-100 text-violet-600',
    items: ['Recreation', 'Therapy', 'Exercise', 'Social activities']
  }
]

export default function ResidentCharting() {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Resident Charting</h2>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View Look Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {careCategories.map((category, index) => {
          const IconComponent = category.icon
          return (
            <div
              key={index}
              className="card hover:shadow-md transition-shadow cursor-pointer p-4"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 rounded-lg ${category.color}`}>
                  <IconComponent size={20} />
                </div>
                <h3 className="font-medium text-gray-900 text-sm leading-tight">
                  {category.title}
                </h3>
              </div>
              
              <div className="space-y-1">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="text-xs text-gray-600">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 