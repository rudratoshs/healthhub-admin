
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getDietPlans } from '@/lib/dietPlans';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DietPlanCard from '@/components/dietPlan/DietPlanCard';
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Utensils, 
  ListFilter, 
  RefreshCw, 
  Calendar
} from 'lucide-react';
import { DietPlanFilters, DietPlanStatus } from '@/types/dietPlan';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const DietPlans: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<DietPlanFilters>({
    status: 'active',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dietPlans', filters],
    queryFn: () => getDietPlans(filters),
  });

  const handleStatusChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      status: value as DietPlanStatus,
    }));
  };

  const handleClientIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters(prev => ({
      ...prev,
      client_id: value,
    }));
  };

  const handleCreateDietPlan = () => {
    navigate('/diet-plans/create');
  };

  const handleViewDietPlan = (id: number) => {
    navigate(`/diet-plans/${id}`);
  };

  const handleEditDietPlan = (id: number) => {
    navigate(`/diet-plans/${id}/edit`);
  };

  const filteredPlans = data?.data.filter(plan => 
    plan.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 font-poppins">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-playfair text-primary-900 flex items-center">
            <Utensils className="mr-2 h-8 w-8 text-primary-600" />
            Diet Plans
          </h1>
          <p className="text-muted-foreground">Manage and create nutritional diet plans for clients</p>
        </div>
        <Button 
          onClick={handleCreateDietPlan}
          className="bg-primary hover:bg-primary-600 text-white hover-scale"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Diet Plan
        </Button>
      </div>

      <Card className="mb-6 border-primary-100 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <CardTitle className="text-lg text-primary-900">Filters</CardTitle>
              <CardDescription>Filter and search diet plans</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsFilterExpanded(!isFilterExpanded)}>
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              {isFilterExpanded ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className={`pt-4 transition-all duration-300 ${isFilterExpanded ? 'max-h-96' : 'max-h-20'} overflow-hidden`}>
          <div className="flex flex-wrap gap-3 items-end">
            <div className="w-full sm:w-auto flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by title..." 
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full sm:w-auto">
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select onValueChange={handleStatusChange} defaultValue={filters.status}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {isFilterExpanded && (
              <div className="w-full sm:w-auto">
                <label className="text-sm font-medium mb-1 block">Client ID</label>
                <Input 
                  placeholder="Filter by client ID" 
                  value={filters.client_id || ''}
                  onChange={handleClientIdChange}
                  className="w-[180px]"
                />
              </div>
            )}
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => refetch()}
              className="h-10 w-10 ml-auto"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader size="lg" variant="primary" />
        </div>
      ) : error ? (
        <Card className="border-red-200">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-700">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Failed to load diet plans. Please try again later.</p>
            <Button 
              variant="outline" 
              onClick={() => refetch()} 
              className="mt-4"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : filteredPlans?.length === 0 ? (
        <Card className="border-amber-200">
          <CardHeader className="bg-amber-50">
            <CardTitle className="text-amber-700">No Diet Plans Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-amber-400 mb-4" />
            <p className="mb-4">No diet plans match your search criteria.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setFilters({ status: 'active' });
              }}>
                <ListFilter className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
              <Button onClick={handleCreateDietPlan} className="bg-primary hover:bg-primary-600">
                <Plus className="mr-2 h-4 w-4" />
                Create Diet Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredPlans?.map((plan) => (
              <DietPlanCard 
                key={plan.id} 
                plan={plan}
                onDelete={() => {}}
                onDuplicate={() => {}}
              />
            ))}
          </div>
          
          {data && data.meta && data.meta.last_page > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      // Handle pagination
                    }} 
                  />
                </PaginationItem>
                
                {Array.from({ length: data.meta.last_page }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      href="#" 
                      isActive={data.meta.current_page === i + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        // Handle pagination
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      // Handle pagination
                    }} 
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default DietPlans;
