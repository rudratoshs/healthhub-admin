
import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getGyms } from "@/lib/gyms";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader } from "@/components/ui/loader";
import { Plus, Edit, Trash, Users } from "lucide-react";
import DeleteGymDialog from "./DeleteGymDialog";

const GymList: React.FC = () => {
  const navigate = useNavigate();
  const [gymToDelete, setGymToDelete] = React.useState<number | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["gyms"],
    queryFn: getGyms,
  });

  const handleEditGym = (id: number) => {
    navigate(`/gyms/${id}/edit`);
  };

  const handleViewGymUsers = (id: number) => {
    navigate(`/gyms/${id}/users`);
  };

  const handleDeleteCompleted = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gym Management</h2>
        <Button onClick={() => navigate("/gyms/create")}>
          <Plus size={16} />
          <span>Add Gym</span>
        </Button>
      </div>

      {data?.data.length === 0 ? (
        <div className="flex h-96 flex-col items-center justify-center rounded-lg border bg-card p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold">No gyms found</h3>
          <p className="mb-4 text-muted-foreground">
            Get started by creating your first gym.
          </p>
          <Button onClick={() => navigate("/gyms/create")}>
            <Plus size={16} />
            <span>Add Gym</span>
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((gym) => (
                <TableRow key={gym.id}>
                  <TableCell className="font-medium">{gym.name}</TableCell>
                  <TableCell>{gym.address}</TableCell>
                  <TableCell>{gym.phone}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewGymUsers(gym.id)}
                      >
                        <Users size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditGym(gym.id)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setGymToDelete(gym.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <DeleteGymDialog
        gymId={gymToDelete}
        isOpen={gymToDelete !== null}
        onClose={() => setGymToDelete(null)}
        onDeleteComplete={handleDeleteCompleted}
      />
    </div>
  );
};

export default GymList;
