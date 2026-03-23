import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ArrowLeft, FileText, Save } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';

export default function UpdateMarksPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [subject, setSubject] = useState('');
  const [totalMarks, setTotalMarks] = useState('100');
  const [obtainedMarks, setObtainedMarks] = useState('');

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const classStudents = users.filter(
      (u: any) => u.role === 'student' && `${u.class}-${u.section}` === user?.assignedClass
    );
    setStudents(classStudents);
  }, [user]);

  const calculatePercentage = () => {
    const obtained = parseFloat(obtainedMarks) || 0;
    const total = parseFloat(totalMarks) || 100;
    return ((obtained / total) * 100).toFixed(2);
  };

  const handleSave = () => {
    if (!selectedStudent || !subject || !obtainedMarks) {
      toast.error('Please fill all fields');
      return;
    }

    const marksRecord = {
      studentId: selectedStudent,
      subject,
      totalMarks: parseFloat(totalMarks),
      obtainedMarks: parseFloat(obtainedMarks),
      percentage: parseFloat(calculatePercentage()),
      class: user?.assignedClass,
      updatedBy: user?.id,
      timestamp: new Date().toISOString(),
    };

    const allMarks = JSON.parse(localStorage.getItem('marksRecords') || '[]');
    allMarks.push(marksRecord);
    localStorage.setItem('marksRecords', JSON.stringify(allMarks));

    toast.success(`Marks updated for ${students.find(s => s.id === selectedStudent)?.name}`);
    
    // Reset form
    setSelectedStudent('');
    setSubject('');
    setObtainedMarks('');
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
              <FileText className="w-8 h-8 text-purple-600" />
              <h1 className="text-2xl font-semibold text-gray-900">Update Marks</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Enter Student Marks</CardTitle>
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
                        {student.name} - {student.studentId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="e.g., Mathematics"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="total-marks">Total Marks</Label>
                  <Input
                    id="total-marks"
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="obtained-marks">Obtained Marks</Label>
                  <Input
                    id="obtained-marks"
                    type="number"
                    value={obtainedMarks}
                    onChange={(e) => setObtainedMarks(e.target.value)}
                  />
                </div>
              </div>

              {obtainedMarks && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-900">
                    <strong>Percentage:</strong> {calculatePercentage()}%
                  </p>
                  <p className="text-xs text-purple-700 mt-1">
                    {obtainedMarks} / {totalMarks} marks
                  </p>
                </div>
              )}

              <Button onClick={handleSave} className="w-full" size="lg">
                <Save className="w-5 h-5 mr-2" />
                Save Marks
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
