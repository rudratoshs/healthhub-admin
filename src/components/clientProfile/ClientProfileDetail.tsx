
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ClientProfile } from "@/types/clientProfile";
import clientProfileMapping from "@/constant/clientProfileMapping.json";

interface ClientProfileDetailProps {
  profile: ClientProfile;
}

const ClientProfileDetail: React.FC<ClientProfileDetailProps> = ({ profile }) => {
  const getDisplayValue = (key: string, value: any, mapping: any): string => {
    if (Array.isArray(value) && value.length > 0) {
      return value.map((item: string) => {
        const mappingKey = `${item}`;
        return mapping[mappingKey] || item;
      }).join(", ");
    }
    
    if (typeof value === "string") {
      const mappingKey = `${value}`;
      return mapping[mappingKey] || value;
    }
    
    return value !== null && value !== undefined ? String(value) : "Not specified";
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden shadow-lg border-primary-100">
        <CardHeader className="bg-primary-50 pb-4">
          <CardTitle className="text-xl md:text-2xl text-primary-900">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Age</h3>
              <p className="mt-1 text-base">{profile.age} years</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Gender</h3>
              <p className="mt-1 text-base">{profile.gender === "male" ? "Male" : profile.gender === "female" ? "Female" : "Other"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Height</h3>
              <p className="mt-1 text-base">{profile.height} cm</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Current Weight</h3>
              <p className="mt-1 text-base">{profile.current_weight} kg</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Target Weight</h3>
              <p className="mt-1 text-base">{profile.target_weight} kg</p>
            </div>
            
            {/* Read-only calculated fields */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">BMI</h3>
              <p className="mt-1 text-base">{profile.bmi.toFixed(1)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">BMR</h3>
              <p className="mt-1 text-base">{profile.bmr} kcal</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Daily Calories</h3>
              <p className="mt-1 text-base">{profile.daily_calories} kcal</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Weight Goal</h3>
              <p className="mt-1 text-base capitalize">{profile.weight_goal_type} {profile.weight_difference} kg</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden shadow-lg border-primary-100">
        <CardHeader className="bg-primary-50 pb-4">
          <CardTitle className="text-xl md:text-2xl text-primary-900">Location</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Country</h3>
              <p className="mt-1 text-base">{profile.country || "Not specified"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">State/Region</h3>
              <p className="mt-1 text-base">{profile.state || "Not specified"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">City</h3>
              <p className="mt-1 text-base">{profile.city || "Not specified"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden shadow-lg border-primary-100">
        <CardHeader className="bg-primary-50 pb-4">
          <CardTitle className="text-xl md:text-2xl text-primary-900">Lifestyle & Preferences</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Activity Level</h3>
              <p className="mt-1 text-base">{profile.activity_level_display}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Diet Type</h3>
              <p className="mt-1 text-base">{profile.diet_type_display}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Meal Timing</h3>
              <p className="mt-1 text-base">{profile.meal_timing_display}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Primary Goal</h3>
              <p className="mt-1 text-base">{profile.primary_goal_display}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Plan Type</h3>
              <p className="mt-1 text-base">{profile.plan_type_display}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Stress & Sleep</h3>
              <p className="mt-1 text-base">{profile.stress_sleep_display}</p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Health Conditions</h3>
              <div className="flex flex-wrap gap-2">
                {profile.health_conditions && profile.health_conditions.length > 0 ? (
                  profile.health_conditions.map((condition, index) => (
                    <Badge key={index} variant="outline" className="bg-primary-50">
                      {getDisplayValue("health_conditions", condition, clientProfileMapping)}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">None specified</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Allergies</h3>
              <div className="flex flex-wrap gap-2">
                {profile.allergies && profile.allergies.length > 0 ? (
                  profile.allergies.map((allergy, index) => (
                    <Badge key={index} variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100">
                      {getDisplayValue("allergies", allergy, clientProfileMapping)}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">None specified</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Recovery Needs</h3>
              <div className="flex flex-wrap gap-2">
                {profile.recovery_needs && profile.recovery_needs.length > 0 ? (
                  profile.recovery_needs.map((need, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                      {getDisplayValue("recovery_needs", need, clientProfileMapping)}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">None specified</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Meal Preferences</h3>
              <div className="flex flex-wrap gap-2">
                {profile.meal_preferences && profile.meal_preferences.length > 0 ? (
                  profile.meal_preferences.map((preference, index) => (
                    <Badge key={index} variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
                      {getDisplayValue("meal_preferences", preference, clientProfileMapping)}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">None specified</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientProfileDetail;
