import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ArrowLeft, Calendar, Save } from 'lucide-react';
import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';

export default function MarkAttendancePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const classStudents = users.filter(
      (u: any) => u.role === 'student' && `${u.class}-${u.section}` === user?.assignedClass
    );
    setStudents(classStudents);
    
    // Initialize all as present
    const initialAttendance: Record<string, boolean> = {};
    classStudents.forEach((s: any) => {
      initialAttendance[s.id] = true;
    });
    setAttendance(initialAttendance);
  }, [user]);

  const handleToggle = (studentId: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleSave = () => {
    const attendanceRecord = {
      date,
      class: user?.assignedClass,
      attendance,
      markedBy: user?.id,
      timestamp: new Date().toISOString(),
    };

    const allAttendance = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
    allAttendance.push(attendanceRecord);
    localStorage.setItem('attendanceRecords', JSON.stringify(allAttendance));

    toast.success('Attendance saved successfully!');
  };

  const presentCount = Object.values(attendance).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/home')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl font-semibold text-gray-900">Mark Attendance</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Class: {user?.assignedClass}</p>
                <p className="text-sm text-gray-600">Date: {new Date(date).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{presentCount}/{students.length}</p>
                <p className="text-sm text-gray-600">Present</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No students in this class</p>
            ) : (
              <div className="space-y-4">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox
                        id={student.id}
                        checked={attendance[student.id]}
                        onCheckedChange={() => handleToggle(student.id)}
                      />
                      <Label
                        htmlFor={student.id}
                        className="cursor-pointer flex-1"
                      >
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-600">ID: {student.studentId}</p>
                        </div>
                      </Label>
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        attendance[student.id] ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {attendance[student.id] ? 'Present' : 'Absent'}
                    </span>
                  </div>
                ))}
                <Button onClick={handleSave} className="w-full" size="lg">
                  <Save className="w-5 h-5 mr-2" />
                  Save Attendance
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
