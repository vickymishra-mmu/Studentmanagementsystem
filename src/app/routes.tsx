import { createBrowserRouter, Navigate } from 'react-router';
import { ProtectedRoute } from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import LibraryPage from './pages/LibraryPage';
import AttendancePage from './pages/AttendancePage';
import AcademicRecordPage from './pages/AcademicRecordPage';
import LeaveRecordPage from './pages/LeaveRecordPage';
import BehaviorReportPage from './pages/BehaviorReportPage';
import FeeDetailsPage from './pages/FeeDetailsPage';
import ReportCardPage from './pages/ReportCardPage';

// Principal pages
import AllStudentsPage from './pages/principal/AllStudentsPage';
import PrincipalLeaveApplicationsPage from './pages/principal/LeaveApplicationsPage';
import AdmissionRequestsPage from './pages/principal/AdmissionRequestsPage';
import ManageStaffPage from './pages/principal/ManageStaffPage';

// Class Teacher pages
import ClassStudentsPage from './pages/class-teacher/ClassStudentsPage';
import MarkAttendancePage from './pages/class-teacher/MarkAttendancePage';
import UpdateMarksPage from './pages/class-teacher/UpdateMarksPage';
import ClassTeacherLeaveApplicationsPage from './pages/class-teacher/LeaveApplicationsPage';

// Librarian pages
import IssueBookPage from './pages/librarian/IssueBookPage';
import ReturnBookPage from './pages/librarian/ReturnBookPage';

// Office Worker pages
import FeeSubmissionPage from './pages/office/FeeSubmissionPage';
import NewAdmissionPage from './pages/office/NewAdmissionPage';
import UpdateClassPage from './pages/office/UpdateClassPage';
import RevenuePage from './pages/office/RevenuePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  // Student routes
  {
    path: '/library',
    element: (
      <ProtectedRoute>
        <LibraryPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/attendance',
    element: (
      <ProtectedRoute>
        <AttendancePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/academic',
    element: (
      <ProtectedRoute>
        <AcademicRecordPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/leave',
    element: (
      <ProtectedRoute>
        <LeaveRecordPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/behavior',
    element: (
      <ProtectedRoute>
        <BehaviorReportPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/fee-details',
    element: (
      <ProtectedRoute>
        <FeeDetailsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/report-card',
    element: (
      <ProtectedRoute>
        <ReportCardPage />
      </ProtectedRoute>
    ),
  },
  // Principal routes
  {
    path: '/principal/students',
    element: (
      <ProtectedRoute>
        <AllStudentsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/principal/leave-applications',
    element: (
      <ProtectedRoute>
        <PrincipalLeaveApplicationsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/principal/admission-requests',
    element: (
      <ProtectedRoute>
        <AdmissionRequestsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/principal/manage-staff',
    element: (
      <ProtectedRoute>
        <ManageStaffPage />
      </ProtectedRoute>
    ),
  },
  // Class Teacher routes
  {
    path: '/class-teacher/students',
    element: (
      <ProtectedRoute>
        <ClassStudentsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/class-teacher/mark-attendance',
    element: (
      <ProtectedRoute>
        <MarkAttendancePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/class-teacher/update-marks',
    element: (
      <ProtectedRoute>
        <UpdateMarksPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/class-teacher/leave-applications',
    element: (
      <ProtectedRoute>
        <ClassTeacherLeaveApplicationsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/class-teacher/behavior',
    element: (
      <ProtectedRoute>
        <BehaviorReportPage />
      </ProtectedRoute>
    ),
  },
  // Librarian routes
  {
    path: '/librarian/issue-book',
    element: (
      <ProtectedRoute>
        <IssueBookPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/librarian/return-book',
    element: (
      <ProtectedRoute>
        <ReturnBookPage />
      </ProtectedRoute>
    ),
  },
  // Office Worker routes
  {
    path: '/office/fee-submission',
    element: (
      <ProtectedRoute>
        <FeeSubmissionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/office/late-fee',
    element: (
      <ProtectedRoute>
        <FeeSubmissionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/office/library-fine',
    element: (
      <ProtectedRoute>
        <FeeSubmissionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/office/new-admission',
    element: (
      <ProtectedRoute>
        <NewAdmissionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/office/update-class',
    element: (
      <ProtectedRoute>
        <UpdateClassPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/office/revenue',
    element: (
      <ProtectedRoute>
        <RevenuePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);