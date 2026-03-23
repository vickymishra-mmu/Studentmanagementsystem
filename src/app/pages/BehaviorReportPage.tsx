import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, UserCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Badge } from '../components/ui/badge';

export default function BehaviorReportPage() {
  const navigate = useNavigate();

  const behaviorReports = [
    {
      id: 1,
      date: '2026-03-20',
      type: 'Positive',
      subject: 'Mathematics',
      teacher: 'Dr. Smith',
      comment: 'Excellent participation in class discussions and helped fellow students.',
    },
    {
      id: 2,
      date: '2026-03-18',
      type: 'Positive',
      subject: 'Computer Science',
      teacher: 'Prof. Johnson',
      comment: 'Outstanding project presentation and collaborative teamwork.',
    },
    {
      id: 3,
      date: '2026-03-15',
      type: 'Neutral',
      subject: 'Physics',
      teacher: 'Dr. Williams',
      comment: 'Please submit assignments on time.',
    },
    {
      id: 4,
      date: '2026-03-10',
      type: 'Positive',
      subject: 'English',
      teacher: 'Ms. Brown',
      comment: 'Creative essay writing and active participation.',
    },
  ];

  const positiveCount = behaviorReports.filter((r) => r.type === 'Positive').length;
  const neutralCount = behaviorReports.filter((r) => r.type === 'Neutral').length;
  const negativeCount = behaviorReports.filter((r) => r.type === 'Negative').length;

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'Positive':
        return <ThumbsUp className="w-5 h-5 text-green-600" />;
      case 'Negative':
        return <ThumbsDown className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getReportColor = (type: string) => {
    switch (type) {
      case 'Positive':
        return 'bg-green-600';
      case 'Negative':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/home')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <UserCircle className="w-8 h-8 text-pink-600" />
              <h1 className="text-2xl font-semibold text-gray-900">Behavior Report</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Positive</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600">{positiveCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-600">Neutral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-600">{neutralCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Negative</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-red-600">{negativeCount}</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Detailed Reports</h2>
          {behaviorReports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getReportIcon(report.type)}</div>
                    <div>
                      <CardTitle className="text-lg">{report.subject}</CardTitle>
                      <CardDescription>
                        {report.teacher} • {report.date}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getReportColor(report.type)}>{report.type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{report.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
