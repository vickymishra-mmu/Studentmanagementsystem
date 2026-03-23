import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function UpdateClassPage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [newClass, setNewClass] = useState('');
  const [newSection, setNewSection] = useState('');
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const studentUsers = users.filter((u: any) => u.role === 'student');
    setStudents(studentUsers);
  }, []);

  const handleUpdate = () => {
    if (!selectedStudent || !newClass || !newSection) {
      toast.error('Please fill all fields');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: any) =>
      u.id === selectedStudent ? { ...u, class: newClass, section: newSection } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Update current user if logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser && currentUser.id === selectedStudent) {
      const updatedCurrentUser = { ...currentUser, class: newClass, section: newSection };
      localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
    }

    setUpdated(true);
    toast.success('Student class updated successfully');
  };

  const handleReset = () => {
    setSelectedStudent('');
    setNewClass('');
    setNewSection('');
    setUpdated(false);
    
    // Refresh students list
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const studentUsers = users.filter((u: any) => u.role === 'student');
    setStudents(studentUsers);
  };

  const selectedStudentData = students.find(s => s.id === selectedStudent);

  if (updated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/home')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-semibold text-gray-900">Update Student Class</h1>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader className="text-center bg-green-50">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-2xl text-green-600">Class Updated Successfully!</CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Student class has been updated
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                <p className="text-sm"><strong>Student:</strong> {selectedStudentData?.name}</p>
                <p className="text-sm"><strong>New Class:</strong> {newClass}-{newSection}</p>
              </div>
              <Button onClick={handleReset} className="w-full mt-6">
                Update Another Student
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/home')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <RefreshCw className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-semibold text-gray-900">Update Student Class</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Update Class Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student">Select Student</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger id="student">
                    <SelectValue placeholder="Choose a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} - Current: {student.class}-{student.section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedStudentData && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Current Class:</strong> {selectedStudentData.class}-{selectedStudentData.section}
                  </p>
                  <p className="text-sm text-blue-900">
                    <strong>Student ID:</strong> {selectedStudentData.studentId}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-class">New Class</Label>
                  <Input
                    id="new-class"
                    type="text"
                    placeholder="e.g., 11"
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-section">New Section</Label>
                  <Input
                    id="new-section"
                    type="text"
                    placeholder="e.g., A"
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleUpdate} className="w-full" size="lg">
                <RefreshCw className="w-5 h-5 mr-2" />
                Update Class
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
