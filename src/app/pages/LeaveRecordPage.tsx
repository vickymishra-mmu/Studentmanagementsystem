import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, ClipboardList, Plus } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';

export default function LeaveRecordPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [leaveApplications, setLeaveApplications] = useState<any[]>([]);
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [sentTo, setSentTo] = useState<'principal' | 'class_teacher'>('principal');

  useEffect(() => {
    // Load leave applications for this student
    const allApplications = JSON.parse(localStorage.getItem('leaveApplications') || '[]');
    const studentApplications = allApplications.filter(
      (app: any) => app.studentId === user?.studentId
    );
    setLeaveApplications(studentApplications);
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newApplication = {
      id: Date.now().toString(),
      studentId: user?.studentId,
      studentName: user?.name,
      studentClass: `${user?.class}-${user?.section}`,
      type: leaveType,
      startDate,
      endDate,
      reason,
      status: 'Pending',
      sentTo,
      appliedDate: new Date().toISOString(),
    };

    const allApplications = JSON.parse(localStorage.getItem('leaveApplications') || '[]');
    allApplications.push(newApplication);
    localStorage.setItem('leaveApplications', JSON.stringify(allApplications));
    
    setLeaveApplications([newApplication, ...leaveApplications]);
    setOpen(false);
    
    // Reset form
    setLeaveType('');
    setStartDate('');
    setEndDate('');
    setReason('');
    setSentTo('principal');
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
                <h1 className="text-2xl font-semibold text-gray-900">Leave Record</h1>
              </div>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Apply for Leave
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Apply for Leave</DialogTitle>
                  <DialogDescription>Fill in the details for your leave application</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="leave-type">Leave Type</Label>
                    <Select value={leaveType} onValueChange={setLeaveType}>
                      <SelectTrigger id="leave-type">
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sick">Sick Leave</SelectItem>
                        <SelectItem value="personal">Personal Leave</SelectItem>
                        <SelectItem value="medical">Medical Leave</SelectItem>
                        <SelectItem value="emergency">Emergency Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input 
                        id="start-date" 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date">End Date</Label>
                      <Input 
                        id="end-date" 
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Textarea 
                      id="reason" 
                      placeholder="Please provide a reason for your leave"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Send To</Label>
                    <RadioGroup value={sentTo} onValueChange={(value: any) => setSentTo(value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="principal" id="principal" />
                        <Label htmlFor="principal" className="cursor-pointer">Principal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="class_teacher" id="class_teacher" />
                        <Label htmlFor="class_teacher" className="cursor-pointer">Class Teacher</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <Button type="submit" className="w-full">
                    Submit Application
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {leaveApplications.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-gray-500">No leave applications yet</p>
              </CardContent>
            </Card>
          ) : (
            leaveApplications.map((leave) => (
              <Card key={leave.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="capitalize">{leave.type} Leave</CardTitle>
                      <CardDescription>
                        {leave.startDate} to {leave.endDate}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(leave.status)}>{leave.status}</Badge>
                      <span className="text-xs text-gray-500">
                        Sent to: {leave.sentTo === 'principal' ? 'Principal' : 'Class Teacher'}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Reason:</span> {leave.reason}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}