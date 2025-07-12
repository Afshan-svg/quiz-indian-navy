import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, ChevronRight, BookOpen, Target, Brain } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';

interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  location: { _id: string; location: string };
  month: string;
  year: number;
}

interface QuizInterfaceProps {
  quizId: string;
  onQuizComplete: (score: number, answers: number[], totalQuestions: number) => void;
}

const QuizInterface = ({ quizId, onQuizComplete }: QuizInterfaceProps) => {
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get selected location from localStorage
  const selectedLocation = localStorage.getItem('selectedLocation') || 'Goa';
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  // Fetch locations to get Goa's _id
  const { data: locations = [], isLoading: isLocationsLoading, error: locationsError } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('https://quiz-indian-navy.onrender.com/api/locations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch locations');
      return response.json();
    },
  });

  // Find location ID
  const locationObj = locations.find((loc: { id: string; location: string }) => 
    loc.location.toLowerCase() === selectedLocation.toLowerCase()
  );
  const locationId = locationObj?.id;

  // Fetch questions
  const { data: questions = [], isLoading: isQuestionsLoading, error: questionsError } = useQuery({
    queryKey: ['questions', locationId, currentMonth, currentYear],
    queryFn: async () => {
      if (!locationId) return [];
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://quiz-indian-navy.onrender.com/api/questions?location=${locationId}&month=${currentMonth}&year=${currentYear}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch questions');
      return response.json();
    },
    enabled: !!locationId,
  });

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitting) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitting && questions.length > 0) {
      // Auto-submit when time runs out
      handleSubmitQuiz();
    }
  }, [timeLeft, isSubmitting, questions.length]);

  useEffect(() => {
    if (locationsError) {
      toast({
        title: 'Error',
        description: 'Failed to load locations',
        variant: 'destructive',
      });
    }
    if (questionsError) {
      toast({
        title: 'Error',
        description: 'Failed to load quiz questions',
        variant: 'destructive',
      });
    }
  }, [locationsError, questionsError, toast]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const saveScore = async (score: number) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://quiz-indian-navy.onrender.com/api/quiz/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          score,
          month: currentMonth,
          year: currentYear,
          location: locationId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Save score error:', data);
        throw new Error(data.error || 'Failed to save score');
      }

      console.log('Score saved successfully:', data);
      toast({
        title: 'Score Saved',
        description: `Your score of ${score}% has been saved.`,
      });
    } catch (error) {
      console.error('Error saving score:', error);
      toast({
        title: 'Error',
        description: 'Failed to save score',
        variant: 'destructive',
      });
      throw error; // Re-throw to handle in handleSubmitQuiz
    }
  };

  const handleNextQuestion = () => {
    if (selectedOption !== null) {
      // Save the current answer
      const newAnswers = [...selectedAnswers];
      newAnswers[currentQuestion] = selectedOption;
      setSelectedAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        // Move to next question
        setCurrentQuestion(currentQuestion + 1);
        // Load previously selected answer for next question if exists
        setSelectedOption(newAnswers[currentQuestion + 1] ?? null);
      } else {
        // Last question - submit quiz
        handleSubmitQuiz(newAnswers);
      }
    }
  };

  const handleSubmitQuiz = async (finalAnswers?: number[]) => {
    if (isSubmitting || questions.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      // Use provided answers or build final answers array
      let answersToSubmit = finalAnswers || [...selectedAnswers];
      
      // If we don't have finalAnswers and current question has a selected option, include it
      if (!finalAnswers && selectedOption !== null && answersToSubmit[currentQuestion] === undefined) {
        answersToSubmit[currentQuestion] = selectedOption;
      }

      console.log('Submitting answers:', answersToSubmit);
      console.log('Questions:', questions.map(q => ({ question: q.question, correctAnswer: q.correctAnswer })));

      // Calculate score
      let correctCount = 0;
      answersToSubmit.forEach((answer, index) => {
        if (answer !== undefined && questions[index] && answer === questions[index].correctAnswer) {
          correctCount++;
        }
      });

      const score = Math.round((correctCount / questions.length) * 100);
      
      console.log(`Correct answers: ${correctCount}/${questions.length}, Score: ${score}%`);

      // Save score to backend
      await saveScore(score);
      
      // Navigate to results
      onQuizComplete(score, answersToSubmit, questions.length);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setIsSubmitting(false);
      toast({
        title: 'Error',
        description: 'Failed to submit quiz. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;
  const timeColor = timeLeft < 300 ? 'text-red-600 bg-red-50 border-red-200' : 'text-orange-600 bg-orange-50 border-orange-200';

  if (isLocationsLoading || isQuestionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Card className="p-8">
          <CardContent>
            <p className="text-lg text-gray-600">
              No questions available for {selectedLocation} in {currentMonth} {currentYear}.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {selectedLocation} Quiz - {currentMonth} {currentYear}
                </h1>
                <div className="flex items-center space-x-3 mt-1">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Question {currentQuestion + 1} of {questions.length}
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Target className="h-3 w-3 mr-1" />
                    Multiple Choice
                  </Badge>
                </div>
              </div>
            </div>
            <div className={`flex items-center px-6 py-3 rounded-xl border-2 ${timeColor} font-mono text-xl font-bold shadow-lg`}>
              <Clock className="h-6 w-6 mr-3" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Progress</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-3 bg-slate-100" />
          </div>
        </div>

        {/* Question Card */}
        <Card className="shadow-2xl border border-slate-200 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                {currentQuestion + 1}
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl text-slate-800 leading-relaxed">
                  {currentQ?.question}
                </CardTitle>
                <p className="text-sm text-slate-500 mt-2">Select the most appropriate answer</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <RadioGroup
              value={selectedOption?.toString() || ''}
              onValueChange={(value) => setSelectedOption(parseInt(value))}
              className="space-y-4"
            >
              {currentQ?.options.map((option, index) => (
                <div
                  key={index}
                  className={`group relative flex items-center space-x-4 p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
                    selectedOption === index
                      ? 'border-indigo-300 bg-gradient-to-r from-indigo-50 to-blue-50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                    className="w-5 h-5 border-2"
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer text-base font-medium text-slate-700 leading-relaxed group-hover:text-slate-900"
                  >
                    <span className="inline-flex items-center">
                      <span className="w-8 h-8 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center text-sm font-semibold mr-3 group-hover:bg-slate-200">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-10 pt-6 border-t border-slate-200">
              <div className="flex flex-col space-y-1 mb-4 sm:mb-0">
                <p className="text-sm font-medium text-slate-600">
                  {selectedOption !== null ? 'Answer selected' : 'Please select an answer to continue'}
                </p>
                <p className="text-xs text-slate-500">
                  Answered: {selectedAnswers.filter(a => a !== undefined).length} of {questions.length}
                </p>
              </div>
              <Button
                onClick={handleNextQuestion}
                disabled={selectedOption === null || isSubmitting}
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    {currentQuestion === questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress dots */}
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2 bg-white rounded-full p-3 shadow-lg border border-slate-200">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentQuestion
                    ? 'bg-indigo-500 scale-125'
                    : selectedAnswers[index] !== undefined
                    ? 'bg-green-400'
                    : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizInterface;