
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ClientProfile } from "@/types/clientProfile";
import clientProfileMapping from "@/constant/clientProfileMapping.json";
import { Activity, MapPin, Heart, User, Weight, Target, Calendar, Apple, Coffee, Clock, Brain, Award, BookOpen } from "lucide-react";

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

  const StatCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col">
      <div className="flex items-center mb-2">
        <div className="text-primary mr-2">
          {icon}
        </div>
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      </div>
      <p className="text-lg font-medium mt-auto">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6 font-poppins">
      <Card className="overflow-hidden shadow-md border-primary-100 bg-white">
        <CardHeader className="bg-gradient-to-r from-primary-50 to-primary-100 pb-4">
          <CardTitle className="text-xl md:text-2xl text-primary-900 font-playfair">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard title="Age" value={`${profile.age} years`} icon={<Calendar size={18} />} />
            <StatCard title="Gender" value={profile.gender === "male" ? "Male" : profile.gender === "female" ? "Female" : "Other"} icon={<User size={18} />} />
            <StatCard title="Height" value={`${profile.height} cm`} icon={<Activity size={18} />} />
            <StatCard title="Weight" value={`${profile.current_weight} kg`} icon={<Weight size={18} />} />
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-sm font-semibold mb-2 text-primary-800">Weight Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground mb-1">Current Weight</span>
                <span className="text-lg font-medium">{profile.current_weight} kg</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground mb-1">Target Weight</span>
                <span className="text-lg font-medium">{profile.target_weight} kg</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground mb-1">Goal</span>
                <div className="flex items-center">
                  <span className="text-lg font-medium capitalize">{profile.weight_goal_type}</span>
                  <Badge variant={profile.weight_goal_type === "gain" ? "success" : profile.weight_goal_type === "lose" ? "destructive" : "outline"} className="ml-2">
                    {profile.weight_difference} kg
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold mb-3 text-blue-800">Health Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground mb-1">BMI</span>
                <span className="text-lg font-medium">{profile.bmi.toFixed(1)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground mb-1">BMR</span>
                <span className="text-lg font-medium">{profile.bmr} kcal</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground mb-1">Daily Calories</span>
                <span className="text-lg font-medium">{profile.daily_calories} kcal</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden shadow-md border-primary-100 bg-white">
        <CardHeader className="bg-gradient-to-r from-primary-50 to-primary-100 pb-4">
          <CardTitle className="text-xl md:text-2xl text-primary-900 font-playfair">Location</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-start">
            <MapPin className="text-primary mr-3 mt-1" size={18} />
            <div className="flex-1">
              <p className="text-base">
                {[profile.city, profile.state, profile.country].filter(Boolean).join(", ") || "Location not specified"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden shadow-md border-primary-100 bg-white">
        <CardHeader className="bg-gradient-to-r from-primary-50 to-primary-100 pb-4">
          <CardTitle className="text-xl md:text-2xl text-primary-900 font-playfair">Lifestyle & Preferences</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
            <div className="flex items-start">
              <Activity className="text-primary mr-3 mt-1" size={18} />
              <div>
                <h3 className="text-sm font-medium text-primary-800">Activity Level</h3>
                <p className="mt-1">{profile.activity_level_display}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Apple className="text-primary mr-3 mt-1" size={18} />
              <div>
                <h3 className="text-sm font-medium text-primary-800">Diet Type</h3>
                <p className="mt-1">{profile.diet_type_display}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="text-primary mr-3 mt-1" size={18} />
              <div>
                <h3 className="text-sm font-medium text-primary-800">Meal Timing</h3>
                <p className="mt-1">{profile.meal_timing_display}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Target className="text-primary mr-3 mt-1" size={18} />
              <div>
                <h3 className="text-sm font-medium text-primary-800">Primary Goal</h3>
                <p className="mt-1">{profile.primary_goal_display}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <BookOpen className="text-primary mr-3 mt-1" size={18} />
              <div>
                <h3 className="text-sm font-medium text-primary-800">Plan Type</h3>
                <p className="mt-1">{profile.plan_type_display}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Brain className="text-primary mr-3 mt-1" size={18} />
              <div>
                <h3 className="text-sm font-medium text-primary-800">Stress & Sleep</h3>
                <p className="mt-1">{profile.stress_sleep_display}</p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-primary-800 mb-3 flex items-center">
                <Heart className="text-primary mr-2" size={16} />
                Health Conditions
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.health_conditions && profile.health_conditions.length > 0 ? (
                  profile.health_conditions.map((condition, index) => (
                    <Badge key={index} variant="outline" className="bg-primary-50 border-primary-200">
                      {getDisplayValue("health_conditions", condition, clientProfileMapping)}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">None specified</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-primary-800 mb-3 flex items-center">
                <Award className="text-red-500 mr-2" size={16} />
                Allergies
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.allergies && profile.allergies.length > 0 ? (
                  profile.allergies.map((allergy, index) => (
                    <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100">
                      {getDisplayValue("allergies", allergy, clientProfileMapping)}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">None specified</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-primary-800 mb-3 flex items-center">
                <Activity className="text-blue-500 mr-2" size={16} />
                Recovery Needs
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.recovery_needs && profile.recovery_needs.length > 0 ? (
                  profile.recovery_needs.map((need, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                      {getDisplayValue("recovery_needs", need, clientProfileMapping)}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">None specified</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-primary-800 mb-3 flex items-center">
                <Coffee className="text-green-500 mr-2" size={16} />
                Meal Preferences
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.meal_preferences && profile.meal_preferences.length > 0 ? (
                  profile.meal_preferences.map((preference, index) => (
                    <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
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
