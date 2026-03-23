import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { ArrowLeft, TrendingUp, DollarSign, Calendar } from 'lucide-react';

export default function RevenuePage() {
  const navigate = useNavigate();
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [regularFees, setRegularFees] = useState(0);
  const [lateFees, setLateFees] = useState(0);
  const [libraryFines, setLibraryFines] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  useEffect(() => {
    const feeRecords = JSON.parse(localStorage.getItem('feeRecords') || '[]');
    
    let total = 0;
    let regular = 0;
    let late = 0;
    let library = 0;

    feeRecords.forEach((record: any) => {
      total += record.amount;
      
      switch (record.type) {
        case 'regular':
          regular += record.amount;
          break;
        case 'late':
          late += record.amount;
          break;
        case 'library_fine':
          library += record.amount;
          break;
      }
    });

    setTotalRevenue(total);
    setRegularFees(regular);
    setLateFees(late);
    setLibraryFines(library);
    
    // Get recent 10 transactions
    setRecentTransactions(feeRecords.slice(-10).reverse());
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/home')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <h1 className="text-2xl font-semibold text-gray-900">Revenue Calculator</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">₹{totalRevenue.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader>
              <CardTitle className="text-white text-sm">Regular Fees</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">₹{regularFees.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader>
              <CardTitle className="text-white text-sm">Late Fees</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">₹{lateFees.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardHeader>
              <CardTitle className="text-white text-sm">Library Fines</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">₹{libraryFines.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest fee payments</CardDescription>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No transactions yet</p>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-semibold">{transaction.studentName}</p>
                      <p className="text-sm text-gray-600 capitalize">
                        {transaction.type.replace('_', ' ')} - {transaction.class}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">₹{transaction.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
