import React, { useState, useEffect, useRef } from "react";
import { ClientProfile, getProfileValue } from "@/types/clientProfile";
import { motion } from "framer-motion";
import {
  User,
  MapPin,
  Activity,
  Heart,
  Apple,
  Coffee,
  Clock,
  Brain,
  Award,
  BookOpen,
  Target,
  Utensils,
  AlarmClock,
  Dumbbell,
  BellRing,
  Calendar,
  RefreshCcw,
  Briefcase,
  ShoppingBag,
  Scale,
  ChevronRight,
  Edit,
  Info,
  PenLine,
  Flame,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ClientProfileDetailProps {
  profile: ClientProfile;
}

const ClientProfileDetail: React.FC<ClientProfileDetailProps> = ({
  profile,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Helper function to extract values
  const getValue = <T extends any>(fieldName: string): T | null => {
    return getProfileValue<T>(profile, fieldName);
  };

  // Format field name for display
  const formatFieldName = (fieldName: string): string => {
    return fieldName
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Get basic profile data
  const age = getValue<number>("age");
  const gender = getValue<string>("gender");
  const height = getValue<string>("height");
  const currentWeight = getValue<string>("current_weight");
  const targetWeight = getValue<string>("target_weight");
  const bmi = getValue<number>("bmi") || 0;
  const bmr = getValue<number>("bmr");
  const dailyCalories = getValue<number>("daily_calories");
  const weightGoalType = getValue<string>("weight_goal_type");
  const weightDifference = getValue<number>("weight_difference") || 0;
  const dietType = getValue<string>("diet_type_display");
  const activityLevel = getValue<string>("activity_level_display");
  const primaryGoal = getValue<string>("primary_goal_display");
  const city = getValue<string>("city");
  const state = getValue<string>("state");
  const country = getValue<string>("country");
  const allergies = getValue<string[]>("allergies") || [];
  const recoveryNeeds = getValue<string[]>("recovery_needs") || [];
  const planType = getValue<string>("plan_type_display");
  const bodyType = getValue<string>("body_type");
  const waterIntake = getValue<string>("water_intake");
  const mealTimingDisplay = getValue<string>("meal_timing_display");

  // Function to check if a category has data
  const categoryHasData = (categoryKey: string): boolean => {
    const category = profile.categories[categoryKey];
    if (!category || !category.data) return false;

    const data = category.data;
    return Object.keys(data).some((key) => {
      // Skip display fields when checking
      if (key.endsWith("_display")) return false;
      // Check if value exists and is not empty
      const value = data[key];
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== undefined && value !== "";
    });
  };

  // Get categories with data
  const getCategoriesWithData = (): string[] => {
    return Object.keys(profile.categories).filter((key) =>
      categoryHasData(key)
    );
  };

  const categoriesWithData = getCategoriesWithData();

  // Define tabs and their content
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: <User size={16} />,
    },
    {
      id: "health",
      label: "Health & Activity",
      icon: <Heart size={16} />,
      categories: [
        "health",
        "activity",
        "exercise",
        "sleep_hours",
        "water_intake",
        "stress_and_sleep",
      ],
    },
    {
      id: "diet",
      label: "Diet & Nutrition",
      icon: <Apple size={16} />,
      categories: ["diet", "allergies", "meal_preferences", "meal_timing"],
    },
    {
      id: "goals",
      label: "Goals & Recovery",
      icon: <Target size={16} />,
      categories: [
        "goals",
        "recovery_needs",
        "timeline",
        "commitment_level",
        "motivation",
      ],
    },
    {
      id: "lifestyle",
      label: "Lifestyle",
      icon: <Coffee size={16} />,
      categories: [
        "work_type",
        "cooking_capability",
        "cooking_time",
        "grocery_access",
        "budget_constraints",
      ],
    },
  ];

  // Filter tabs that have data
  const activeTabs = tabs.filter(
    (tab) =>
      tab.id === "overview" ||
      (tab.categories &&
        tab.categories.some((cat) => categoriesWithData.includes(cat)))
  );

  // Render a category's data
  const renderCategoryData = (categoryKey: string) => {
    const category = profile.categories[categoryKey];
    if (!category || !category.data) return null;

    const data = category.data;

    // Skip rendering if no meaningful data
    const hasData = Object.keys(data).some((key) => {
      if (key.endsWith("_display")) return false;
      const value = data[key];
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== undefined && value !== "";
    });

    if (!hasData) return null;

    // Get category icon
    const getCategoryIcon = () => {
      switch (categoryKey) {
        case "activity":
          return <Activity className="text-primary" />;
        case "health":
          return <Heart className="text-red-500" />;
        case "diet":
          return <Apple className="text-green-500" />;
        case "allergies":
          return <Award className="text-rose-500" />;
        case "recovery_needs":
          return <RefreshCcw className="text-cyan-500" />;
        case "goals":
          return <Target className="text-primary" />;
        case "meal_preferences":
          return <Utensils className="text-amber-500" />;
        case "meal_timing":
          return <Clock className="text-blue-500" />;
        case "exercise":
          return <Dumbbell className="text-emerald-500" />;
        case "exercise_timing":
          return <AlarmClock className="text-blue-400" />;
        case "water_intake":
          return <Coffee className="text-blue-500" />;
        case "stress_and_sleep":
          return <Brain className="text-violet-500" />;
        case "sleep_hours":
          return <BellRing className="text-indigo-400" />;
        case "work_type":
          return <Briefcase className="text-gray-500" />;
        case "cooking_capability":
          return <Utensils className="text-pink-500" />;
        case "cooking_time":
          return <Clock className="text-pink-500" />;
        case "grocery_access":
          return <ShoppingBag className="text-yellow-600" />;
        case "budget_constraints":
          return <Flame className="text-orange-500" />;
        default:
          return <Info className="text-gray-500" />;
      }
    };

    return (
      <div className="profile-card animate-fade-in" key={categoryKey}>
        <div className="profile-card__header">
          <div className="profile-card__icon">{getCategoryIcon()}</div>
          <h3 className="profile-card__title">{category.name}</h3>
        </div>
        <div className="profile-card__content">
          <div className="field-group">
            {Object.entries(data).map(([key, value]) => {
              // Skip display fields, they'll be used inline
              if (key.endsWith("_display")) return null;

              // Skip empty values
              if (
                value === null ||
                value === undefined ||
                (Array.isArray(value) && value.length === 0)
              ) {
                return null;
              }

              // Check for display value
              const displayKey = `${key}_display`;
              const displayValue = data[displayKey];

              // Render array values as tags
              if (Array.isArray(value) && value.length > 0) {
                // Determine tag style
                let tagStyle = "tag";
                if (key === "allergies") tagStyle = "tag tag--allergy";
                else if (key === "recovery_needs")
                  tagStyle = "tag tag--recovery";
                else if (key.includes("diet") || key.includes("meal"))
                  tagStyle = "tag tag--diet";

                return (
                  <div className="field-item" key={key}>
                    <div className="field-item__label">
                      <span className="field-item__label-icon">
                        {getCategoryIcon()}
                      </span>
                      {formatFieldName(key)}
                    </div>
                    <div className="tags-container">
                      {value.map((item: string, idx: number) => (
                        <span key={idx} className={tagStyle}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              }

              // Render normal values
              return (
                <div className="field-item" key={key}>
                  <div className="field-item__label">
                    <span className="field-item__label-icon">
                      {getCategoryIcon()}
                    </span>
                    {formatFieldName(key)}
                  </div>
                  <div className="field-item__value">
                    {displayValue || value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Render the overview tab content
  const renderOverview = () => {
    return (
      <div className="space-y-6">
        {/* Client Summary Card */}
        <div className="profile-header animate-fade-in">
          <div className="profile-header__banner"></div>
          <div className="profile-header__content">
            <div className="flex flex-col md:flex-row md:items-end">
              <div className="profile-avatar">
                {gender === "male" ? "M" : "F"}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold">
                    Client #{profile.user_id}
                  </h2>
                  {weightGoalType && (
                    <Badge
                      className={`tag ${
                        weightGoalType === "gain"
                          ? "tag--diet"
                          : weightGoalType === "loss"
                          ? "tag--allergy"
                          : "tag"
                      }`}
                    >
                      {weightGoalType === "gain"
                        ? "Weight Gain"
                        : weightGoalType === "loss"
                        ? "Weight Loss"
                        : "Maintenance"}
                    </Badge>
                  )}
                </div>

                <p className="text-muted-foreground mt-1">
                  {[
                    age ? `${age} years old` : null,
                    gender ? (gender === "male" ? "Male" : "Female") : null,
                    activityLevel || null,
                  ]
                    .filter(Boolean)
                    .join(" • ")}
                </p>
              </div>

              <Button className="btn btn-primary hover-lift mt-4 md:mt-0">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              {/* Weight Stats Card */}
              <div className="metrics-card animate-fade-in animate-delay-1">
                <div className="metrics-card__label">Weight Management</div>
                <div className="flex justify-between items-center mt-2">
                  <div>
                    <div className="text-xs text-muted-foreground">Current</div>
                    <div className="text-lg font-semibold">
                      {currentWeight || "–"} kg
                    </div>
                  </div>

                  <div className="text-lg font-bold text-primary">→</div>

                  <div>
                    <div className="text-xs text-muted-foreground">Target</div>
                    <div className="text-lg font-semibold">
                      {targetWeight || "–"} kg
                    </div>
                  </div>
                </div>

                {currentWeight && targetWeight && (
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div
                        className="progress-bar__fill"
                        style={{
                          width: `${Math.min(
                            (parseFloat(currentWeight as string) /
                              parseFloat(targetWeight as string)) *
                              100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>

                    <div className="mt-2 text-center">
                      <Badge
                        className={`${
                          weightDifference > 0 ? "tag--diet" : "tag--allergy"
                        }`}
                      >
                        {weightDifference > 0 ? "+" : ""}
                        {weightDifference} kg
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              {/* Health Metrics Card */}
              <div className="metrics-card animate-fade-in animate-delay-2">
                <div className="metrics-card__label">Health Metrics</div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="bg-primary-light rounded-md p-2 text-center">
                    <div className="text-xs text-muted-foreground">BMI</div>
                    <div className="metrics-card__value">
                      {bmi ? bmi.toFixed(1) : "–"}
                    </div>
                  </div>

                  <div className="bg-primary-light rounded-md p-2 text-center">
                    <div className="text-xs text-muted-foreground">BMR</div>
                    <div className="metrics-card__value">{bmr || "–"}</div>
                  </div>

                  <div className="bg-primary-light rounded-md p-2 text-center">
                    <div className="text-xs text-muted-foreground">Cal</div>
                    <div className="metrics-card__value">
                      {dailyCalories || "–"}
                    </div>
                  </div>
                </div>

                {dietType && (
                  <div className="mt-3 text-center">
                    <Badge className="tag tag--diet">{dietType}</Badge>
                  </div>
                )}
              </div>

              {/* Location Card */}
              <div className="metrics-card animate-fade-in animate-delay-3">
                <div className="metrics-card__label">Location & Plan</div>

                <div className="mt-2">
                  <div className="flex items-center text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    <span className="font-medium">
                      {[city, state, country].filter(Boolean).join(", ") ||
                        "Not specified"}
                    </span>
                  </div>

                  {primaryGoal && (
                    <div className="flex items-center text-sm mb-2">
                      <Target className="h-4 w-4 mr-2 text-primary" />
                      <span className="font-medium">{primaryGoal}</span>
                    </div>
                  )}

                  {planType && (
                    <div className="flex items-center text-sm">
                      <BookOpen className="h-4 w-4 mr-2 text-primary" />
                      <span className="font-medium">{planType} Plan</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Information Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Diet Information */}
          <div className="profile-card animate-fade-in animate-delay-1">
            <div className="profile-card__header">
              <div className="profile-card__icon">
                <Apple className="text-green-500" />
              </div>
              <h3 className="profile-card__title">Diet Information</h3>
            </div>
            <div className="profile-card__content">
              <div className="space-y-3">
                {dietType && (
                  <div className="field-item">
                    <div className="field-item__label">
                      <span className="field-item__label-icon">
                        <Apple className="text-green-500" />
                      </span>
                      Diet Type
                    </div>
                    <div className="field-item__value">{dietType}</div>
                  </div>
                )}

                {mealTimingDisplay && (
                  <div className="field-item">
                    <div className="field-item__label">
                      <span className="field-item__label-icon">
                        <Clock className="text-blue-500" />
                      </span>
                      Meal Timing
                    </div>
                    <div className="field-item__value">{mealTimingDisplay}</div>
                  </div>
                )}

                {allergies.length > 0 && (
                  <div className="field-item">
                    <div className="field-item__label">
                      <span className="field-item__label-icon">
                        <Award className="text-rose-500" />
                      </span>
                      Allergies
                    </div>
                    <div className="tags-container">
                      {allergies.map((item, idx) => (
                        <span key={idx} className="tag tag--allergy">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Activity Information */}
          <div className="profile-card animate-fade-in animate-delay-2 relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300">
            <div className="profile-card__header flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <div className="profile-card__icon flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                <Activity className="text-primary" />
              </div>
              <h3 className="profile-card__title text-lg font-semibold text-gray-900">
                Activity & Body
              </h3>
            </div>
            <div className="profile-card__content p-4">
              <div className="flex flex-wrap gap-4">
                {activityLevel && (
                  <div className="field-item flex-1 min-w-[200px]">
                    <div className="field-item__label flex items-center text-gray-700 font-medium">
                      <span className="field-item__label-icon mr-2">
                        <Activity className="text-primary" />
                      </span>
                      Activity Level
                    </div>
                    <div className="field-item__value text-gray-900 font-semibold">
                      {activityLevel}
                    </div>
                  </div>
                )}

                {height && (
                  <div className="field-item flex-1 min-w-[200px]">
                    <div className="field-item__label flex items-center text-gray-700 font-medium">
                      <span className="field-item__label-icon mr-2">
                        <Scale className="text-green-500" />
                      </span>
                      Height
                    </div>
                    <div className="field-item__value text-gray-900 font-semibold">
                      {height} cm
                    </div>
                  </div>
                )}

                {bodyType && (
                  <div className="field-item flex-1 min-w-[200px]">
                    <div className="field-item__label flex items-center text-gray-700 font-medium">
                      <span className="field-item__label-icon mr-2">
                        <User className="text-orange-500" />
                      </span>
                      Body Type
                    </div>
                    <div className="field-item__value text-gray-900 font-semibold">
                      {bodyType}
                    </div>
                  </div>
                )}

                {waterIntake && (
                  <div className="field-item flex-1 min-w-[200px]">
                    <div className="field-item__label flex items-center text-gray-700 font-medium">
                      <span className="field-item__label-icon mr-2">
                        <Coffee className="text-blue-500" />
                      </span>
                      Water Intake
                    </div>
                    <div className="field-item__value text-gray-900 font-semibold">
                      {waterIntake} L
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-primary scale-x-0 transition-transform duration-500 group-hover:scale-x-100"></div>
          </div>
          {/* Recovery Needs */}
          {recoveryNeeds.length > 0 && (
            <div className="profile-card animate-fade-in animate-delay-3">
              <div className="profile-card__header">
                <div className="profile-card__icon">
                  <RefreshCcw className="text-cyan-500" />
                </div>
                <h3 className="profile-card__title">Recovery Needs</h3>
              </div>
              <div className="profile-card__content">
                <div className="tags-container">
                  {recoveryNeeds.map((item, idx) => (
                    <span key={idx} className="tag tag--recovery">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render a specific tab's content
  const renderTabContent = (tabId: string) => {
    if (tabId === "overview") {
      return renderOverview();
    }

    const tab = tabs.find((t) => t.id === tabId);
    if (!tab || !tab.categories) return null;

    return (
      <div className="space-y-6">
        {tab.categories.map((categoryKey) => renderCategoryData(categoryKey))}
      </div>
    );
  };

  return (
    <div className="profile-container">
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex items-center justify-between mb-4">
          <TabsList className="flex flex-wrap justify-center gap-2 overflow-x-auto">
            {" "}
            {activeTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-1"
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <Button className="btn btn-primary hover-lift">
            <PenLine className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        {activeTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-0">
            {renderTabContent(tab.id)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ClientProfileDetail;
