import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ClientProfile,
  getProfileValue,
  Category,
} from "@/types/clientProfile";
import clientProfileMapping from "@/constant/clientProfileMapping.json";
import { motion } from "framer-motion";
import {
  Activity,
  MapPin,
  Heart,
  User,
  Weight,
  Target,
  Calendar,
  Apple,
  Coffee,
  Clock,
  Brain,
  Award,
  BookOpen,
  Flag,
  Droplet,
  Moon,
  Flame,
  BarChart,
  Utensils,
  Sunrise,
  Watch,
  Briefcase,
  ShoppingBag,
  DollarSign,
  Zap,
  Trophy,
  LineChart,
  Clipboard,
  Layers,
  FileText,
  Hash,
  Crown,
  Smile,
  MessageSquare,
  Sliders,
  PieChart,
} from "lucide-react";

interface ClientProfileDetailProps {
  profile: ClientProfile;
}

const CategoryIcons: Record<string, React.ReactNode> = {
  basic_information: <User size={20} />,
  region: <MapPin size={20} />,
  activity: <Activity size={20} />,
  health: <Heart size={20} />,
  diet: <Apple size={20} />,
  spice_preference: <Flame size={20} />,
  allergies: <Award size={20} className="text-red-500" />,
  restrictions: <Sliders size={20} />,
  goals: <Target size={20} />,
  recovery_needs: <Activity size={20} className="text-blue-500" />,
  favorite_and_disliked_foods: <Utensils size={20} />,
  nutrition_knowledge: <BookOpen size={20} />,
  work_type: <Briefcase size={20} />,
  cooking_capability: <Utensils size={20} />,
  cooking_time: <Clock size={20} />,
  grocery_access: <ShoppingBag size={20} />,
  budget_constraints: <DollarSign size={20} />,
  exercise: <Zap size={20} />,
  exercise_timing: <Watch size={20} />,
  sleep_hours: <Moon size={20} />,
  commitment_level: <Flag size={20} />,
  motivation: <Trophy size={20} />,
  past_attempts: <LineChart size={20} />,
  detail_level: <Clipboard size={20} />,
  recipe_complexity: <Layers size={20} />,
  meal_variety: <PieChart size={20} />,
  additional_requests: <MessageSquare size={20} />,
  organ_recovery: <Heart size={20} />,
  religious_diet: <FileText size={20} />,
  plan: <Hash size={20} />,
  timeline: <Calendar size={20} />,
  medications: <Clipboard size={20} />,
  cuisine_preferences: <Crown size={20} />,
  meal_timing: <Clock size={20} />,
  meal_preferences: <Coffee size={20} className="text-green-500" />,
  daily_schedule: <Sunrise size={20} />,
  stress_and_sleep: <Brain size={20} />,
  body_type: <User size={20} />,
  water_intake: <Droplet size={20} />,
  portion_size: <BarChart size={20} />,
  weight_goal: <Weight size={20} />,
};

const ClientProfileDetail: React.FC<ClientProfileDetailProps> = ({
  profile,
}) => {
  // Helper function to get display value for options
  const getDisplayValue = (key: string, value: any, mapping: any): string => {
    if (Array.isArray(value) && value.length > 0) {
      return value
        .map((item: string) => {
          const mappingKey = `${item}`;
          return mapping[mappingKey] || item;
        })
        .join(", ");
    }

    if (typeof value === "string") {
      const mappingKey = `${value}`;
      return mapping[mappingKey] || value;
    }

    return value !== null && value !== undefined
      ? String(value)
      : "Not specified";
  };

  // Get options for a field from any category
  const getOptionsForField = (fieldName: string): string[] | null => {
    for (const categoryKey in profile.categories) {
      const category = profile.categories[categoryKey];
      if (
        category.fields &&
        category.fields[fieldName] &&
        category.fields[fieldName].options
      ) {
        return category.fields[fieldName].options;
      }
    }
    return null;
  };

  // Helper function to get value from categorized structure
  const getValue = <T extends any>(fieldName: string): T | null => {
    return getProfileValue<T>(profile, fieldName);
  };

  // Simple stat display component
  const StatCard = ({
    title,
    value,
    icon,
  }: {
    title: string;
    value: string | number | React.ReactNode;
    icon: React.ReactNode;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col"
    >
      <div className="flex items-center mb-2">
        <div className="text-primary mr-2">{icon}</div>
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      </div>
      <p className="text-lg font-medium mt-auto">{value}</p>
    </motion.div>
  );

  // Field item component for category sections
  const FieldItem = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: string | React.ReactNode;
    icon: React.ReactNode;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start"
    >
      <div className="text-primary mr-3 mt-1">{icon}</div>
      <div>
        <h3 className="text-sm font-medium text-primary-800">{label}</h3>
        <p className="mt-1">{value}</p>
      </div>
    </motion.div>
  );

  // Tag list component for array values
  const TagList = ({
    label,
    values,
    iconComponent,
    colorClass = "bg-primary-50 border-primary-200",
    textColorClass = "",
  }: {
    label: string;
    values: string[];
    iconComponent: React.ReactNode;
    colorClass?: string;
    textColorClass?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3
        className={`text-sm font-medium text-primary-800 mb-3 flex items-center ${textColorClass}`}
      >
        {iconComponent}
        {label}
      </h3>
      <div className="flex flex-wrap gap-2">
        {values && values.length > 0 ? (
          values.map((item, index) => (
            <Badge key={index} variant="outline" className={`${colorClass}`}>
              {getDisplayValue(
                label.toLowerCase().replace(/ /g, "_"),
                item,
                clientProfileMapping
              )}
            </Badge>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">None specified</span>
        )}
      </div>
    </motion.div>
  );

  // Specific section renderer for Basic Information
  const renderBasicInformation = (category: Category) => {
    const data = category.data;

    return (
      <>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Age"
            value={data.age ? `${data.age} years` : "Not specified"}
            icon={<Calendar size={18} />}
          />
          <StatCard
            title="Gender"
            value={
              data.gender === "male"
                ? "Male"
                : data.gender === "female"
                ? "Female"
                : data.gender || "Not specified"
            }
            icon={<User size={18} />}
          />
          <StatCard
            title="Height"
            value={data.height ? `${data.height} cm` : "Not specified"}
            icon={<Activity size={18} />}
          />
          <StatCard
            title="Weight"
            value={
              data.current_weight
                ? `${data.current_weight} kg`
                : "Not specified"
            }
            icon={<Weight size={18} />}
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6 transition-all hover:shadow-md duration-300">
          <h3 className="text-sm font-semibold mb-2 text-primary-800">
            Weight Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-1">
                Current Weight
              </span>
              <span className="text-lg font-medium">
                {data.current_weight
                  ? `${data.current_weight} kg`
                  : "Not specified"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-1">
                Target Weight
              </span>
              <span className="text-lg font-medium">
                {data.target_weight
                  ? `${data.target_weight} kg`
                  : "Not specified"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-1">Goal</span>
              <div className="flex items-center">
                <span className="text-lg font-medium capitalize">
                  {data.weight_goal_type || "Not specified"}
                </span>
                {data.weight_difference && (
                  <Badge
                    variant={
                      data.weight_goal_type === "gain"
                        ? "success"
                        : data.weight_goal_type === "loss"
                        ? "destructive"
                        : "outline"
                    }
                    className="ml-2"
                  >
                    {data.weight_difference} kg
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg transition-all hover:shadow-md duration-300">
          <h3 className="text-sm font-semibold mb-3 text-blue-800">
            Health Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-1">BMI</span>
              <span className="text-lg font-medium">
                {data.bmi ? data.bmi.toFixed(1) : "Not calculated"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-1">BMR</span>
              <span className="text-lg font-medium">
                {data.bmr ? `${data.bmr} kcal` : "Not calculated"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-1">
                Daily Calories
              </span>
              <span className="text-lg font-medium">
                {data.daily_calories
                  ? `${data.daily_calories} kcal`
                  : "Not calculated"}
              </span>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Renderer for Location information
  const renderRegion = (category: Category) => {
    const data = category.data;
    const location = [data.city, data.state, data.country]
      .filter(Boolean)
      .join(", ");

    return (
      <div className="flex items-start">
        <MapPin className="text-primary mr-3 mt-1" size={18} />
        <div className="flex-1">
          <p className="text-base">{location || "Location not specified"}</p>
        </div>
      </div>
    );
  };

  // Render lifestyle preferences
  const renderLifestylePreferences = () => {
    // Extract fields from different categories for the lifestyle section
    const activityLevel = getValue<string>("activity_level_display");
    const dietType = getValue<string>("diet_type_display");
    const mealTiming = getValue<string>("meal_timing_display");
    const primaryGoal = getValue<string>("primary_goal_display");
    const planType = getValue<string>("plan_type_display");
    const stressSleep = getValue<string>("stress_sleep_display");

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
          <FieldItem
            label="Activity Level"
            value={activityLevel || "Not specified"}
            icon={<Activity className="text-primary" size={18} />}
          />

          <FieldItem
            label="Diet Type"
            value={dietType || "Not specified"}
            icon={<Apple className="text-primary" size={18} />}
          />

          <FieldItem
            label="Meal Timing"
            value={mealTiming || "Not specified"}
            icon={<Clock className="text-primary" size={18} />}
          />

          <FieldItem
            label="Primary Goal"
            value={primaryGoal || "Not specified"}
            icon={<Target className="text-primary" size={18} />}
          />

          <FieldItem
            label="Plan Type"
            value={planType || "Not specified"}
            icon={<BookOpen className="text-primary" size={18} />}
          />

          <FieldItem
            label="Stress & Sleep"
            value={stressSleep || "Not specified"}
            icon={<Brain className="text-primary" size={18} />}
          />
        </div>

        <Separator className="my-6" />

        <div className="space-y-6">
          <TagList
            label="Health Conditions"
            values={getValue<string[]>("health_conditions") || []}
            iconComponent={<Heart className="text-primary mr-2" size={16} />}
          />

          <TagList
            label="Allergies"
            values={getValue<string[]>("allergies") || []}
            iconComponent={<Award className="text-red-500 mr-2" size={16} />}
            colorClass="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
          />

          <TagList
            label="Recovery Needs"
            values={getValue<string[]>("recovery_needs") || []}
            iconComponent={
              <Activity className="text-blue-500 mr-2" size={16} />
            }
            colorClass="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
          />

          <TagList
            label="Meal Preferences"
            values={getValue<string[]>("meal_preferences") || []}
            iconComponent={<Coffee className="text-green-500 mr-2" size={16} />}
            colorClass="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
          />
        </div>
      </>
    );
  };

  // Default renderer for any category
  const renderDefaultCategory = (category: Category) => {
    const data = category.data;

    return (
      <div className="space-y-4">
        {Object.entries(data).map(([key, value]) => {
          // Skip display fields, they'll be shown with their base fields
          if (key.endsWith("_display")) return null;

          // For array values, render as tags
          if (Array.isArray(value)) {
            return (
              <TagList
                key={key}
                label={key
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                values={value}
                iconComponent={
                  CategoryIcons[key] || (
                    <Smile className="text-primary mr-2" size={16} />
                  )
                }
              />
            );
          }

          // For simple values, render as field items
          return (
            <FieldItem
              key={key}
              label={key
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
              value={
                value
                  ? key.endsWith("_display")
                    ? value
                    : getDisplayValue(key, value, clientProfileMapping)
                  : "Not specified"
              }
              icon={
                CategoryIcons[key] || (
                  <Smile className="text-primary" size={18} />
                )
              }
            />
          );
        })}
      </div>
    );
  };

  // Renderer for a specific category
  const renderCategoryContent = (categoryKey: string, category: Category) => {
    switch (categoryKey) {
      case "basic_information":
        return renderBasicInformation(category);
      case "region":
        return renderRegion(category);
      default:
        return renderDefaultCategory(category);
    }
  };

  return (
    <div className="space-y-6 font-poppins">
      {/* User info section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm"
      >
        <div className="bg-primary-100 rounded-full p-3">
          <User size={24} className="text-primary-700" />
        </div>
        <div>
          <h2 className="text-lg font-medium">User ID: {profile.user_id}</h2>
          <p className="text-muted-foreground">
            Profile last updated:{" "}
            {new Date(profile.updated_at).toLocaleDateString()}
          </p>
        </div>
      </motion.div>

      {/* Basic Information Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border-primary-100 bg-white">
          <CardHeader className="bg-gradient-to-r from-primary-50 to-primary-100 pb-4">
            <CardTitle className="text-xl md:text-2xl text-primary-900 font-playfair flex items-center">
              <User className="mr-2" size={20} />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {profile.categories.basic_information &&
              renderBasicInformation(profile.categories.basic_information)}
          </CardContent>
        </Card>
      </motion.div>

      {/* Location Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border-primary-100 bg-white">
          <CardHeader className="bg-gradient-to-r from-primary-50 to-primary-100 pb-4">
            <CardTitle className="text-xl md:text-2xl text-primary-900 font-playfair flex items-center">
              <MapPin className="mr-2" size={20} />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {profile.categories.region &&
              renderRegion(profile.categories.region)}
          </CardContent>
        </Card>
      </motion.div>

      {/* Lifestyle & Preferences Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border-primary-100 bg-white">
          <CardHeader className="bg-gradient-to-r from-primary-50 to-primary-100 pb-4">
            <CardTitle className="text-xl md:text-2xl text-primary-900 font-playfair flex items-center">
              <Activity className="mr-2" size={20} />
              Lifestyle & Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {renderLifestylePreferences()}
          </CardContent>
        </Card>
      </motion.div>

      {/* Dynamically render all other categories */}
      {Object.entries(profile.categories).map(([categoryKey, category]) => {
        // Skip already rendered categories and empty ones
        if (
          categoryKey === "basic_information" ||
          categoryKey === "region" ||
          !category.data ||
          Object.keys(category.data).length === 0
        ) {
          return null;
        }

        // Skip categories whose data is only used in the Lifestyle section
        if (
          [
            "activity",
            "diet",
            "meal_timing",
            "plan",
            "stress_and_sleep",
            "health",
            "allergies",
            "recovery_needs",
            "meal_preferences",
          ].includes(categoryKey)
        ) {
          return null;
        }

        return (
          <motion.div
            key={categoryKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border-primary-100 bg-white">
              <CardHeader className="bg-gradient-to-r from-primary-50 to-primary-100 pb-4">
                <CardTitle className="text-xl md:text-2xl text-primary-900 font-playfair flex items-center">
                  {CategoryIcons[categoryKey] || (
                    <FileText className="mr-2" size={20} />
                  )}
                  <span className="ml-2">{category.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {renderCategoryContent(categoryKey, category)}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ClientProfileDetail;
