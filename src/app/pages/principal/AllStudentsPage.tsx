import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ArrowLeft, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';

export default function AllStudentsPage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    // Get all users with role 'student'
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const studentUsers = users.filter((u: any) => u.role === 'student');
    setStudents(studentUsers);
  }, []);

  // Group students by class
  const groupedStudents = students.reduce((acc, student) => {
    const classKey = `${student.class}-${student.section}`;
    if (!acc[classKey]) {
      acc[classKey] = [];
    }
    acc[classKey].push(student);
    return acc;
  }, {} as Record<string, any[]>);

  const classes = Object.keys(groupedStudents).sort();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/home')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-semibold text-gray-900">All Students</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {classes.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-gray-500">No students registered yet</p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue={classes[0]} className="w-full">
            <TabsList className="grid grid-cols-auto gap-2 w-full h-auto flex-wrap">
              {classes.map((classKey) => (
                <TabsTrigger key={classKey} value={classKey} className="flex-1 min-w-[100px]">
                  Class {classKey}
                </TabsTrigger>
              ))}
            </TabsList>

            {classes.map((classKey) => (
              <TabsContent key={classKey} value={classKey}>
                <Card>
                  <CardHeader>
                    <CardTitle>Class {classKey} Students</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Student ID</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Course</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {groupedStudents[classKey].map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>{student.studentId}</TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>{student.course}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </main>
    </div>
  );
}
