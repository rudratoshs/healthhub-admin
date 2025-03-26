import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Utensils,
  Calendar,
  Copy,
  Edit,
  Eye,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { DietPlan, DietPlanStatus } from "@/types/dietPlan";
import { Link } from "react-router-dom";

interface DietPlanCardProps {
  plan: DietPlan;
  onDelete?: (id: number) => void;
  onDuplicate?: (id: number) => void;
}

const DietPlanCard: React.FC<DietPlanCardProps> = ({
  plan,
  onDelete,
  onDuplicate,
}) => {
  // Helper function to get status badge color
  const getStatusBadgeVariant = (status: DietPlanStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "inactive":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  // Calculate macronutrient percentages
  const totalGrams = plan.protein_grams + plan.carbs_grams + plan.fats_grams;
  const proteinPercentage = Math.round((plan.protein_grams / totalGrams) * 100);
  const carbsPercentage = Math.round((plan.carbs_grams / totalGrams) * 100);
  const fatsPercentage = Math.round((plan.fats_grams / totalGrams) * 100);

  return (
    <Card className="transition-all duration-300 border border-gray-100 shadow-sm hover:shadow-md rounded-xl bg-white h-full flex flex-col">
      <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-primary-900 font-poppins line-clamp-1">
              {plan.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {plan.description}
            </p>
          </div>
          <Badge
            className={`${getStatusBadgeVariant(plan.status)} animate-fade-in`}
          >
            {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4 flex-grow">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary-50 p-3 rounded-md">
              <p className="text-xs text-muted-foreground">Daily Calories</p>
              <p className="text-lg font-semibold text-primary-900">
                {plan.daily_calories} kcal
              </p>
            </div>
            <div className="bg-secondary-50 p-3 rounded-md">
              <p className="text-xs text-muted-foreground">Duration</p>
              <div className="flex items-center">
                <Calendar size={14} className="mr-1 text-primary-600" />
                <p className="text-sm font-medium">
                  {new Date(plan.end_date).getDate() -
                    new Date(plan.start_date).getDate()}{" "}
                  days
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-primary-900">
              Macronutrients
            </p>
            <div className="flex space-x-2 text-xs text-center">
              <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex-1">
                Protein {proteinPercentage}%
              </div>
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full flex-1">
                Carbs {carbsPercentage}%
              </div>
              <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full flex-1">
                Fats {fatsPercentage}%
              </div>
            </div>

            {/* Macronutrient progress bars */}
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex">
              <div
                className="bg-blue-500 h-full"
                style={{ width: `${proteinPercentage}%` }}
              ></div>
              <div
                className="bg-green-500 h-full"
                style={{ width: `${carbsPercentage}%` }}
              ></div>
              <div
                className="bg-yellow-500 h-full"
                style={{ width: `${fatsPercentage}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-3 gap-1 text-xs">
              <p>P: {plan.protein_grams}g</p>
              <p>C: {plan.carbs_grams}g</p>
              <p>F: {plan.fats_grams}g</p>
            </div>
          </div>

          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar size={14} className="mr-1" />
            <span>
              {new Date(plan.start_date).toLocaleDateString()} -{" "}
              {new Date(plan.end_date).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 bg-gray-50 pt-4">
        <Link to={`/diet-plans/${plan.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full hover-scale">
            <Eye size={14} className="mr-1" /> View
          </Button>
        </Link>
        <Link to={`/diet-plans/${plan.id}/edit`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full hover-scale">
            <Edit size={14} className="mr-1" /> Edit
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 hover-scale"
          onClick={() => onDuplicate && onDuplicate(plan.id)}
        >
          <Copy size={14} className="mr-1" /> Clone
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 hover-scale text-destructive hover:text-white transition-colors duration-200"
          onClick={() => onDelete && onDelete(plan.id)}
        >
          <Trash2 size={14} className="mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DietPlanCard;
