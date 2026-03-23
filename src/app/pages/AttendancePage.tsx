import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Progress } from '../components/ui/progress';

export default function AttendancePage() {
  const navigate = useNavigate();

  const attendanceData = [
    { subject: 'Mathematics', present: 42, total: 50, percentage: 84 },
    { subject: 'Physics', present: 45, total: 48, percentage: 93.75 },
    { subject: 'Computer Science', present: 38, total: 45, percentage: 84.44 },
    { subject: 'English', present: 40, total: 44, percentage: 90.91 },
    { subject: 'Chemistry', present: 35, total: 46, percentage: 76.09 },
  ];

  const overallAttendance = Math.round(
    attendanceData.reduce((acc, curr) => acc + curr.percentage, 0) / attendanceData.length
  );

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
              <h1 className="text-2xl font-semibold text-gray-900">Attendance Record</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <CardHeader>
            <CardTitle className="text-white">Overall Attendance</CardTitle>
            <CardDescription className="text-green-100">
              Your overall attendance across all subjects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold mb-2">{overallAttendance}%</div>
            <Progress value={overallAttendance} className="h-2 bg-green-200" />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Subject-wise Attendance</h2>
          {attendanceData.map((subject) => (
            <Card key={subject.subject}>
              <CardHeader>
                <CardTitle className="text-lg">{subject.subject}</CardTitle>
                <CardDescription>
                  {subject.present} / {subject.total} classes attended
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-semibold">{subject.percentage.toFixed(2)}%</span>
                    <span
                      className={`text-sm font-medium ${
                        subject.percentage >= 75 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {subject.percentage >= 75 ? 'Good Standing' : 'Below Requirement'}
                    </span>
                  </div>
                  <Progress value={subject.percentage} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
