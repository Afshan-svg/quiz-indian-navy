import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Plus, Users, FileText, BarChart3, Settings, TrendingUp, Award, BookOpen, LogOut, CheckCircle, AlertCircle, Clock, Upload, UserPlus, PieChart as PieChartIcon, Download } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    category: ''
  });

  const [newCategory, setNewCategory] = useState({
    name: '',
    location: ''
  });

  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    role: 'user'
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Enhanced mock data
  const userScores = [
    { id: 1, email: 'rajesh.kumar@example.com', quiz: 'December 2024', score: 95, date: '2024-12-15', status: 'excellent' },
    { id: 2, email: 'priya.sharma@example.com', quiz: 'December 2024', score: 87, date: '2024-12-14', status: 'good' },
    { id: 3, email: 'arjun.patel@example.com', quiz: 'November 2024', score: 78, date: '2024-11-30', status: 'average' },
    { id: 4, email: 'sneha.reddy@example.com', quiz: 'December 2024', score: 92, date: '2024-12-13', status: 'excellent' },
    { id: 5, email: 'vikram.singh@example.com', quiz: 'November 2024', score: 65, date: '2024-11-28', status: 'needs-improvement' },
  ];

  const allUsers = [
    { id: 1, email: 'rajesh.kumar@example.com', role: 'user', status: 'active', joinDate: '2024-11-01' },
    { id: 2, email: 'priya.sharma@example.com', role: 'user', status: 'active', joinDate: '2024-11-15' },
    { id: 3, email: 'arjun.patel@example.com', role: 'user', status: 'inactive', joinDate: '2024-10-20' },
    { id: 4, email: 'sneha.reddy@example.com', role: 'user', status: 'active', joinDate: '2024-12-01' },
    { id: 5, email: 'admin@quiz.com', role: 'admin', status: 'active', joinDate: '2024-01-01' },
  ];

  // Statistics data
  const monthlyStats = [
    { month: 'Jan', users: 120, quizzes: 450, avgScore: 82 },
    { month: 'Feb', users: 145, quizzes: 520, avgScore: 85 },
    { month: 'Mar', users: 160, quizzes: 580, avgScore: 83 },
    { month: 'Apr', users: 180, quizzes: 620, avgScore: 87 },
    { month: 'May', users: 200, quizzes: 680, avgScore: 86 },
    { month: 'Jun', users: 220, quizzes: 720, avgScore: 88 },
  ];

  const categoryStats = [
    { name: 'History', value: 35, color: '#8884d8' },
    { name: 'Geography', value: 25, color: '#82ca9d' },
    { name: 'Culture', value: 20, color: '#ffc658' },
    { name: 'Freedom Struggle', value: 20, color: '#ff7300' },
  ];

  const performanceStats = [
    { range: '90-100%', count: 45, color: '#10b981' },
    { range: '80-89%', count: 32, color: '#3b82f6' },
    { range: '70-79%', count: 18, color: '#f59e0b' },
    { range: '60-69%', count: 8, color: '#ef4444' },
    { range: 'Below 60%', count: 3, color: '#dc2626' },
  ];

  const categories = [
    { id: 1, name: 'Ancient Indian History', location: 'Mumbai', questionCount: 25, difficulty: 'Advanced', color: 'bg-purple-100 text-purple-800' },
    { id: 2, name: 'Indian Geography', location: 'Goa', questionCount: 18, difficulty: 'Intermediate', color: 'bg-blue-100 text-blue-800' },
    { id: 3, name: 'Cultural Heritage', location: 'Mumbai', questionCount: 15, difficulty: 'Beginner', color: 'bg-green-100 text-green-800' },
    { id: 4, name: 'Freedom Struggle', location: 'Goa', questionCount: 22, difficulty: 'Advanced', color: 'bg-orange-100 text-orange-800' },
  ];

  const recentActivity = [
    { id: 1, action: 'New user registered', user: 'amit.gupta@example.com', time: '2 hours ago', type: 'user' },
    { id: 2, action: 'Quiz completed', user: 'Maya Singh', score: 89, time: '3 hours ago', type: 'quiz' },
    { id: 3, action: 'New question added', category: 'History', time: '5 hours ago', type: 'content' },
    { id: 4, action: 'Category updated', category: 'Geography', time: '1 day ago', type: 'content' },
  ];

  const handleCreateQuestion = () => {
    console.log('Creating question:', newQuestion);
    setNewQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      category: ''
    });
  };

  const handleCreateCategory = () => {
    console.log('Creating category:', newCategory);
    setNewCategory({ name: '', location: '' });
  };

  const handleCreateUser = () => {
    console.log('Creating user:', newUser);
    setNewUser({ email: '', password: '', role: 'user' });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      console.log('File uploaded:', file.name);
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleProcessPDF = () => {
    if (uploadedFile) {
      console.log('Processing PDF:', uploadedFile.name);
      // Mock processing
      alert('PDF processed successfully! Questions have been extracted and added.');
      setUploadedFile(null);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-sm text-gray-500">Quiz Vista Management Portal</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={onLogout}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-6 bg-white shadow-sm border border-gray-200 p-1 rounded-xl">
            <TabsTrigger value="overview" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-200">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-lg transition-all duration-200">
              <PieChartIcon className="h-4 w-4" />
              <span>Statistics</span>
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg transition-all duration-200">
              <FileText className="h-4 w-4" />
              <span>Questions</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white rounded-lg transition-all duration-200">
              <BookOpen className="h-4 w-4" />
              <span>Categories</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-200">
              <Users className="h-4 w-4" />
              <span>User Scores</span>
            </TabsTrigger>
            <TabsTrigger value="manage-users" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-600 data-[state=active]:text-white rounded-lg transition-all duration-200">
              <UserPlus className="h-4 w-4" />
              <span>Manage Users</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab - keeping existing content */}
          <TabsContent value="overview" className="space-y-8">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-800">Total Users</CardTitle>
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-900">1,234</div>
                  <div className="flex items-center text-xs text-blue-600 mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +20.1% from last month
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-800">Active Quizzes</CardTitle>
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-900">12</div>
                  <p className="text-xs text-green-600 mt-1">Across all regions</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-800">Avg Score</CardTitle>
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-900">85%</div>
                  <div className="flex items-center text-xs text-purple-600 mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5% from last month
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-orange-800">Questions</CardTitle>
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-900">280</div>
                  <p className="text-xs text-orange-600 mt-1">Total questions</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'user' ? 'bg-blue-500' : 
                        activity.type === 'quiz' ? 'bg-green-500' : 'bg-orange-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                        <p className="text-xs text-gray-500">
                          {activity.user && `by ${activity.user}`}
                          {activity.category && `in ${activity.category}`}
                          {activity.score && ` • Score: ${activity.score}%`}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* New Statistics Tab */}
          <TabsContent value="statistics" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Monthly Trends */}
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-800">Monthly Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{
                    users: { label: "Users", color: "#3b82f6" },
                    quizzes: { label: "Quizzes", color: "#10b981" },
                    avgScore: { label: "Avg Score", color: "#f59e0b" }
                  }} className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="quizzes" stroke="#10b981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-800">Category Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{
                    history: { label: "History", color: "#8884d8" },
                    geography: { label: "Geography", color: "#82ca9d" },
                    culture: { label: "Culture", color: "#ffc658" },
                    freedom: { label: "Freedom Struggle", color: "#ff7300" }
                  }} className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryStats}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Performance Distribution */}
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-800">Score Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{
                    count: { label: "Students", color: "#3b82f6" }
                  }} className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-800">Key Performance Indicators</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Top Performer</p>
                      <p className="text-lg font-semibold text-green-800">95% Average</p>
                    </div>
                    <Award className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Most Popular Quiz</p>
                      <p className="text-lg font-semibold text-blue-800">Ancient History</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Completion Rate</p>
                      <p className="text-lg font-semibold text-purple-800">87%</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Enhanced Questions Tab */}
          <TabsContent value="questions" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Manual Question Creation */}
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Create New Question
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <Label htmlFor="question" className="text-gray-700 font-medium">Question</Label>
                    <Textarea
                      id="question"
                      placeholder="Enter your question here..."
                      value={newQuestion.question}
                      onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                      className="mt-2 min-h-[100px] border-gray-300 focus:border-green-400 focus:ring-green-400"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-700 font-medium">Answer Options</Label>
                    <div className="grid gap-3 mt-2">
                      {newQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2 flex-1">
                            <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <Input
                              placeholder={`Option ${index + 1}`}
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...newQuestion.options];
                                newOptions[index] = e.target.value;
                                setNewQuestion({...newQuestion, options: newOptions});
                              }}
                              className="border-gray-300 focus:border-green-400 focus:ring-green-400"
                            />
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="correctAnswer"
                              checked={newQuestion.correctAnswer === index}
                              onChange={() => setNewQuestion({...newQuestion, correctAnswer: index})}
                              className="text-green-500 focus:ring-green-400"
                            />
                            <span className="ml-2 text-sm text-gray-600">Correct</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-gray-700 font-medium">Category</Label>
                    <Select onValueChange={(value) => setNewQuestion({...newQuestion, category: value})}>
                      <SelectTrigger className="mt-2 border-gray-300 focus:border-green-400 focus:ring-green-400">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="history">Ancient Indian History</SelectItem>
                        <SelectItem value="geography">Indian Geography</SelectItem>
                        <SelectItem value="culture">Cultural Heritage</SelectItem>
                        <SelectItem value="freedom">Freedom Struggle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleCreateQuestion} className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Question
                  </Button>
                </CardContent>
              </Card>

              {/* PDF Upload Section */}
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Questions from PDF
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <div className="space-y-2">
                      <Label htmlFor="pdf-upload" className="cursor-pointer">
                        <span className="text-lg font-medium text-gray-700">Click to upload PDF</span>
                        <Input
                          id="pdf-upload"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </Label>
                      <p className="text-sm text-gray-500">Upload a PDF file with questions and answers</p>
                    </div>
                  </div>

                  {uploadedFile && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="font-medium text-blue-800">{uploadedFile.name}</p>
                            <p className="text-sm text-blue-600">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <Button onClick={handleProcessPDF} className="bg-blue-600 hover:bg-blue-700 text-white">
                          Process PDF
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">PDF Format Guidelines:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Questions should be clearly numbered</li>
                      <li>• Multiple choice options (A, B, C, D)</li>
                      <li>• Correct answers should be marked</li>
                      <li>• Category information if available</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Categories Tab - keeping existing content */}
          <TabsContent value="categories">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Create New Category
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="categoryName" className="text-gray-700 font-medium">Category Name</Label>
                    <Input
                      id="categoryName"
                      placeholder="e.g., Ancient Indian History"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      className="mt-2 border-gray-300 focus:border-orange-400 focus:ring-orange-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-gray-700 font-medium">Associated Location</Label>
                    <Select onValueChange={(value) => setNewCategory({...newCategory, location: value})}>
                      <SelectTrigger className="mt-2 border-gray-300 focus:border-orange-400 focus:ring-orange-400">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mumbai">Mumbai</SelectItem>
                        <SelectItem value="goa">Goa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleCreateCategory} className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Category
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-800">Existing Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories.map((category) => (
                      <div key={category.id} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-800">{category.name}</h3>
                            <p className="text-sm text-gray-600 capitalize mt-1">📍 {category.location}</p>
                          </div>
                          <Badge className={`${category.color} border font-medium`}>
                            {category.difficulty}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                            {category.questionCount} questions
                          </Badge>
                          <Button variant="outline" size="sm" className="border-gray-300 hover:border-gray-400">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Scores Tab - keeping existing content */}
          <TabsContent value="users">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  User Quiz Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold text-gray-700">User</TableHead>
                      <TableHead className="font-semibold text-gray-700">Quiz</TableHead>
                      <TableHead className="font-semibold text-gray-700">Performance</TableHead>
                      <TableHead className="font-semibold text-gray-700">Date</TableHead>
                      <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userScores.map((score) => (
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
                            variant={score.score >= 80 ? "default" : "secondary"}
                            className={score.score >= 80 ? "bg-green-100 text-green-800 border-green-200" : ""}
                          >
                            {score.score >= 90 ? "Excellent" : 
                             score.score >= 80 ? "Good" : 
                             score.score >= 70 ? "Average" : "Needs Improvement"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* New Manage Users Tab */}
          <TabsContent value="manage-users" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Add New User */}
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <UserPlus className="h-5 w-5 mr-2" />
                    Add New User
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="userEmail" className="text-gray-700 font-medium">Email Address</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      placeholder="user@example.com"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      className="mt-2 border-gray-300 focus:border-pink-400 focus:ring-pink-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="userPassword" className="text-gray-700 font-medium">Password</Label>
                    <Input
                      id="userPassword"
                      type="password"
                      placeholder="Enter password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      className="mt-2 border-gray-300 focus:border-pink-400 focus:ring-pink-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="userRole" className="text-gray-700 font-medium">Role</Label>
                    <Select onValueChange={(value) => setNewUser({...newUser, role: value})}>
                      <SelectTrigger className="mt-2 border-gray-300 focus:border-pink-400 focus:ring-pink-400">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleCreateUser} className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </CardContent>
              </Card>

              {/* Export Users */}
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-800">Export & Bulk Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Export User Data (CSV)
                  </Button>
                  <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                    <Upload className="h-4 w-4 mr-2" />
                    Bulk Import Users
                  </Button>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Bulk actions will affect multiple users. Please review carefully before proceeding.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* All Users Table */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-gray-800">All Users</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold text-gray-700">Email</TableHead>
                      <TableHead className="font-semibold text-gray-700">Role</TableHead>
                      <TableHead className="font-semibold text-gray-700">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700">Join Date</TableHead>
                      <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell>
                          <div className="font-medium text-gray-800">{user.email}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.status === 'active' ? 'default' : 'secondary'}
                            className={user.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">{user.joinDate}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
