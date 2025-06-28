
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Download, Home, CheckCircle, XCircle, Trophy, Star, Target } from 'lucide-react';
import { generateCertificate, CertificateData } from '@/utils/certificateGenerator';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  userAnswers: number[];
  onDownloadCertificate: () => void;
  onReturnHome: () => void;
  userEmail: string;
}

const QuizResults = ({ 
  score, 
  totalQuestions, 
  userAnswers, 
  onDownloadCertificate, 
  onReturnHome,
  userEmail 
}: QuizResultsProps) => {
  const correctAnswers = Math.round((score / 100) * totalQuestions);
  const incorrectAnswers = totalQuestions - correctAnswers;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-500';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { text: 'Outstanding!', class: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: Trophy };
    if (score >= 80) return { text: 'Excellent!', class: 'bg-blue-100 text-blue-800 border-blue-200', icon: Star };
    if (score >= 60) return { text: 'Good Job!', class: 'bg-amber-100 text-amber-800 border-amber-200', icon: Target };
    return { text: 'Keep Learning!', class: 'bg-red-100 text-red-800 border-red-200', icon: Target };
  };

  const badge = getScoreBadge(score);
  const BadgeIcon = badge.icon;

  const handleCertificateDownload = () => {
    const certificateData: CertificateData = {
      name: userEmail.split('@')[0],
      score: score,
      date: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      location: 'India Quiz Platform',
      quizTitle: `${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} Assessment`
    };
    
    generateCertificate(certificateData);
    onDownloadCertificate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Main Results Card */}
        <Card className="shadow-2xl border border-slate-200 mb-8 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200 pb-8">
            <div className="text-center">
              <div className="mx-auto w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <Award className="h-12 w-12 text-white" />
              </div>
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Quiz Completed!
              </CardTitle>
              <Badge className={`${badge.class} text-lg px-6 py-3 border-2 rounded-full font-semibold`}>
                <BadgeIcon className="h-4 w-4 mr-2" />
                {badge.text}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <div className="text-center mb-10">
              <div className={`text-7xl font-bold mb-6 ${getScoreColor(score)} drop-shadow-sm`}>
                {score}%
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-semibold text-slate-700">
                  Your Final Score
                </p>
                <p className="text-lg text-slate-500">
                  You answered {correctAnswers} out of {totalQuestions} questions correctly
                </p>
              </div>
            </div>

            {/* Enhanced Score Breakdown */}
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-8 rounded-2xl border-2 border-emerald-200 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-800 font-bold text-lg mb-2">Correct Answers</p>
                    <p className="text-4xl font-bold text-emerald-600">{correctAnswers}</p>
                    <p className="text-sm text-emerald-600 mt-1">Great work!</p>
                  </div>
                  <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-rose-50 p-8 rounded-2xl border-2 border-red-200 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-800 font-bold text-lg mb-2">Incorrect Answers</p>
                    <p className="text-4xl font-bold text-red-600">{incorrectAnswers}</p>
                    <p className="text-sm text-red-600 mt-1">Room for improvement</p>
                  </div>
                  <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <XCircle className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleCertificateDownload}
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
              >
                <Download className="h-5 w-5 mr-3" />
                Download Certificate
              </Button>
              
              <Button
                onClick={onReturnHome}
                variant="outline"
                size="lg"
                className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-10 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
              >
                <Home className="h-5 w-5 mr-3" />
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Performance Insights */}
        <Card className="shadow-xl border border-slate-200">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <CardTitle className="text-2xl text-slate-800 flex items-center">
              <Target className="h-6 w-6 mr-3 text-indigo-500" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-blue-800">Participant</span>
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">U</span>
                  </div>
                </div>
                <p className="text-blue-600 font-medium">{userEmail}</p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-purple-800">Quiz Date</span>
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">📅</span>
                  </div>
                </div>
                <p className="text-purple-600 font-medium">{new Date().toLocaleDateString('en-IN')}</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-green-800">Status</span>
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </div>
                <p className="text-green-600 font-medium">Completed Successfully</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizResults;
