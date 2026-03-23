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
import { BookOpen, Users, Calendar, FileText, ClipboardList, LogOut, Bell, UserCircle } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { useState, useEffect } from 'react';

export default function ClassTeacherHomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [pendingApplications, setPendingApplications] = useState(0);

  useEffect(() => {
    // Get pending leave applications sent to class teacher for their class
    const leaveApplications = JSON.parse(localStorage.getItem('leaveApplications') || '[]');
    const pending = leaveApplications.filter(
      (app: any) => 
        app.status === 'Pending' && 
        app.sentTo === 'class_teacher' &&
        app.studentClass === user?.assignedClass
    ).length;
    setPendingApplications(pending);
  }, [user]);

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
      title: 'My Class Students',
      description: `View and manage ${user?.assignedClass} students`,
      icon: Users,
      path: '/class-teacher/students',
      color: 'bg-blue-500',
    },
    {
      title: 'Mark Attendance',
      description: 'Record daily attendance for your class',
      icon: Calendar,
      path: '/class-teacher/mark-attendance',
      color: 'bg-green-500',
    },
    {
      title: 'Update Marks',
      description: 'Enter and update student marks',
      icon: FileText,
      path: '/class-teacher/update-marks',
      color: 'bg-purple-500',
    },
    {
      title: 'Leave Applications',
      description: 'Review student leave requests',
      icon: ClipboardList,
      path: '/class-teacher/leave-applications',
      color: 'bg-orange-500',
      badge: pendingApplications > 0 ? pendingApplications : undefined,
    },
    {
      title: 'Behavior Reports',
      description: 'Add behavior comments for students',
      icon: UserCircle,
      path: '/class-teacher/behavior',
      color: 'bg-pink-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Class Teacher Dashboard</h1>
                <p className="text-sm text-gray-500">Class {user?.assignedClass}</p>
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
                  <DropdownMenuLabel>Teacher Information</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-2 space-y-1 text-sm">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-gray-600">Role: Class Teacher</p>
                    <p className="text-gray-600">Assigned Class: {user.assignedClass}</p>
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
          <p className="text-gray-600">Manage your class effectively</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
