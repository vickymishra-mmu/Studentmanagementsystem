import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { ArrowLeft, UserPlus, Check, X } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';

export default function AdmissionRequestsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const admissionRequests = JSON.parse(localStorage.getItem('admissionRequests') || '[]');
    setRequests(admissionRequests);
  };

  const handleApprove = (request: any) => {
    // Create a new student user account
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Generate student ID
    const studentId = `STU${Date.now().toString().slice(-6)}`;
    
    const newStudent = {
      id: Date.now().toString(),
      name: request.studentName,
      email: request.email,
      password: 'student123', // Default password
      role: 'student',
      studentId,
      course: request.course,
      class: request.class,
      section: request.section,
      fatherName: request.fatherName,
      motherName: request.motherName,
      gender: request.gender,
      age: request.age,
      bloodGroup: request.bloodGroup,
      phoneNumber: request.phoneNumber,
      parentsPhone: request.parentsPhone,
    };

    users.push(newStudent);
    localStorage.setItem('users', JSON.stringify(users));

    // Update admission request status
    const admissionRequests = JSON.parse(localStorage.getItem('admissionRequests') || '[]');
    const updatedRequests = admissionRequests.map((req: any) =>
      req.id === request.id ? { ...req, status: 'Approved', approvedDate: new Date().toISOString() } : req
    );
    localStorage.setItem('admissionRequests', JSON.stringify(updatedRequests));

    loadRequests();
    toast.success(`Admission approved! Student ID: ${studentId}`);
  };

  const handleReject = (requestId: string) => {
    const admissionRequests = JSON.parse(localStorage.getItem('admissionRequests') || '[]');
    const updatedRequests = admissionRequests.map((req: any) =>
      req.id === requestId ? { ...req, status: 'Rejected', rejectedDate: new Date().toISOString() } : req
    );
    localStorage.setItem('admissionRequests', JSON.stringify(updatedRequests));

    loadRequests();
    toast.success('Admission request rejected');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-600';
      case 'Pending':
        return 'bg-yellow-600';
      case 'Rejected':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const pendingCount = requests.filter((req) => req.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/home')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <UserPlus className="w-8 h-8 text-green-600" />
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Admission Requests</h1>
                  {pendingCount > 0 && (
                    <p className="text-sm text-gray-600">{pendingCount} pending requests</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {requests.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-gray-500">No admission requests</p>
              </CardContent>
            </Card>
          ) : (
            requests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{request.studentName}</CardTitle>
                      <CardDescription>
                        Class {request.class}-{request.section} • {request.course}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Father's Name</p>
                      <p className="font-semibold">{request.fatherName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Mother's Name</p>
                      <p className="font-semibold">{request.motherName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Gender</p>
                      <p className="font-semibold capitalize">{request.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Age</p>
                      <p className="font-semibold">{request.age} years</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Blood Group</p>
                      <p className="font-semibold">{request.bloodGroup}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold">{request.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Parents Phone</p>
                      <p className="font-semibold">{request.parentsPhone}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold">{request.email}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">
                    Submitted: {new Date(request.submittedDate).toLocaleString()}
                  </p>
                  {request.status === 'Pending' && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(request)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approve Admission
                      </Button>
                      <Button
                        onClick={() => handleReject(request.id)}
                        variant="destructive"
                        className="flex-1"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
