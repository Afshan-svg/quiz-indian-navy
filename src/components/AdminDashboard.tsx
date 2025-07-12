import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Settings, LogOut, BarChart3, FileText, BookOpen, Users, UserPlus, Plus, Library } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import QuestionForm from './QuestionForm';
import UserManagement from './UserManagement';
import UserScores from './UserScores';
import DashboardStats from './DashboardStats';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allLocations, setAllLocations] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [allBooks, setAllBooks] = useState<any[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState<boolean>(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false);
  const [isLoadingBooks, setIsLoadingBooks] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [newLocation, setNewLocation] = useState<{ location: string }>({ location: '' });
  const [newCategory, setNewCategory] = useState<{ category: string }>({ category: '' });
  const [newBook, setNewBook] = useState<{ title: string; file: File | null; categoryId: string }>({
    title: '',
    file: null,
    categoryId: '',
  });

  const fetchLocations = async () => {
    setIsLoadingLocations(true);
    try {
      const response = await fetch('http://localhost:5000/api/locations', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch locations');
      const locationsWithCorrectId = data.map((loc: any) => ({
        ...loc,
        _id: loc.id || loc._id,
      }));
      setAllLocations(locationsWithCorrectId);
    } catch (error: any) {
      console.error('Error fetching locations:', error);
      toast.error(error.message);
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/get-users', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch users');
      setAllUsers(data);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error(error.message);
    }
  };

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const response = await fetch('http://localhost:5000/api/categories', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch categories');
      setAllCategories(data);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      toast.error(error.message);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const fetchBooks = async () => {
    setIsLoadingBooks(true);
    try {
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch books');
      setAllBooks(data);
    } catch (error: any) {
      console.error('Error fetching books:', error);
      toast.error(error.message);
    } finally {
      setIsLoadingBooks(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'questions' || activeTab === 'locations') {
      fetchLocations();
    }
    if (activeTab === 'manage-users') {
      fetchUsers();
    }
    if (activeTab === 'library') {
      fetchCategories();
      fetchBooks();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Toaster position="top-right" />
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
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
        <Tabs defaultValue="overview" className="space-y-8" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 bg-white shadow-sm border border-gray-200 p-1 rounded-xl">
            <TabsTrigger
              value="overview"
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="questions"
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              <FileText className="h-4 w-4" />
              <span>Questions</span>
            </TabsTrigger>
            <TabsTrigger
              value="locations"
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              <BookOpen className="h-4 w-4" />
              <span>Locations</span>
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              <Users className="h-4 w-4" />
              <span>User Scores</span>
            </TabsTrigger>
            <TabsTrigger
              value="manage-users"
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              <UserPlus className="h-4 w-4" />
              <span>Manage Users</span>
            </TabsTrigger>
            <TabsTrigger
              value="library"
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              <Library className="h-4 w-4" />
              <span>Library</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DashboardStats />
          </TabsContent>
          <TabsContent value="questions">
            <QuestionForm allLocations={allLocations} isLoadingLocations={isLoadingLocations} />
          </TabsContent>
          <TabsContent value="locations">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Create New Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="locationName" className="text-gray-700 font-medium">
                      Location Name
                    </Label>
                    <Input
                      id="locationName"
                      placeholder="e.g., Mumbai"
                      value={newLocation.location}
                      onChange={(e) => setNewLocation({ ...newLocation, location: e.target.value })}
                      className="mt-2 border-gray-300 focus:border-orange-400 focus:ring-orange-400"
                    />
                  </div>
                  <Button
                    onClick={async () => {
                      if (!newLocation.location.trim()) {
                        toast.error('Please enter a location name');
                        return;
                      }
                      try {
                        const response = await fetch('http://localhost:5000/api/location/create-location', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(newLocation),
                        });
                        const data = await response.json();
                        if (!response.ok) throw new Error(data.error || 'Failed to create location');
                        toast.success('Location created successfully!');
                        setNewLocation({ location: '' });
                        await fetchLocations();
                      } catch (error: any) {
                        console.error('Error creating location:', error);
                        toast.error(error.message);
                      }
                    }}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Location
                  </Button>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-800">Existing Locations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isLoadingLocations ? (
                      <p className="text.gray-500 text-center">Loading locations...</p>
                    ) : allLocations.length > 0 ? (
                      allLocations.map((loc) => (
                        <div
                          key={loc._id}
                          className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-800">{loc.location}</h3>
                          </div>
                          <div className="flex justify-end">
                            <Button variant="outline" size="sm" className="border-gray-300 hover:border-gray-400">
                              Edit
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center">No locations found</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="users">
            <UserScores />
          </TabsContent>
          <TabsContent value="manage-users">
            <UserManagement allUsers={allUsers} setAllUsers={setAllUsers} />
          </TabsContent>
          <TabsContent value="library">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Create New Category
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="categoryName" className="text-gray-700 font-medium">
                      Category Name
                    </Label>
                    <Input
                      id="categoryName"
                      placeholder="e.g., Fiction"
                      value={newCategory.category}
                      onChange={(e) => setNewCategory({ ...newCategory, category: e.target.value })}
                      className="mt-2 border-gray-300 focus:border-cyan-400 focus:ring-cyan-400"
                    />
                  </div>
                  <Button
                    onClick={async () => {
                      if (!newCategory.category.trim()) {
                        toast.error('Please enter a category name');
                        return;
                      }
                      try {
                        const response = await fetch('http://localhost:5000/api/categories', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(newCategory),
                        });
                        const data = await response.json();
                        if (!response.ok) throw new Error(data.error || 'Failed to create category');
                        toast.success('Category created successfully!');
                        setNewCategory({ category: '' });
                        await fetchCategories();
                      } catch (error: any) {
                        console.error('Error creating category:', error);
                        toast.error(error.message);
                      }
                    }}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Category
                  </Button>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Upload New Book
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="bookTitle" className="text-gray-700 font-medium">
                      Book Title
                    </Label>
                    <Input
                      id="bookTitle"
                      placeholder="e.g., The Great Gatsby"
                      value={newBook.title}
                      onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                      className="mt-2 border-gray-300 focus:border-cyan-400 focus:ring-cyan-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bookCategory" className="text-gray-700 font-medium">
                      Category
                    </Label>
                    <select
                      id="bookCategory"
                      value={newBook.categoryId}
                      onChange={(e) => setNewBook({ ...newBook, categoryId: e.target.value })}
                      className="mt-2 w-full border-gray-300 rounded-md focus:border-cyan-400 focus:ring-cyan-400"
                    >
                      <option value="">Select a category</option>
                      {allCategories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="bookFile" className="text-gray-700 font-medium">
                      PDF File
                    </Label>
                    <Input
                      id="bookFile"
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setNewBook({ ...newBook, file });
                      }}
                      className="mt-2 border-gray-300 focus:border-cyan-400 focus:ring-cyan-400"
                    />
                  </div>
                  <Button
                    onClick={async () => {
                      if (!newBook.title.trim() || !newBook.file || !newBook.categoryId) {
                        toast.error('Please provide title, category, and PDF file');
                        return;
                      }
                      try {
                        const formData = new FormData();
                        formData.append('title', newBook.title);
                        formData.append('categoryId', newBook.categoryId);
                        formData.append('file', newBook.file);
                        const response = await fetch('http://localhost:5000/api/books', {
                          method: 'POST',
                          body: formData,
                        });
                        const data = await response.json();
                        if (!response.ok) throw new Error(data.error || 'Failed to upload book');
                        toast.success('Book uploaded successfully!');
                        setNewBook({ title: '', file: null, categoryId: '' });
                        await fetchBooks();
                      } catch (error: any) {
                        console.error('Error uploading book:', error);
                        toast.error(error.message);
                      }
                    }}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Book
                  </Button>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-0 bg-white md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-gray-800">Library</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isLoadingCategories || isLoadingBooks ? (
                      <p className="text-gray-500 text-center">Loading library...</p>
                    ) : allBooks.length > 0 ? (
                      allBooks.map((book) => (
                        <div
                          key={book._id}
                          className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-800">{book.title}</h3>
                              <p className="text-sm text-gray-500">
                                Category: {allCategories.find((cat) => cat._id === book.categoryId)?.category || 'Unknown'}
                              </p>
                            </div>
                            <a
                              href={`http://localhost:5000${book.fileUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-600 hover:text-cyan-800"
                            >
                              View PDF
                            </a>
                          </div>
                          <div className="flex justify-end">
                            <Button variant="outline" size="sm" className="border-gray-300 hover:border-gray-400">
                              Edit
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center">No books found</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;