import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import IndiaMap from "./components/IndiaMap";
import LoginPage from "./components/LoginPage";
import QuizSelection from "./components/QuizSelection";
import QuizInterface from "./components/QuizInterface";
import QuizResults from "./components/QuizResults";
import AdminDashboard from "./components/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, requiredRole }: { children: JSX.Element; requiredRole?: string }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to={role === 'admin' ? '/admin' : '/quiz'} replace />;
  }

  return children;
};

const IndiaMapWrapper = () => {
  const navigate = useNavigate();
  return <IndiaMap onLocationSelect={(location) => navigate(`/login/${location}`)} />;
};

const LoginPageWrapper = () => {
  const navigate = useNavigate();
  const locationId = window.location.pathname.split('/').pop() || '';
  const handleLogin = (credentials: { email: string; password: string; token: string; role: string }) => {
    console.log('Login credentials:', credentials);
    localStorage.setItem('token', credentials.token);
    localStorage.setItem('role', credentials.role);
    localStorage.setItem('userEmail', credentials.email);
    localStorage.setItem('selectedLocation', locationId);
    navigate(credentials.role === 'admin' ? '/admin' : '/quiz');
  };

  return <LoginPage onLogin={handleLogin} selectedLocation={locationId} />;
};

const QuizSelectionWrapper = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || 'Guest';
  const selectedLocation = localStorage.getItem('selectedLocation') || 'Unknown';
  return (
    <QuizSelection
      onQuizStart={(quizId) => navigate(`/quiz/${quizId}`)}
      onViewSolutions={(quizId) => console.log('View solutions:', quizId)}
      selectedLocation={selectedLocation}
      userEmail={userEmail}
    />
  );
};

const QuizInterfaceWrapper = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || 'Guest';
  const selectedLocation = localStorage.getItem('selectedLocation') || 'Unknown';
  const quizId = window.location.pathname.split('/').pop() || 'current';
  return (
    <QuizInterface
      quizId={quizId}
      onQuizComplete={(score, answers, totalQuestions) =>
        navigate(`/quiz/results`, { state: { score, answers, totalQuestions, quizId, userEmail, selectedLocation } })
      }
    />
  );
};

const QuizResultsWrapper = () => {
  const navigate = useNavigate();
  const { score = 0, answers = [], totalQuestions = 3, quizId = 'current', userEmail = 'Guest', selectedLocation = 'Unknown' } =
    (window.location.state as any) || {};
  return (
    <QuizResults
      score={score}
      totalQuestions={totalQuestions} // Use totalQuestions from state
      userAnswers={answers}
      quizId={quizId} // Pass quizId to QuizResults
      onDownloadCertificate={() => console.log('Certificate downloaded')}
      onReturnHome={() => navigate('/quiz')}
      userEmail={userEmail}
    />
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<IndiaMapWrapper />} />
            <Route path="/login/:location" element={<LoginPageWrapper />} />
            <Route
              path="/quiz"
              element={
                <ProtectedRoute requiredRole="user">
                  <QuizSelectionWrapper />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz/:quizId"
              element={
                <ProtectedRoute requiredRole="user">
                  <QuizInterfaceWrapper />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz/results"
              element={
                <ProtectedRoute requiredRole="user">
                  <QuizResultsWrapper />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;