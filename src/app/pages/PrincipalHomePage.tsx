import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { BookOpen, Users, ClipboardList, LogOut, Bell, UserPlus, Shield } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { useState, useEffect } from 'react';

export default function PrincipalHomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [pendingApplications, setPendingApplications] = useState(0);
  const [pendingAdmissions, setPendingAdmissions] = useState(0);

  useEffect(() => {
    // Get pending leave applications sent to principal
    const leaveApplications = JSON.parse(localStorage.getItem('leaveApplications') || '[]');
    const pending = leaveApplications.filter(
      (app: any) => app.status === 'Pending' && app.sentTo === 'principal'
    ).length;
    setPendingApplications(pending);

    // Get pending admission requests
    const admissionRequests = JSON.parse(localStorage.getItem('admissionRequests') || '[]');
    const pendingAdm = admissionRequests.filter(
      (req: any) => req.status === 'Pending'
    ).length;
    setPendingAdmissions(pendingAdm);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const menuItems = [
    {
      title: 'All Students',
      description: 'View all students organized by class',
      icon: Users,
      path: '/principal/students',
      color: 'bg-blue-500',
    },
    {
      title: 'Leave Applications',
      description: 'Review and approve student leave requests',
      icon: ClipboardList,
      path: '/principal/leave-applications',
      color: 'bg-orange-500',
      badge: pendingApplications > 0 ? pendingApplications : undefined,
    },
    {
      title: 'Admission Requests',
      description: 'Review and approve new student admissions',
      icon: UserPlus,
      path: '/principal/admission-requests',
      color: 'bg-green-500',
      badge: pendingAdmissions > 0 ? pendingAdmissions : undefined,
    },
    {
      title: 'Manage Staff',
      description: 'Create and manage staff accounts',
      icon: Shield,
      path: '/principal/manage-staff',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with User Info */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Principal Dashboard</h1>
                <p className="text-sm text-gray-500">Student Management System</p>
              </div>
            </div>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-indigo-600 text-white">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Principal Information</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-2 space-y-1 text-sm">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-gray-600">Role: Principal</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">
            Welcome, {user?.name}!
          </h2>
          <p className="text-gray-600">Manage your school effectively</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.path}
                className="cursor-pointer hover:shadow-lg transition-shadow relative"
                onClick={() => navigate(item.path)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    {item.badge && (
                      <Badge className="bg-red-500">
                        <Bell className="w-3 h-3 mr-1" />
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}