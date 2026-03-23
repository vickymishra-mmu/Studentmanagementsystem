import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, UserPlus, Trash2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../../components/ui/badge';

export default function ManageStaffPage() {
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState<any[]>([]);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [assignedClass, setAssignedClass] = useState('');

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const staff = users.filter((u: any) => 
      ['principal', 'class_teacher', 'teacher', 'librarian', 'office_worker'].includes(u.role)
    );
    setStaffList(staff);
  };

  const handleCreateStaff = () => {
    if (!name || !email || !password || !role) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (role === 'class_teacher' && !assignedClass) {
      toast.error('Please assign a class for the class teacher');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    const existingUser = users.find((u: any) => u.email === email);
    if (existingUser) {
      toast.error('Email already exists');
      return;
    }

    const newStaff: any = {
      id: `${role}-${Date.now()}`,
      name,
      email,
      password,
      role,
    };

    if (role === 'class_teacher') {
      newStaff.assignedClass = assignedClass;
    }

    users.push(newStaff);
    localStorage.setItem('users', JSON.stringify(users));

    toast.success(`${getRoleLabel(role)} account created successfully!`);
    
    // Reset form
    setName('');
    setEmail('');
    setPassword('');
    setRole('');
    setAssignedClass('');
    
    loadStaff();
  };

  const handleDeleteStaff = (staffId: string, staffRole: string) => {
    if (staffRole === 'principal') {
      toast.error('Cannot delete the Principal account');
      return;
    }

    if (confirm('Are you sure you want to delete this staff account?')) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.filter((u: any) => u.id !== staffId);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      toast.success('Staff account deleted');
      loadStaff();
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      principal: 'Principal',
      class_teacher: 'Class Teacher',
      teacher: 'Teacher',
      librarian: 'Librarian',
      office_worker: 'Office Worker',
    };
    return labels[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      principal: 'bg-purple-600',
      class_teacher: 'bg-blue-600',
      teacher: 'bg-green-600',
      librarian: 'bg-orange-600',
      office_worker: 'bg-indigo-600',
    };
    return colors[role] || 'bg-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/home')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-purple-600" />
              <h1 className="text-2xl font-semibold text-gray-900">Manage Staff</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create New Staff */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Staff Account</CardTitle>
              <CardDescription>Add teachers, librarians, and office workers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class_teacher">Class Teacher</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="librarian">Librarian</SelectItem>
                      <SelectItem value="office_worker">Office Worker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="staff@school.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="text"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {role === 'class_teacher' && (
                  <div className="space-y-2">
                    <Label htmlFor="assigned-class">Assigned Class *</Label>
                    <Input
                      id="assigned-class"
                      type="text"
                      placeholder="e.g., 10-A"
                      value={assignedClass}
                      onChange={(e) => setAssignedClass(e.target.value)}
                    />
                  </div>
                )}

                <Button onClick={handleCreateStaff} className="w-full" size="lg">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create Staff Account
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Staff List */}
          <Card>
            <CardHeader>
              <CardTitle>All Staff Members</CardTitle>
              <CardDescription>{staffList.length} staff accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {staffList.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No staff members</p>
                ) : (
                  staffList.map((staff) => (
                    <div
                      key={staff.id}
                      className="flex justify-between items-start p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold">{staff.name}</p>
                          <Badge className={getRoleColor(staff.role)}>
                            {getRoleLabel(staff.role)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{staff.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Password: {staff.password}
                        </p>
                        {staff.assignedClass && (
                          <p className="text-sm text-blue-600 mt-1">
                            Class: {staff.assignedClass}
                          </p>
                        )}
                      </div>
                      {staff.role !== 'principal' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteStaff(staff.id, staff.role)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
