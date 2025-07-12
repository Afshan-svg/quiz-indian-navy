import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Lock, CheckCircle, Trophy, Target, Flame, TrendingUp, Star, Award, BookOpen, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';

interface Quiz {
  id: string;
  month: string;
  year: number;
  isCurrent: boolean;
  isCompleted: boolean;
  score?: number;
  totalQuestions: number;
}

interface QuizSelectionProps {
  onQuizStart: (quizId: string) => void;
  onViewSolutions: (quizId: string) => void;
  selectedLocation: string;
  userEmail: string;
}

const QuizSelection = ({ onQuizStart, onViewSolutions, selectedLocation, userEmail }: QuizSelectionProps) => {
  const { toast } = useToast();
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  const { data: scores = [], isLoading, error } = useQuery({
    queryKey: ['scores'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('https://quiz-indian-navy.onrender.com/api/quiz/scores', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch scores');
      return response.json();
    },
  });

  if (error) {
    toast({
      title: 'Error',
      description: 'Failed to load quiz scores',
      variant: 'destructive',
    });
  }

  const quizzes: Quiz[] = [
    {
      id: 'current',
      month: currentMonth,
      year: currentYear,
      isCurrent: true,
      isCompleted: false,
      totalQuestions: 5,
    },
    ...scores.map((score: any) => ({
      id: `${score.month.toLowerCase()}${score.year}`,
      month: score.month,
      year: score.year,
      isCurrent: false,
      isCompleted: true,
      score: score.score,
      totalQuestions: 5,
    })),
  ];

  const completedQuizzes = quizzes.filter(q => q.isCompleted);
  const averageScore = completedQuizzes.length > 0
    ? Math.round(completedQuizzes.reduce((sum, q) => sum + (q.score || 0), 0) / completedQuizzes.length)
    : 0;
  const totalQuizzes = quizzes.length;
  const currentStreak = 2; // Mock for now
  const bestScore = Math.max(...completedQuizzes.map(q => q.score || 0), 0);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const achievements = [
    { name: 'First Quiz', icon: Star, unlocked: completedQuizzes.length >= 1 },
    { name: 'High Scorer', icon: Trophy, unlocked: bestScore >= 90 },
    { name: 'Consistent', icon: Target, unlocked: currentStreak >= 5 },
    { name: 'Scholar', icon: BookOpen, unlocked: completedQuizzes.length >= 5 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-navy-800 mb-2">
                Welcome back, {userEmail.split('@')[0] || 'Guest'}! 👋
              </h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <span className="capitalize">📍 {selectedLocation}</span>
                <span>•</span>
                <span className="flex items-center">
                  <Flame className="h-4 w-4 mr-1 text-orange-500" />
                  {currentStreak} day streak
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Badge variant="outline" className="text-green-700 border-green-300">
                Active Learner
              </Badge>
              <Badge variant="outline" className="text-blue-700 border-blue-300">
                Level 3
              </Badge>
            </div>
          </div>
        </div>

        {isLoading && <p>Loading scores...</p>}

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-navy-800 mb-4 flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-blue-500" />
            Your Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 mb-1">Average Score</p>
                    <p className="text-3xl font-bold text-blue-700">{averageScore}%</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                </div>
                <Progress value={averageScore} className="mt-3" />
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-1">Completed</p>
                    <p className="text-3xl font-bold text-green-700">{completedQuizzes.length}/{totalQuizzes}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <Progress value={(completedQuizzes.length / totalQuizzes) * 100} className="mt-3" />
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600 mb-1">Study Streak</p> 
                    <p className="text-3xl font-bold text-orange-700">{currentStreak}</p>
                  </div> 
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <Flame className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-xs text-orange-600 mt-2">Days in a row</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 mb-1">Best Score</p>
                    <p className="text-3xl font-bold text-purple-700">{bestScore}%</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-xs text-purple-600 mt-2">Personal record</p>
              </CardContent>
            </Card>
          </div>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-yellow-500" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg text-center transition-all ${
                      achievement.unlocked
                        ? 'bg-yellow-50 border-2 border-yellow-200 shadow-md'
                        : 'bg-gray-50 border-2 border-gray-200 opacity-60'
                    }`}
                  >
                    <achievement.icon
                      className={`h-8 w-8 mx-auto mb-2 ${
                        achievement.unlocked ? 'text-yellow-500' : 'text-gray-400'
                      }`}
                    />
                    <p className={`text-sm font-medium ${
                      achievement.unlocked ? 'text-yellow-700' : 'text-gray-500'
                    }`}>
                      {achievement.name}
                    </p>
                    {achievement.unlocked && (
                      <Badge className="mt-1 bg-yellow-100 text-yellow-800 text-xs">
                        Unlocked
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-navy-800 mb-4 flex items-center">
            <Calendar className="h-6 w-6 mr-2 text-orange-500" />
            Current Month Quiz
          </h2>
          {quizzes
            .filter(quiz => quiz.isCurrent)
            .map(quiz => (
              <Card key={quiz.id} className="shadow-lg border-l-4 border-orange-400 hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-navy-800 mb-2">
                        {quiz.month} {quiz.year} Quiz
                      </CardTitle>
                      <CardDescription className="text-base">
                        Test your knowledge with {quiz.totalQuestions} carefully crafted questions
                      </CardDescription>
                      <div className="flex items-center mt-3 space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          30 minutes
                        </span>
                        <span>•</span>
                        <span>{quiz.totalQuestions} questions</span>
                        <span>•</span>
                        <span className="text-green-600 font-medium">📈 Boost your streak!</span>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
                      Available Now
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={() => onQuizStart(quiz.id)}
                      size="lg"
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 text-lg shadow-lg"
                    >
                      🚀 Start Quiz Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-navy-800 mb-4 flex items-center">
            <Lock className="h-6 w-6 mr-2 text-gray-500" />
            Quiz History
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {quizzes
              .filter(quiz => !quiz.isCurrent)
              .map(quiz => (
                <Card key={quiz.id} className="shadow-lg border-l-4 border-gray-300 hover:shadow-xl transition-all">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-navy-800 flex items-center mb-2">
                          {quiz.month} {quiz.year} Quiz
                          {quiz.isCompleted && (
                            <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                          )}
                        </CardTitle>
                        {quiz.isCompleted && quiz.score !== undefined && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-600">Your Score</span>
                              <span className="text-lg font-bold text-gray-800">{quiz.score}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${getScoreColor(quiz.score)}`}
                                style={{ width: `${quiz.score}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                      <Badge variant="secondary" className="ml-4">
                        Completed
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => onViewSolutions(quiz.id)}
                      variant="outline"
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      📖 View Solutions
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizSelection;