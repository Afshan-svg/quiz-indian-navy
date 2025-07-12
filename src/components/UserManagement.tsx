import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { UserPlus, Download, Upload } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
}

interface UserManagementProps {
  allUsers: User[];
  setAllUsers: (users: User[]) => void;
}

const UserManagement = ({ allUsers, setAllUsers }: UserManagementProps) => {
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'user' });
  const [editUser, setEditUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleCreateUser = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create user');
      toast.success('User created successfully!');
      setNewUser({ email: '', password: '', role: 'user' });
      const usersResponse = await fetch('http://localhost:5000/api/user/get-users');
      const usersData = await usersResponse.json();
      if (usersResponse.ok) setAllUsers(usersData);
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(error.message);
    }
  };

  const handleEditUser = (user: User) => {
    setEditUser({ ...user, password: '' });
    setIsEditModalOpen(true);
  };

  const handleSaveEditUser = async () => {
    if (!editUser) return;
    try {
      const response = await fetch(`http://localhost:5000/api/user/users/${editUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: editUser.email,
          role: editUser.role,
          password: editUser.password || undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update user');
      toast.success('User updated successfully!');
      setIsEditModalOpen(false);
      setEditUser(null);
      const usersResponse = await fetch('http://localhost:5000/api/user/get-users');
      const usersData = await usersResponse.json();
      if (usersResponse.ok) setAllUsers(usersData);
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(error.message);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    try {
      const response = await fetch(`http://localhost:5000/api/user/users/${deleteUserId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete user');
      toast.success('User deleted successfully!');
      setIsDeleteConfirmOpen(false);
      setDeleteUserId(null);
      const usersResponse = await fetch('http://localhost:5000/api/user/get-users');
      const usersData = await usersResponse.json();
      if (usersResponse.ok) setAllUsers(usersData);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2" />
                Add New User
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="userEmail" className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <Input
                  id="userEmail"
                  type="email"
                  placeholder="user@example.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="mt-2 border-gray-300 focus:border-pink-400 focus:ring-pink-400"
                />
              </div>
              <div>
                <Label htmlFor="userPassword" className="text-gray-700 font-medium">
                  Password
                </Label>
                <Input
                  id="userPassword"
                  type="password"
                  placeholder="Enter password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="mt-2 border-gray-300 focus:border-pink-400 focus:ring-pink-400"
                />
              </div>
              <div>
                <Label htmlFor="userRole" className="text-gray-700 font-medium">
                  Role
                </Label>
                <Select onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger className="mt-2 border-gray-300 focus:border-pink-400 focus:ring-pink-400">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleCreateUser}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </CardContent>
          </Card>

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
                {allUsers.length > 0 ? (
                  allUsers.map((user) => (
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-300 hover:bg-red-50"
                            onClick={() => {
                              setDeleteUserId(user.id);
                              setIsDeleteConfirmOpen(true);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {editUser && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editEmail" className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  className="mt-2 border-gray-300 focus:border-pink-400 focus:ring-pink-400"
                />
              </div>
              <div>
                <Label htmlFor="editPassword" className="text-gray-700 font-medium">
                  New Password (optional)
                </Label>
                <Input
                  id="editPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={editUser.password}
                  onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                  className="mt-2 border-gray-300 focus:border-pink-400 focus:ring-pink-400"
                />
              </div>
              <div>
                <Label htmlFor="editRole" className="text-gray-700 font-medium">
                  Role
                </Label>
                <Select
                  value={editUser.role}
                  onValueChange={(value) => setEditUser({ ...editUser, role: value })}
                >
                  <SelectTrigger className="mt-2 border-gray-300 focus:border-pink-400 focus:ring-pink-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEditUser}
                className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">Are you sure you want to delete this user? This action cannot be undone.</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserManagement;