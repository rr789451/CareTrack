# Healthcare Appointment Management System

A modern, full-stack appointment management solution for healthcare services built with Next.js, TypeScript, and Appwrite. The system enables patients to schedule appointments and allows administrators to manage bookings efficiently.

🔗 **Live Website**: [https://care-track-nine.vercel.app/](https://care-track-nine.vercel.app/)

## 🚀 Features

- **Patient Portal**
  - Secure authentication and registration
  - Comprehensive appointment management
  - Multi-step form completion for personal and medical information
  - Intuitive appointment booking interface
  - Real-time booking confirmation
  - SMS notifications for appointment updates

- **Admin Dashboard**
  - Comprehensive appointment management
  - Comprehensive doctor management
  - Dynamic scheduling interface
  - Automated SMS notifications for schedule changes
  - Real-time updates using TanStack Table

## 💻 Tech Stack

- **Frontend**: Next.js with TypeScript
- **UI Components**: Shadcn/UI
- **Styling**: Tailwind CSS
- **Authentication & Backend**: Appwrite
- **Messaging**: Appwrite & Twilio
- **Error Tracking**: Sentry
- **Table Management**: TanStack Table
- **Deployment**: Vercel

## 📁 Project Structure

```
/app
├── pages/           # Next.js pages and routing
├── components/      # Reusable UI components
├── lib/             # Utility functions and services
├── constants/       # Application constants
├── public/          # Static assets
└── types/           # TypeScript definitions
```

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/rr789451/CareTrack.git
cd caretrack
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local
```

4. Configure the following environment variables:
```env
# Appwrite
PROJECT_ID=
API_KEY=
DATABASE_ID=
PATIENT_COLLECTION_ID=
DOCTOR_COLLECTION_ID=
APPOINTMENT_COLLECTION_ID=
NEXT_PUBLIC_BUCKET_ID=
NEXT_PUBLIC_ENDPOINT=
NEXT_PUBLIC_ADMIN_PASSKEY=

# Sentry
SENTRY_AUTH_TOKEN=
```

5. Start the development server:
```bash
npm run dev
```

## 🔑 Authentication

The application uses Appwrite for authentication. Ensure you have set up the following:

- Create an Appwrite project
- Configure authentication methods (OTP Authentication)
- Set up the necessary collections in Appwrite Console
- Update the environment variables with your Appwrite credentials

## 📱 SMS Notifications


SMS notifications are handled through Twilio. To set up:

- Create a Twilio account
- Obtain your account SID and auth token
- Purchase or use a test phone number
- Update the environment variables with your Twilio credentials

## 💾 Database Schema

### Patient Collection
```typescript
interface Patient {
  userId: string;
  name: string;
  email: email;
  phone: string;
  privacyConsent: boolean;
  gender: enum;
  birthDate: string;
  address: string;
  occpation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies: string;
  currentMedication: string;
  familyMedicalHistory: string;
  pastMedicalHistory: string;
  identificationType: string;
  identificationNumber: string;
  identificationDocumentId: string;
  identificationDocumentUrl: string;
  primaryPhysician: string;
  treatmentConsent: boolean;
  disclosureConsent: boolean;
}
```

### Appointment Collection
```typescript
interface Appointment {
  userId: string;
  patientId: string;
  doctor: string;
  schedule: dateTime;
  reason: string;
  note: string;
  status: enum;
  cancellationReason: string;
  completionReason: string;
}
```

### Doctor Collection
```typescript
interface Doctor {
  name: string;
  imageUrl: string;
  status: enum;
  imageId: string;
}
```

### Otp Collection
```typescript
interface Doctor {
  email: string;
  otpCode: string;
  expiresAt: dateTime;
}
```

## 👥 User Roles

### Patients
- Register and create an account
- Complete profile with medical information
- Schedule appointments
- Receive SMS notifications

### Administrators
- Access admin dashboard
- Manage all appointments
- Manage all doctors
- Schedule and cancel appointments
- Send notifications to patients

## 📊 Analytics and Monitoring

- **Error Tracking**: Integrated with Sentry for real-time error monitoring
- **Performance**: Vercel Analytics for performance monitoring
- **Usage Statistics**: Available in the admin dashboard

## 🚀 Deployment

The application is configured for deployment on Vercel:

- Connect your GitHub repository to Vercel
- Configure environment variables in Vercel dashboard
- Deploy using the Vercel Dashboard:


## 🤝 Contributing

- Fork the repository
- Create a feature branch
```bash
git checkout -b feature/YourFeature
```
- Commit changes
```bash
git commit -m 'Add some feature'
```
- Push to the branch
```bash
git push origin feature/YourFeature
```
- Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please:
- Open an issue in the GitHub repository
- Contact me at [Rohit](mailto:rr789451@gmail.com?subject=[GitHub]%20Appointment%20Scheduler%20Support)

## ✨ Acknowledgments

Built with the following amazing technologies:

[![Next.js](https://img.shields.io/badge/Next.js-13.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/) [![Appwrite](https://img.shields.io/badge/Appwrite-Cloud-FF1E56?style=for-the-badge&logo=appwrite)](https://appwrite.io/) [![Shadcn/UI](https://img.shields.io/badge/Shadcn/UI-000000?style=for-the-badge&logo=shadcnui)](https://ui.shadcn.com/) [![TanStack Table](https://img.shields.io/badge/TanStack_Table-V8-FF4154?style=for-the-badge&logo=react)](https://tanstack.com/table/v8) [![Twilio](https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=twilio)](https://www.twilio.com/) [![Sentry](https://img.shields.io/badge/Sentry-362D59?style=for-the-badge&logo=sentry)](https://sentry.io/) [![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)
