import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ArrowLeft, BookX, CheckCircle, Printer, Search } from 'lucide-react';
import { sendEmail, generateBookReturnReceipt } from '../../utils/emailService';
import { toast } from 'sonner';
import { Badge } from '../../components/ui/badge';

export default function ReturnBookPage() {
  const navigate = useNavigate();
  const [rollNo, setRollNo] = useState('');
  const [studentName, setStudentName] = useState('');
  const [issuedBooks, setIssuedBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receipt, setReceipt] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    const allIssuedBooks = JSON.parse(localStorage.getItem('issuedBooks') || '[]');
    const studentBooks = allIssuedBooks.filter(
      (book: any) => (book.rollNo === rollNo || book.studentName.toLowerCase().includes(studentName.toLowerCase())) && !book.returned
    );
    setIssuedBooks(studentBooks);
    setSearched(true);
  };

  const calculateLateFee = (returnDate: string) => {
    const today = new Date();
    const dueDate = new Date(returnDate);
    const diffTime = today.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return diffDays * 2; // ₹2 per day
    }
    return 0;
  };

  const handleReturn = (book: any) => {
    const lateFee = calculateLateFee(book.returnDate);
    const actualReturnDate = new Date();

    // Update book status
    const allIssuedBooks = JSON.parse(localStorage.getItem('issuedBooks') || '[]');
    const updatedBooks = allIssuedBooks.map((b: any) => 
      b.id === book.id ? { ...b, returned: true, actualReturnDate: actualReturnDate.toISOString(), lateFee } : b
    );
    localStorage.setItem('issuedBooks', JSON.stringify(updatedBooks));

    // Generate receipt
    const receiptText = generateBookReturnReceipt({
      studentName: book.studentName,
      rollNo: book.rollNo,
      email: book.email,
      bookName: book.bookName,
      issueDate: new Date(book.issueDate),
      returnDate: new Date(book.returnDate),
      actualReturnDate,
      lateFee,
    });

    // Send email
    sendEmail({
      to: book.email,
      subject: 'Book Return Receipt - Library Management',
      body: receiptText,
    });

    setReceipt(receiptText);
    setSelectedBook(book);
    setShowReceipt(true);
    toast.success('Book returned successfully!');
  };

  const handleReset = () => {
    setRollNo('');
    setStudentName('');
    setIssuedBooks([]);
    setSelectedBook(null);
    setShowReceipt(false);
    setReceipt('');
    setSearched(false);
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
              <h1 className="text-2xl font-semibold text-gray-900">Book Return Receipt</h1>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="mb-6">
            <CardHeader className="text-center bg-green-50">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-2xl text-green-600">Book Returned Successfully!</CardTitle>
              <p className="text-sm text-gray-600 mt-2">Receipt sent to {selectedBook?.email}</p>
            </CardHeader>
            <CardContent className="pt-6">
              <pre className="bg-gray-50 p-6 rounded-lg text-sm font-mono whitespace-pre-wrap">
                {receipt}
              </pre>
              <div className="flex gap-4 mt-6 print:hidden">
                <Button onClick={() => window.print()} className="flex-1">
                  <Printer className="w-4 h-4 mr-2" />
                  Print Receipt
                </Button>
                <Button onClick={handleReset} variant="outline" className="flex-1">
                  Process Another Return
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
              <BookX className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl font-semibold text-gray-900">Return Book</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Student</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roll-no">Roll Number</Label>
                <Input
                  id="roll-no"
                  type="text"
                  placeholder="Enter roll number"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
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
                />
              </div>
            </div>
            <Button onClick={handleSearch} className="w-full mt-4">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </CardContent>
        </Card>

        {searched && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Issued Books</h2>
            {issuedBooks.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-gray-500">No issued books found for this student</p>
                </CardContent>
              </Card>
            ) : (
              issuedBooks.map((book) => {
                const lateFee = calculateLateFee(book.returnDate);
                const isOverdue = lateFee > 0;

                return (
                  <Card key={book.id} className={isOverdue ? 'border-red-500' : ''}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{book.bookName}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">Student: {book.studentName}</p>
                          <p className="text-sm text-gray-600">Roll No: {book.rollNo}</p>
                        </div>
                        {isOverdue && (
                          <Badge variant="destructive">Overdue</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <p className="text-sm">Issue Date: {new Date(book.issueDate).toLocaleDateString()}</p>
                        <p className="text-sm">Due Date: {new Date(book.returnDate).toLocaleDateString()}</p>
                        {isOverdue && (
                          <p className="text-sm font-semibold text-red-600">
                            Late Fee: ₹{lateFee}
                          </p>
                        )}
                      </div>
                      <Button onClick={() => handleReturn(book)} className="w-full">
                        Process Return
                      </Button>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </main>
    </div>
  );
}
