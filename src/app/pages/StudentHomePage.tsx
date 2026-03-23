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
import { BookOpen, Calendar, ClipboardList, FileText, UserCircle, LogOut, BookMarked, DollarSign, Download } from 'lucide-react';

export default function StudentHomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
      title: 'Library',
      description: 'Browse and manage library resources',
      icon: BookMarked,
      path: '/library',
      color: 'bg-blue-500',
    },
    {
      title: 'Attendance Record',
      description: 'View your attendance history',
      icon: Calendar,
      path: '/attendance',
      color: 'bg-green-500',
    },
    {
      title: 'Academic Record',
      description: 'Check your grades and academic progress',
      icon: FileText,
      path: '/academic',
      color: 'bg-purple-500',
    },
    {
      title: 'Leave Record',
      description: 'Manage your leave applications',
      icon: ClipboardList,
      path: '/leave',
      color: 'bg-orange-500',
    },
    {
      title: 'Behavior Report',
      description: 'View behavioral assessments',
      icon: UserCircle,
      path: '/behavior',
      color: 'bg-pink-500',
    },
    {
      title: 'Fee Details',
      description: 'View your fee payment history',
      icon: DollarSign,
      path: '/fee-details',
      color: 'bg-emerald-500',
    },
    {
      title: 'Report Card',
      description: 'Download your report card',
      icon: Download,
      path: '/report-card',
      color: 'bg-indigo-500',
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
              <h1 className="text-xl font-semibold text-gray-900">Student Management System</h1>
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
                  <DropdownMenuLabel>User Information</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-2 space-y-1 text-sm">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-gray-600">ID: {user.studentId}</p>
                    <p className="text-gray-600">Class: {user.class}-{user.section}</p>
                    <p className="text-gray-600">Course: {user.course}</p>
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
            Welcome back, {user?.name}!
          </h2>
          <p className="text-gray-600">Access your student portal features below</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.path}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(item.path)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
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
