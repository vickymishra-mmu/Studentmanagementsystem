import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { ArrowLeft, BookMarked, Search, AlertCircle } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';

export default function LibraryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [issuedBooks, setIssuedBooks] = useState<any[]>([]);

  useEffect(() => {
    // Load issued books for this student
    const allIssuedBooks = JSON.parse(localStorage.getItem('issuedBooks') || '[]');
    const studentBooks = allIssuedBooks.filter(
      (book: any) => book.rollNo === user?.studentId && !book.returned
    );
    setIssuedBooks(studentBooks);
  }, [user]);

  const calculateTimeLeft = (returnDate: string) => {
    const today = new Date();
    const dueDate = new Date(returnDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { days: Math.abs(diffDays), overdue: true };
    }
    return { days: diffDays, overdue: false };
  };

  const calculateFine = (returnDate: string) => {
    const timeLeft = calculateTimeLeft(returnDate);
    if (timeLeft.overdue) {
      return timeLeft.days * 2; // ₹2 per day
    }
    return 0;
  };

  const totalFine = issuedBooks.reduce((sum, book) => sum + calculateFine(book.returnDate), 0);

  const availableBooks = [
    { id: 4, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', available: true },
    { id: 5, title: 'Code Complete', author: 'Steve McConnell', available: true },
    { id: 6, title: 'Refactoring', author: 'Martin Fowler', available: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/home')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <BookMarked className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-semibold text-gray-900">Library</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {totalFine > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Outstanding Fine</AlertTitle>
            <AlertDescription>
              You have an overdue fine of ₹{totalFine}. Please return your books or pay the fine at the office.
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for books..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">My Issued Books</h2>
            {issuedBooks.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-gray-500">No books issued</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {issuedBooks.map((book) => {
                  const timeLeft = calculateTimeLeft(book.returnDate);
                  const fine = calculateFine(book.returnDate);
                  
                  return (
                    <Card key={book.id} className={timeLeft.overdue ? 'border-red-500' : ''}>
                      <CardHeader>
                        <CardTitle className="text-lg">{book.bookName}</CardTitle>
                        <CardDescription>
                          Issued: {new Date(book.issueDate).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            Due: {new Date(book.returnDate).toLocaleDateString()}
                          </p>
                          {timeLeft.overdue ? (
                            <>
                              <Badge variant="destructive">Overdue by {timeLeft.days} days</Badge>
                              <p className="text-sm font-semibold text-red-600">Fine: ₹{fine}</p>
                            </>
                          ) : (
                            <Badge className="bg-green-600">{timeLeft.days} days left</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Available Books</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableBooks.map((book) => (
                <Card key={book.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{book.title}</CardTitle>
                    <CardDescription>{book.author}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button disabled={!book.available} className="w-full">
                      {book.available ? 'Request' : 'Not Available'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}