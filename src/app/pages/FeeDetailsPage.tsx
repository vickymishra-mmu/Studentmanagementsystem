import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, DollarSign, Download } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

export default function FeeDetailsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [feeRecords, setFeeRecords] = useState<any[]>([]);

  useEffect(() => {
    // Load fee records for this student
    const allRecords = JSON.parse(localStorage.getItem('feeRecords') || '[]');
    const studentRecords = allRecords.filter(
      (record: any) => record.studentId === user?.studentId
    );
    setFeeRecords(studentRecords);
  }, [user]);

  const totalPaid = feeRecords.reduce((sum, record) => sum + record.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/home')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-emerald-600" />
              <h1 className="text-2xl font-semibold text-gray-900">Fee Details</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white">
          <CardHeader>
            <CardTitle className="text-white">Total Fees Paid</CardTitle>
            <CardDescription className="text-emerald-100">
              Your overall fee payment summary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold">₹{totalPaid.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Details of all fee payments</CardDescription>
          </CardHeader>
          <CardContent>
            {feeRecords.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No fee records available</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feeRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                      <TableCell className="capitalize">{record.type.replace('_', ' ')}</TableCell>
                      <TableCell className="font-semibold">₹{record.amount}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
