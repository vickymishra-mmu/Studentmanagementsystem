import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { ArrowLeft, ClipboardList, Check, X } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';

export default function LeaveApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = () => {
    const allApplications = JSON.parse(localStorage.getItem('leaveApplications') || '[]');
    const principalApplications = allApplications.filter(
      (app: any) => app.sentTo === 'principal'
    );
    setApplications(principalApplications);
  };

  const handleApprove = (applicationId: string) => {
    const allApplications = JSON.parse(localStorage.getItem('leaveApplications') || '[]');
    const updatedApplications = allApplications.map((app: any) =>
      app.id === applicationId ? { ...app, status: 'Approved' } : app
    );
    localStorage.setItem('leaveApplications', JSON.stringify(updatedApplications));
    loadApplications();
    toast.success('Leave application approved');
  };

  const handleReject = (applicationId: string) => {
    const allApplications = JSON.parse(localStorage.getItem('leaveApplications') || '[]');
    const updatedApplications = allApplications.map((app: any) =>
      app.id === applicationId ? { ...app, status: 'Rejected' } : app
    );
    localStorage.setItem('leaveApplications', JSON.stringify(updatedApplications));
    loadApplications();
    toast.success('Leave application rejected');
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

  const pendingCount = applications.filter((app) => app.status === 'Pending').length;

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
                <ClipboardList className="w-8 h-8 text-orange-600" />
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Leave Applications</h1>
                  {pendingCount > 0 && (
                    <p className="text-sm text-gray-600">{pendingCount} pending applications</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {applications.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-gray-500">No leave applications</p>
              </CardContent>
            </Card>
          ) : (
            applications.map((app) => (
              <Card key={app.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>
                        {app.studentName} - Class {app.studentClass}
                      </CardTitle>
                      <CardDescription className="capitalize">
                        {app.type} Leave: {app.startDate} to {app.endDate}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(app.status)}>{app.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 mb-4">
                    <span className="font-semibold">Reason:</span> {app.reason}
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Applied: {new Date(app.appliedDate).toLocaleString()}
                  </p>
                  {app.status === 'Pending' && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(app.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(app.id)}
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
