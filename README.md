# Doctor's Portal - Healthcare Management System

A modern healthcare management system built with Next.js and React, designed for doctors to manage patient data efficiently.

## Features

- **Patient Management**: Add, edit, and view patient information
- **Resident Charting**: Comprehensive care tracking categories
- **Login Page**: Professional login interface (layout only)
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Real-time Updates**: Instant patient data updates
- **Healthcare Categories**: 15+ care categories including:
  - Activities of Daily Living
  - Cognitive & Psychosocial care
  - Health related services
  - Vital signs monitoring
  - Medication management
  - And more...

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd doctors-portal
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
doctors-portal/
├── app/
│   ├── components/
│   │   ├── Header.tsx          # Navigation header
│   │   ├── PatientCard.tsx     # Patient information card
│   │   ├── PatientModal.tsx    # Add/edit patient modal
│   │   └── ResidentCharting.tsx # Care categories grid
│   ├── login/
│   │   └── page.tsx            # Login page
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main dashboard
├── package.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## Usage

### Login Page
1. Visit `/login` to access the login interface
2. Professional layout with email/password fields
3. Currently layout only - no authentication functionality yet

### Adding a Patient
1. Click the "Add Patient" button in the header
2. Fill in the patient information form
3. Click "Add Patient" to save

### Editing a Patient
1. Click on any patient card
2. Modify the information in the modal
3. Click "Update Patient" to save changes

### Resident Charting
The charting section provides quick access to various care categories for comprehensive patient care tracking.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Styling

The project uses Tailwind CSS for styling with custom color schemes and component classes defined in `globals.css`.

## Future Enhancements

- Backend API integration
- Database connectivity
- User authentication
- Advanced search and filtering
- Reporting features
- Mobile app support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 