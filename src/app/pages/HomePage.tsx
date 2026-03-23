import { useAuth } from '../contexts/AuthContext';
import PrincipalHomePage from './PrincipalHomePage';
import ClassTeacherHomePage from './ClassTeacherHomePage';
import LibrarianHomePage from './LibrarianHomePage';
import OfficeWorkerHomePage from './OfficeWorkerHomePage';
import StudentHomePage from './StudentHomePage';

export default function HomePage() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'principal':
      return <PrincipalHomePage />;
    case 'class_teacher':
      return <ClassTeacherHomePage />;
    case 'teacher':
      return <ClassTeacherHomePage />; // Teachers use same dashboard
    case 'librarian':
      return <LibrarianHomePage />;
    case 'office_worker':
      return <OfficeWorkerHomePage />;
    case 'student':
    default:
      return <StudentHomePage />;
  }
}