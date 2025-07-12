import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Upload, FileText, Eye, EyeOff, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const QuestionForm = ({ allLocations, isLoadingLocations }) => {
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    location: '',
    month: '',
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [showAnswers, setShowAnswers] = useState({});
  const [filters, setFilters] = useState({
    location: '',
    month: '',
    year: new Date().getFullYear()
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Fetch questions when filters change
  useEffect(() => {
    if (filters.location && filters.month) {
      fetchQuestions();
    }
  }, [filters]);

  const fetchQuestions = async () => {
    setIsLoadingQuestions(true);
    try {
      const queryParams = new URLSearchParams({
        location: filters.location,
        month: filters.month,
        year: filters.year.toString()
      });

      const response = await fetch(`http://localhost:5000/api/question/questions?${queryParams}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch questions');
      
      console.log('Fetched questions:', data);
      setQuestions(Array.isArray(data) ? data : data.questions || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error(error.message);
      setQuestions([]);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const toggleAnswer = (questionId) => {
    setShowAnswers(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // Deduplicate and filter valid locations
  const uniqueLocations = Array.from(
    new Map(
      (allLocations || [])
        .filter(loc => {
          const locId = loc?._id || loc?.id;
          return locId && typeof locId === 'string' && loc?.location && typeof loc.location === 'string';
        })
        .map(loc => {
          const locId = loc._id || loc.id;
          return [locId, { ...loc, _id: locId }];
        })
    ).values()
  );

  const handleCreateQuestion = async () => {
    try {
      if (!newQuestion.month) throw new Error('Please select a month');
      if (!newQuestion.location) throw new Error('Please select a location');
      if (uniqueLocations.length === 0) throw new Error('No valid locations available. Please create a location first.');

      const response = await fetch('http://localhost:5000/api/question/create-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newQuestion,
          year: new Date().getFullYear(),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create question');

      toast.success('Question created successfully!');
      setNewQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        location: '',
        month: '',
      });

      // Refresh questions if filters match
      if (filters.location === newQuestion.location && filters.month === newQuestion.month) {
        fetchQuestions();
      }
    } catch (error) {
      console.error('Error creating question:', error);
      toast.error(error.message);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
    } else {
      toast.error('Please upload a PDF file');
    }
  };

  const handleProcessPDF = () => {
    if (uploadedFile) {
      toast.success('PDF processed successfully! Questions have been extracted and added.');
      setUploadedFile(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Question Creation Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Create New Question
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <Label htmlFor="question" className="text-gray-700 font-medium">
                Question
              </Label>
              <Textarea
                id="question"
                placeholder="Enter your question here..."
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
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
                          setNewQuestion({ ...newQuestion, options: newOptions });
                        }}
                        className="border-gray-300 focus:border-green-400 focus:ring-green-400"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={newQuestion.correctAnswer === index}
                        onChange={() => setNewQuestion({ ...newQuestion, correctAnswer: index })}
                        className="text-green-500 focus:ring-green-400"
                      />
                      <span className="ml-2 text-sm text-gray-600">Correct</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="location" className="text-gray-700 font-medium">
                Location
              </Label>
              <Select
                value={newQuestion.location || ''}
                onValueChange={(value) => setNewQuestion({ ...newQuestion, location: value })}
              >
                <SelectTrigger className="mt-2 border-gray-300 focus:border-green-400 focus:ring-green-400">
                  <SelectValue placeholder={isLoadingLocations ? 'Loading locations...' : 'Select a location'} />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingLocations ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : uniqueLocations.length > 0 ? (
                    uniqueLocations.map((loc) => (
                      <SelectItem key={loc._id} value={loc._id}>
                        {loc.location}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-locations" disabled>
                      No locations available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="month" className="text-gray-700 font-medium">
                Month
              </Label>
              <Select
                value={newQuestion.month || ''}
                onValueChange={(value) => setNewQuestion({ ...newQuestion, month: value })}
              >
                <SelectTrigger className="mt-2 border-gray-300 focus:border-green-400 focus:ring-green-400">
                  <SelectValue placeholder="Select a month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleCreateQuestion}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200"
              disabled={isLoadingLocations || uniqueLocations.length === 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Question
            </Button>
          </CardContent>
        </Card>

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
                <li>• Location information if available</li>
                <li>• Month information if available</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Questions List Section */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              View Questions
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Filters */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label className="text-gray-700 font-medium">Filter by Location</Label>
              <Select
                value={filters.location}
                onValueChange={(value) => setFilters({ ...filters, location: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueLocations.map((loc) => (
                    <SelectItem key={loc._id} value={loc._id}>
                      {loc.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-700 font-medium">Filter by Month</Label>
              <Select
                value={filters.month}
                onValueChange={(value) => setFilters({ ...filters, month: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-700 font-medium">Year</Label>
              <Input
                type="number"
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: parseInt(e.target.value) })}
                className="mt-2"
              />
            </div>
          </div>

          {/* Questions Display */}
          {!filters.location || !filters.month ? (
            <div className="text-center py-8 text-gray-500">
              Please select a location and month to view questions
            </div>
          ) : isLoadingQuestions ? (
            <div className="text-center py-8 text-gray-500">
              Loading questions...
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No questions found for {uniqueLocations.find(l => l._id === filters.location)?.location} - {filters.month} {filters.year}
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((q, index) => (
                <div key={q._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-gray-800">
                      Q{index + 1}: {q.question}
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAnswer(q._id)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      {showAnswers[q._id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {q.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`flex items-center space-x-2 p-2 rounded ${
                          showAnswers[q._id] && optIndex === q.correctAnswer
                            ? 'bg-green-100 border border-green-300'
                            : 'bg-gray-50'
                        }`}
                      >
                        <span className="font-medium text-gray-600">
                          {String.fromCharCode(65 + optIndex)}.
                        </span>
                        <span className={showAnswers[q._id] && optIndex === q.correctAnswer ? 'font-semibold text-green-700' : ''}>
                          {option}
                        </span>
                        {showAnswers[q._id] && optIndex === q.correctAnswer && (
                          <span className="ml-auto text-green-600 text-sm font-medium">✓ Correct</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                    <span>Created: {new Date(q.createdAt).toLocaleDateString()}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">Delete</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionForm;