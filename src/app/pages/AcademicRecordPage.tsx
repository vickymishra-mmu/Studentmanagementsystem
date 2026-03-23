import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, FileText } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

export default function AcademicRecordPage() {
  const navigate = useNavigate();

  const semesters = [
    {
      semester: 'Semester 1',
      subjects: [
        { name: 'Mathematics', grade: 'A', credits: 4, gpa: 4.0 },
        { name: 'Physics', grade: 'A-', credits: 4, gpa: 3.7 },
        { name: 'Computer Science', grade: 'A', credits: 4, gpa: 4.0 },
        { name: 'English', grade: 'B+', credits: 3, gpa: 3.3 },
      ],
      gpa: 3.78,
    },
    {
      semester: 'Semester 2',
      subjects: [
        { name: 'Advanced Mathematics', grade: 'A', credits: 4, gpa: 4.0 },
        { name: 'Data Structures', grade: 'A', credits: 4, gpa: 4.0 },
        { name: 'Digital Electronics', grade: 'B+', credits: 4, gpa: 3.3 },
        { name: 'Technical Writing', grade: 'A-', credits: 3, gpa: 3.7 },
      ],
      gpa: 3.77,
    },
  ];

  const overallGPA = (
    semesters.reduce((acc, sem) => acc + sem.gpa, 0) / semesters.length
  ).toFixed(2);

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
              <h1 className="text-2xl font-semibold text-gray-900">Academic Record</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6 bg-gradient-to-r from-purple-500 to-violet-600 text-white">
          <CardHeader>
            <CardTitle className="text-white">Cumulative GPA</CardTitle>
            <CardDescription className="text-purple-100">
              Your overall academic performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold">{overallGPA}</div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {semesters.map((semester) => (
            <Card key={semester.semester}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{semester.semester}</CardTitle>
                    <CardDescription>Academic performance details</CardDescription>
                  </div>
                  <Badge className="bg-purple-600">GPA: {semester.gpa.toFixed(2)}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>GPA</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {semester.subjects.map((subject) => (
                      <TableRow key={subject.name}>
                        <TableCell className="font-medium">{subject.name}</TableCell>
                        <TableCell>{subject.grade}</TableCell>
                        <TableCell>{subject.credits}</TableCell>
                        <TableCell>{subject.gpa.toFixed(1)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
