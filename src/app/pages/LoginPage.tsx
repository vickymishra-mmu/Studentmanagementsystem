import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { BookOpen, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';

type UserRole = 'student' | 'principal' | 'class_teacher' | 'teacher' | 'librarian' | 'office_worker';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>('student');
  
  // Student specific fields
  const [signupStudentId, setSignupStudentId] = useState('');
  const [signupCourse, setSignupCourse] = useState('');
  const [signupClass, setSignupClass] = useState('');
  const [signupSection, setSignupSection] = useState('');
  
  // Class teacher specific field
  const [assignedClass, setAssignedClass] = useState('');
  
  const [signupError, setSignupError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail || !loginPassword) {
      setLoginError('Please fill in all fields');
      return;
    }

    const success = await login(loginEmail, loginPassword);
    if (success) {
      navigate('/home');
    } else {
      setLoginError('Invalid email or password');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    if (!signupName || !signupEmail || !signupPassword || !signupRole) {
      setSignupError('Please fill in all fields');
      return;
    }

    // Only allow student signups - other roles must be pre-created
    if (signupRole !== 'student') {
      setSignupError('Only students can sign up. Staff accounts must be created by the principal.');
      return;
    }

    let additionalData: any = {};
    
    if (signupRole === 'student') {
      if (!signupStudentId || !signupCourse || !signupClass || !signupSection) {
        setSignupError('Please fill in all student details');
        return;
      }
      additionalData = {
        studentId: signupStudentId,
        course: signupCourse,
        class: signupClass,
        section: signupSection,
      };
    } else if (signupRole === 'class_teacher') {
      if (!assignedClass) {
        setSignupError('Please assign a class');
        return;
      }
      additionalData = { assignedClass };
    }

    const success = await signup(signupName, signupEmail, signupPassword, signupRole, additionalData);
    if (success) {
      navigate('/home');
    } else {
      setSignupError('Email already exists');
    }
  };

  const getRoleLabel = (role: UserRole) => {
    const labels: Record<UserRole, string> = {
      student: 'Student',
      principal: 'Principal',
      class_teacher: 'Class Teacher',
      teacher: 'Teacher',
      librarian: 'Librarian',
      office_worker: 'Office Worker',
    };
    return labels[role];
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="space-y-4 w-full max-w-md">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Demo Staff Credentials</AlertTitle>
          <AlertDescription className="text-xs space-y-1 mt-2">
            <p><strong>Principal:</strong> principal@school.edu / principal123</p>
            <p className="text-gray-600 mt-2">Principal can create staff accounts in "Manage Staff"</p>
          </AlertDescription>
        </Alert>

        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-indigo-600 rounded-full">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Student Management System</CardTitle>
            <CardDescription>Access your portal</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="user@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                  {loginError && <p className="text-sm text-red-600">{loginError}</p>}
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  <div className="space-y-2">
                    <Label htmlFor="signup-role">Role</Label>
                    <Select value={signupRole} onValueChange={(value) => setSignupRole(value as UserRole)}>
                      <SelectTrigger id="signup-role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="principal">Principal</SelectItem>
                        <SelectItem value="class_teacher">Class Teacher</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="librarian">Librarian</SelectItem>
                        <SelectItem value="office_worker">Office Worker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="user@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                    />
                  </div>
                  
                  {signupRole === 'student' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="signup-student-id">Student ID</Label>
                        <Input
                          id="signup-student-id"
                          type="text"
                          placeholder="STU123456"
                          value={signupStudentId}
                          onChange={(e) => setSignupStudentId(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-course">Course</Label>
                        <Input
                          id="signup-course"
                          type="text"
                          placeholder="Computer Science"
                          value={signupCourse}
                          onChange={(e) => setSignupCourse(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-class">Class</Label>
                          <Input
                            id="signup-class"
                            type="text"
                            placeholder="10"
                            value={signupClass}
                            onChange={(e) => setSignupClass(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-section">Section</Label>
                          <Input
                            id="signup-section"
                            type="text"
                            placeholder="A"
                            value={signupSection}
                            onChange={(e) => setSignupSection(e.target.value)}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  
                  {signupRole === 'class_teacher' && (
                    <div className="space-y-2">
                      <Label htmlFor="assigned-class">Assigned Class</Label>
                      <Input
                        id="assigned-class"
                        type="text"
                        placeholder="10-A"
                        value={assignedClass}
                        onChange={(e) => setAssignedClass(e.target.value)}
                      />
                    </div>
                  )}
                  
                  {signupError && <p className="text-sm text-red-600">{signupError}</p>}
                  <Button type="submit" className="w-full">
                    Sign Up
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}