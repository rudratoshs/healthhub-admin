
import React from "react";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import { useNavigate } from "react-router-dom";
import { UserCog } from "lucide-react";

interface ViewProfileButtonProps {
  user: User;
}

const ViewProfileButton: React.FC<ViewProfileButtonProps> = ({ user }) => {
  const navigate = useNavigate();
  
  // Only render for client users
  if (!user.roles?.includes("client")) {
    return null;
  }

  const handleViewProfile = () => {
    navigate(`/users/${user.id}/profile`);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="ml-2"
      onClick={handleViewProfile}
    >
      <UserCog className="mr-2 h-4 w-4" />
      View Profile
    </Button>
  );
};

export default ViewProfileButton;
