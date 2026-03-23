import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, UserPlus, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function NewAdmissionPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  
  const [studentName, setStudentName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [parentsPhone, setParentsPhone] = useState('');
  const [email, setEmail] = useState('');
  const [admissionClass, setAdmissionClass] = useState('');
  const [section, setSection] = useState('');
  const [course, setCourse] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const admissionRequest = {
      id: Date.now().toString(),
      studentName,
      fatherName,
      motherName,
      gender,
      age: parseInt(age),
      bloodGroup,
      phoneNumber,
      parentsPhone,
      email,
      class: admissionClass,
      section,
      course,
      status: 'Pending',
      submittedDate: new Date().toISOString(),
    };

    // Save to localStorage
    const admissionRequests = JSON.parse(localStorage.getItem('admissionRequests') || '[]');
    admissionRequests.push(admissionRequest);
    localStorage.setItem('admissionRequests', JSON.stringify(admissionRequests));

    setSubmitted(true);
    toast.success('Admission request sent to Principal for approval');
  };

  const handleReset = () => {
    setStudentName('');
    setFatherName('');
    setMotherName('');
    setGender('');
    setAge('');
    setBloodGroup('');
    setPhoneNumber('');
    setParentsPhone('');
    setEmail('');
    setAdmissionClass('');
    setSection('');
    setCourse('');
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/home')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-semibold text-gray-900">New Admission</h1>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader className="text-center bg-green-50">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-2xl text-green-600">Admission Request Submitted!</CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                The admission request has been sent to the Principal for approval
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                <p className="text-sm"><strong>Student Name:</strong> {studentName}</p>
                <p className="text-sm"><strong>Class:</strong> {admissionClass}-{section}</p>
                <p className="text-sm"><strong>Email:</strong> {email}</p>
              </div>
              <Button onClick={handleReset} className="w-full mt-6">
                Submit Another Admission
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
              <UserPlus className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-semibold text-gray-900">New Admission</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Student Admission Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student-name">Student Name *</Label>
                <Input
                  id="student-name"
                  type="text"
                  placeholder="Enter student's full name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="father-name">Father's Name *</Label>
                  <Input
                    id="father-name"
                    type="text"
                    placeholder="Enter father's name"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mother-name">Mother's Name *</Label>
                  <Input
                    id="mother-name"
                    type="text"
                    placeholder="Enter mother's name"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blood-group">Blood Group *</Label>
                  <Select value={bloodGroup} onValueChange={setBloodGroup}>
                    <SelectTrigger id="blood-group">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Student Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parents-phone">Parents Phone Number *</Label>
                  <Input
                    id="parents-phone"
                    type="tel"
                    placeholder="Enter parents phone"
                    value={parentsPhone}
                    onChange={(e) => setParentsPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">Course *</Label>
                <Input
                  id="course"
                  type="text"
                  placeholder="e.g., Computer Science"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="class">Class for Admission *</Label>
                  <Input
                    id="class"
                    type="text"
                    placeholder="e.g., 10"
                    value={admissionClass}
                    onChange={(e) => setAdmissionClass(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="section">Section *</Label>
                  <Input
                    id="section"
                    type="text"
                    placeholder="e.g., A"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                <UserPlus className="w-5 h-5 mr-2" />
                Submit Admission Request
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
