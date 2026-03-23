import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ArrowLeft, BookPlus, CheckCircle, Printer } from 'lucide-react';
import { sendEmail, generateBookIssueReceipt } from '../../utils/emailService';
import { toast } from 'sonner';

export default function IssueBookPage() {
  const navigate = useNavigate();
  const [bookName, setBookName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [email, setEmail] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [receipt, setReceipt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const issueDate = new Date();
    const returnDate = new Date();
    returnDate.setMonth(returnDate.getMonth() + 1); // 1 month from now

    const bookIssueData = {
      id: Date.now().toString(),
      bookName,
      studentName,
      rollNo,
      email,
      issueDate: issueDate.toISOString(),
      returnDate: returnDate.toISOString(),
      returned: false,
    };

    // Save to localStorage
    const issuedBooks = JSON.parse(localStorage.getItem('issuedBooks') || '[]');
    issuedBooks.push(bookIssueData);
    localStorage.setItem('issuedBooks', JSON.stringify(issuedBooks));

    // Generate receipt
    const receiptText = generateBookIssueReceipt({
      studentName,
      rollNo,
      email,
      bookName,
      issueDate,
      returnDate,
    });

    // Send email
    sendEmail({
      to: email,
      subject: 'Book Issue Receipt - Library Management',
      body: receiptText,
    });

    setReceipt(receiptText);
    setShowReceipt(true);
    toast.success('Book issued successfully!');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setBookName('');
    setStudentName('');
    setRollNo('');
    setEmail('');
    setShowReceipt(false);
    setReceipt('');
  };

  if (showReceipt) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b print:hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/home')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-semibold text-gray-900">Book Issue Receipt</h1>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="mb-6">
            <CardHeader className="text-center bg-green-50">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-2xl text-green-600">Book Issued Successfully!</CardTitle>
              <p className="text-sm text-gray-600 mt-2">Receipt sent to {email}</p>
            </CardHeader>
            <CardContent className="pt-6">
              <pre className="bg-gray-50 p-6 rounded-lg text-sm font-mono whitespace-pre-wrap">
                {receipt}
              </pre>
              <div className="flex gap-4 mt-6 print:hidden">
                <Button onClick={handlePrint} className="flex-1">
                  <Printer className="w-4 h-4 mr-2" />
                  Print Receipt
                </Button>
                <Button onClick={handleReset} variant="outline" className="flex-1">
                  Issue Another Book
                </Button>
              </div>
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
              <BookPlus className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-semibold text-gray-900">Issue Book</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Book Issue Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="book-name">Book Name</Label>
                <Input
                  id="book-name"
                  type="text"
                  placeholder="Enter book name"
                  value={bookName}
                  onChange={(e) => setBookName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-name">Student Name</Label>
                <Input
                  id="student-name"
                  type="text"
                  placeholder="Enter student name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roll-no">Roll Number</Label>
                <Input
                  id="roll-no"
                  type="text"
                  placeholder="Enter roll number"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email ID</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> Book will be issued for 1 month from today. Late return fee is ₹2 per day.
                </p>
              </div>
              <Button type="submit" className="w-full" size="lg">
                <BookPlus className="w-5 h-5 mr-2" />
                Issue Book
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
