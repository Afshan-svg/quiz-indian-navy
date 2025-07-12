import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Award, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

interface Score {
  id: string;
  email: string;
  quiz: string;
  score: number;
  date: string;
  status: string;
  location: string;
}

const UserScores = () => {
  const [userScores, setUserScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/quiz-scores', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch scores');
        setUserScores(data);
        setError(null);
      } catch (err: any) {
        setError('Error loading scores. Please try again later.');
        console.error('Error:', err);
        toast.error('Failed to load user scores');
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (score >= 80) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getStatusIcon = (score: number) => {
    if (score >= 90) return <Award className="h-4 w-4 text-emerald-600" />;
    if (score >= 80) return <CheckCircle className="h-4 w-4 text-blue-600" />;
    if (score >= 70) return <Clock className="h-4 w-4 text-yellow-600" />;
    return <AlertCircle className="h-4 w-4 text-red-600" />;
  };

  return (
    <>
      <Toaster position="top-right" />
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            User Quiz Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <p className="text-gray-500 text-center p-4">Loading scores...</p>
          ) : error ? (
            <p className="text-red-500 text-center p-4">{error}</p>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold text-gray-700">User</TableHead>
                  <TableHead className="font-semibold text-gray-700">Quiz</TableHead>
                  <TableHead className="font-semibold text-gray-700">Location</TableHead>
                  <TableHead className="font-semibold text-gray-700">Performance</TableHead>
                  <TableHead className="font-semibold text-gray-700">Date</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userScores.length > 0 ? (
                  userScores.map((score) => (
                    <TableRow key={score.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-800">{score.email}</div>
                          <div className="text-sm text-gray-500">Student</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-blue-200 text-blue-700">
                          {score.quiz}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-gray-200 text-gray-700">
                          {score.location}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(score.score)}
                          <Badge className={`${getScoreColor(score.score)} border font-medium`}>
                            {score.score}%
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{score.date}</TableCell>
                      <TableCell>
                        <Badge
                          variant={score.score >= 80 ? 'default' : 'secondary'}
                          className={score.score >= 80 ? 'bg-green-100 text-green-800 border-green-200' : ''}
                        >
                          {score.score >= 90
                            ? 'Excellent'
                            : score.score >= 80
                            ? 'Good'
                            : score.score >= 70
                            ? 'Average'
                            : 'Needs Improvement'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500">
                      No scores found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default UserScores;