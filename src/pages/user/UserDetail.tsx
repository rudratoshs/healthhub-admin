
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/lib/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Edit } from "lucide-react";

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId && !isNaN(userId)
  });

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full mx-auto" />
          <p className="mt-2 text-sm text-muted-foreground">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">User not found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            The user you're looking for doesn't exist or you don't have permission to view it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/users">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">User Details</h1>
        </div>
        <Button asChild>
          <Link to={`/users/${user.id}/edit`}>
            <Edit className="h-4 w-4 mr-2" /> Edit User
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
              <p className="mt-1 text-lg">{user.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p className="mt-1 text-lg">{user.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
              <p className="mt-1 text-lg">{user.phone}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">WhatsApp Phone</h3>
              <p className="mt-1 text-lg">{user.whatsapp_phone || "—"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
              <p className="mt-1 text-lg capitalize">{user.role}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p className="mt-1">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                  ${user.status === 'active' ? 'bg-green-50 text-green-700' : 
                    user.status === 'inactive' ? 'bg-red-50 text-red-700' : 
                    'bg-yellow-50 text-yellow-700'}`
                }>
                  {user.status}
                </span>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
              <p className="mt-1 text-lg">{formatDate(user.created_at)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
              <p className="mt-1 text-lg">{formatDate(user.updated_at)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetail;
