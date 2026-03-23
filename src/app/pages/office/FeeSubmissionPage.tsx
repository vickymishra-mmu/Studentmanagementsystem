import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ArrowLeft, DollarSign, CheckCircle, Printer } from 'lucide-react';
import { sendEmail, generateFeeReceipt } from '../../utils/emailService';
import { toast } from 'sonner';

type FeeType = 'regular' | 'late' | 'library_fine';

export default function FeeSubmissionPage() {
  const navigate = useNavigate();
  const params = useParams();
  const feeType = (params.type || 'regular') as FeeType;
  
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [admissionNo, setAdmissionNo] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [email, setEmail] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [section, setSection] = useState('');
  const [feeAmount, setFeeAmount] = useState('');
  const [lateDays, setLateDays] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [receipt, setReceipt] = useState('');

  const getTitle = () => {
    switch (feeType) {
      case 'late':
        return 'Late Fee Fine';
      case 'library_fine':
        return 'Library Fine';
      default:
        return 'Fee Submission';
    }
  };

  const getDescription = () => {
    switch (feeType) {
      case 'late':
        return 'Late fee: ₹100 per day';
      case 'library_fine':
        return 'Library late return fine: ₹2 per day';
      default:
        return 'Regular fee payment';
    }
  };

  const calculateTotal = () => {
    const base = parseFloat(feeAmount) || 0;
    const days = parseInt(lateDays) || 0;
    
    if (feeType === 'late') {
      return base + (days * 100);
    }
    return base;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const totalAmount = calculateTotal();

    const feeRecord = {
      id: Date.now().toString(),
      studentId: rollNo,
      studentName,
      phone,
      admissionNo,
      rollNo,
      email,
      class: studentClass,
      section,
      amount: totalAmount,
      baseAmount: parseFloat(feeAmount),
      type: feeType,
      lateDays: feeType === 'late' ? parseInt(lateDays) : undefined,
      date: new Date().toISOString(),
    };

    // Save to localStorage
    const feeRecords = JSON.parse(localStorage.getItem('feeRecords') || '[]');
    feeRecords.push(feeRecord);
    localStorage.setItem('feeRecords', JSON.stringify(feeRecords));

    // Update revenue - automatically adds to total
    const currentRevenue = JSON.parse(localStorage.getItem('totalRevenue') || '0');
    const newRevenue = currentRevenue + totalAmount;
    localStorage.setItem('totalRevenue', JSON.stringify(newRevenue));

    // Generate receipt
    const receiptText = generateFeeReceipt({
      studentName,
      rollNo,
      admissionNo,
      email,
      phone,
      class: studentClass,
      section,
      feeAmount: parseFloat(feeAmount),
      receiptType: feeType,
      lateDays: feeType === 'late' ? parseInt(lateDays) : undefined,
    });

    // Send email
    sendEmail({
      to: email,
      subject: `Fee Payment Receipt - ${getTitle()}`,
      body: receiptText,
    });

    setReceipt(receiptText);
    setShowReceipt(true);
    toast.success('Fee payment processed successfully!');
  };

  const handleReset = () => {
    setStudentName('');
    setPhone('');
    setAdmissionNo('');
    setRollNo('');
    setEmail('');
    setStudentClass('');
    setSection('');
    setFeeAmount('');
    setLateDays('');
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
              <h1 className="text-2xl font-semibold text-gray-900">Fee Payment Receipt</h1>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="mb-6">
            <CardHeader className="text-center bg-green-50">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
              <p className="text-sm text-gray-600 mt-2">Receipt sent to {email}</p>
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
                  Process Another Payment
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
              <DollarSign className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{getTitle()}</h1>
                <p className="text-sm text-gray-600">{getDescription()}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Payment Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admission-no">Admission Number</Label>
                  <Input
                    id="admission-no"
                    type="text"
                    placeholder="Enter admission number"
                    value={admissionNo}
                    onChange={(e) => setAdmissionNo(e.target.value)}
                    required
                  />
                </div>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Input
                    id="class"
                    type="text"
                    placeholder="e.g., 10"
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="section">Section</Label>
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
              <div className="space-y-2">
                <Label htmlFor="fee-amount">
                  {feeType === 'library_fine' ? 'Fine Amount (₹)' : 'Fee Amount (₹)'}
                </Label>
                <Input
                  id="fee-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={feeAmount}
                  onChange={(e) => setFeeAmount(e.target.value)}
                  required
                />
              </div>
              {feeType === 'late' && (
                <div className="space-y-2">
                  <Label htmlFor="late-days">Number of Late Days</Label>
                  <Input
                    id="late-days"
                    type="number"
                    placeholder="Enter number of days"
                    value={lateDays}
                    onChange={(e) => setLateDays(e.target.value)}
                    required
                  />
                  {lateDays && (
                    <p className="text-sm text-gray-600">
                      Late fee: ₹{parseInt(lateDays) * 100}
                    </p>
                  )}
                </div>
              )}
              {feeType === 'late' && lateDays && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-blue-900">
                    Total Amount: ₹{calculateTotal()}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Base: ₹{feeAmount || 0} + Late Fee: ₹{parseInt(lateDays) * 100}
                  </p>
                </div>
              )}
              <Button type="submit" className="w-full" size="lg">
                <DollarSign className="w-5 h-5 mr-2" />
                Submit Payment
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}