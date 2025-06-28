
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, ChevronRight, BookOpen, Target, Brain } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizInterfaceProps {
  quizId: string;
  onQuizComplete: (score: number, answers: number[]) => void;
}

const QuizInterface = ({ quizId, onQuizComplete }: QuizInterfaceProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const questions: Question[] = [
    {
      id: '1',
      question: 'Which is the capital of India?',
      options: ['Mumbai', 'New Delhi', 'Kolkata', 'Chennai'],
      correctAnswer: 1
    },
    {
      id: '2',
      question: 'What is the national bird of India?',
      options: ['Eagle', 'Peacock', 'Sparrow', 'Pigeon'],
      correctAnswer: 1
    },
    {
      id: '3',
      question: 'Which river is considered sacred in Hinduism?',
      options: ['Yamuna', 'Godavari', 'Ganges', 'Narmada'],
      correctAnswer: 2
    },
    {
      id: '4',
      question: 'In which year did India gain independence?',
      options: ['1945', '1947', '1948', '1950'],
      correctAnswer: 1
    },
    {
      id: '5',
      question: 'Which is the largest state in India by area?',
      options: ['Maharashtra', 'Uttar Pradesh', 'Rajasthan', 'Madhya Pradesh'],
      correctAnswer: 2
    }
  ];

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleSubmitQuiz();
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleNextQuestion = () => {
    if (selectedOption !== null) {
      const newAnswers = [...selectedAnswers];
      newAnswers[currentQuestion] = selectedOption;
      setSelectedAnswers(newAnswers);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(newAnswers[currentQuestion + 1] ?? null);
      } else {
        handleSubmitQuiz(newAnswers);
      }
    }
  };

  const handleSubmitQuiz = (answers = selectedAnswers) => {
    const correctAnswers = answers.filter((answer, index) => 
      answer === questions[index]?.correctAnswer
    ).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    onQuizComplete(score, answers);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const timeColor = timeLeft < 300 ? 'text-red-600 bg-red-50 border-red-200' : 'text-orange-600 bg-orange-50 border-orange-200';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Quiz Assessment
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
            <div className="flex justify-between text-xs text-slate-500">
              <span>Started</span>
              <span>In Progress</span>
              <span>Complete</span>
            </div>
          </div>
        </div>

        {/* Enhanced Question Card */}
        <Card className="shadow-2xl border border-slate-200 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                {currentQuestion + 1}
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl text-slate-800 leading-relaxed">
                  {questions[currentQuestion]?.question}
                </CardTitle>
                <p className="text-sm text-slate-500 mt-2">Select the most appropriate answer</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <RadioGroup
              value={selectedOption?.toString()}
              onValueChange={(value) => setSelectedOption(parseInt(value))}
              className="space-y-4"
            >
              {questions[currentQuestion]?.options.map((option, index) => (
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
                  {selectedOption === index && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </RadioGroup>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-10 pt-6 border-t border-slate-200">
              <div className="flex flex-col space-y-1 mb-4 sm:mb-0">
                <p className="text-sm font-medium text-slate-600">
                  {selectedOption !== null ? 'Answer selected' : 'Please select an answer to continue'}
                </p>
                <p className="text-xs text-slate-500">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>
              
              <Button
                onClick={handleNextQuestion}
                disabled={selectedOption === null}
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuestion === questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Question Navigation Dots */}
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2 bg-white rounded-full p-3 shadow-lg border border-slate-200">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentQuestion
                    ? 'bg-indigo-500 scale-125'
                    : index < currentQuestion
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
