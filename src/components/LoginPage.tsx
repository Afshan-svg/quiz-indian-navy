import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface LoginPageProps {
  onLogin: (credentials: { email: string; password: string; token: string; role: string }) => void;
  selectedLocation: string;
}

const LoginPage = ({ onLogin, selectedLocation }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, selectedLocation }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      toast({
        title: 'Login Successful',
        description: `Welcome back, ${data.user.role === 'admin' ? 'Admin' : 'User'}! You've selected ${data.user.selectedLocation}.`,
      });

      onLogin({ email, password, token: data.token, role: data.user.role });
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      toast({
        title: 'Login Failed',
        description: err.message || 'An error occurred during login',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center bg-white rounded-full px-4 py-2 shadow-md border border-orange-200">
            <span className="text-sm text-gray-600">Selected Region:</span>
            <span className="ml-2 font-semibold text-orange-600 capitalize">{selectedLocation}</span>
          </div>
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-navy-800">Welcome Back!</CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to access your quizzes and track your progress
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 border-gray-300 focus:border-orange-400 focus:ring-orange-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 border-gray-300 focus:border-orange-400 focus:ring-orange-400"
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="text-center text-sm text-gray-600">
                <p>Demo credentials: admin@quiz.com / admin123 (Admin), user@quiz.com / user123 (User)</p>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;