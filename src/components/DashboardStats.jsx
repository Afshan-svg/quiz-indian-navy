import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Users, FileText, Award, BookOpen, TrendingUp, CheckCircle } from 'lucide-react';

const DashboardStats = () => {
  const monthlyStats = [
    { month: 'Jan', users: 120, quizzes: 450, avgScore: 82 },
    { month: 'Feb', users: 145, quizzes: 520, avgScore: 85 },
    { month: 'Mar', users: 160, quizzes: 580, avgScore: 83 },
    { month: 'Apr', users: 180, quizzes: 620, avgScore: 87 },
    { month: 'May', users: 200, quizzes: 680, avgScore: 86 },
    { month: 'Jun', users: 220, quizzes: 720, avgScore: 88 },
  ];

  const locationStats = [
    { name: 'Mumbai', value: 35, color: '#8884d8' },
    { name: 'Goa', value: 25, color: '#82ca9d' },
    { name: 'Delhi', value: 20, color: '#ffc658' },
    { name: 'Kolkata', value: 20, color: '#ff7300' },
  ];

  const performanceStats = [
    { range: '90-100%', count: 45, color: '#10b981' },
    { range: '80-89%', count: 32, color: '#3b82f6' },
    { range: '70-79%', count: 18, color: '#f59e0b' },
    { range: '60-69%', count: 8, color: '#ef4444' },
    { range: 'Below 60%', count: 3, color: '#dc2626' },
  ];

  const recentActivity = [
    { id: 1, action: 'New user registered', user: 'amit.gupta@example.com', time: '2 hours ago', type: 'user' },
    { id: 2, action: 'Quiz completed', user: 'Maya Singh', score: 89, time: '3 hours ago', type: 'quiz' },
    { id: 3, action: 'New question added', location: 'Mumbai', time: '5 hours ago', type: 'content' },
    { id: 4, action: 'Location updated', location: 'Goa', time: '1 day ago', type: 'content' },
  ];

  return (
    <div className="space-y-8">
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

      <Card className="shadow-lg border-0 bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                <div className={`w-2 h-2 rounded-full ${activity.type === 'user' ? 'bg-blue-500' :
                    activity.type === 'quiz' ? 'bg-green-500' : 'bg-orange-500'
                  }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                  <p className="text-xs text-gray-500">
                    {activity.user && `by ${activity.user}`}
                    {activity.location && `in ${activity.location}`}
                    {activity.score && ` • Score: ${activity.score}%`}
                  </p>
                </div>
                <div className="text-xs text-gray-400">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
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

        <Card className="shadow-lg border-0 bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">Location Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              mumbai: { label: "Mumbai", color: "#8884d8" },
              goa: { label: "Goa", color: "#82ca9d" },
              delhi: { label: "Delhi", color: "#ffc658" },
              kolkata: { label: "Kolkata", color: "#ff7300" }
            }} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={locationStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {locationStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

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
                <p className="text-lg font-semibold text-blue-800">Mumbai</p>
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
    </div>
  );
};

export default DashboardStats;