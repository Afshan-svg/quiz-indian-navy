
import React, { useState } from 'react';
import IndiaMap from '@/components/IndiaMap';
import LoginPage from '@/components/LoginPage';
import QuizSelection from '@/components/QuizSelection';
import QuizInterface from '@/components/QuizInterface';
import QuizResults from '@/components/QuizResults';
import AdminDashboard from '@/components/AdminDashboard';
import { useToast } from '@/hooks/use-toast';

type AppState = 'map' | 'login' | 'quiz-selection' | 'quiz' | 'results' | 'admin';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('map');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [currentQuizId, setCurrentQuizId] = useState<string>('');
  const [quizScore, setQuizScore] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const { toast } = useToast();

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setCurrentState('login');
  };

  const handleLogin = (credentials: { email: string; password: string }) => {
    setUserEmail(credentials.email);
    
    // Check if admin
    if (credentials.email === 'admin@quiz.com' && credentials.password === 'admin123') {
      setCurrentState('admin');
      toast({
        title: "Admin Login Successful",
        description: "Welcome to the admin dashboard!",
      });
    } else {
      setCurrentState('quiz-selection');
      toast({
        title: "Login Successful",
        description: "Welcome to the quiz platform!",
      });
    }
  };

  const handleQuizStart = (quizId: string) => {
    setCurrentQuizId(quizId);
    setCurrentState('quiz');
  };

  const handleQuizComplete = (score: number, answers: number[]) => {
    setQuizScore(score);
    setUserAnswers(answers);
    setCurrentState('results');
    
    toast({
      title: "Quiz Completed!",
      description: `You scored ${score}%`,
    });
  };

  const handleDownloadCertificate = () => {
    // Generate certificate (mock implementation)
    const certificateData = {
      name: userEmail.split('@')[0],
      score: quizScore,
      date: new Date().toLocaleDateString(),
      location: selectedLocation
    };
    
    toast({
      title: "Certificate Generated",
      description: "Your certificate has been downloaded!",
    });
    
    console.log('Certificate data:', certificateData);
  };

  const handleReturnHome = () => {
    setCurrentState('quiz-selection');
  };

  const handleViewSolutions = (quizId: string) => {
    toast({
      title: "Solutions Available",
      description: "Viewing solutions for completed quiz.",
    });
  };

  const handleLogout = () => {
    setCurrentState('map');
    setSelectedLocation('');
    setUserEmail('');
    setCurrentQuizId('');
    setQuizScore(0);
    setUserAnswers([]);
    
    toast({
      title: "Logged Out",
      description: "Thank you for using our platform!",
    });
  };

  const renderCurrentView = () => {
    switch (currentState) {
      case 'map':
        return <IndiaMap onLocationSelect={handleLocationSelect} />;
      
      case 'login':
        return (
          <LoginPage
            onLogin={handleLogin}
            selectedLocation={selectedLocation}
          />
        );
      
      case 'quiz-selection':
        return (
          <QuizSelection
            onQuizStart={handleQuizStart}
            onViewSolutions={handleViewSolutions}
            selectedLocation={selectedLocation}
            userEmail={userEmail}
          />
        );
      
      case 'quiz':
        return (
          <QuizInterface
            quizId={currentQuizId}
            onQuizComplete={handleQuizComplete}
          />
        );
      
      case 'results':
        return (
          <QuizResults
            score={quizScore}
            totalQuestions={5}
            userAnswers={userAnswers}
            onDownloadCertificate={handleDownloadCertificate}
            onReturnHome={handleReturnHome}
            userEmail={userEmail}
          />
        );
      
      case 'admin':
        return <AdminDashboard onLogout={handleLogout} />;
      
      default:
        return <IndiaMap onLocationSelect={handleLocationSelect} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentView()}
    </div>
  );
};

export default Index;
