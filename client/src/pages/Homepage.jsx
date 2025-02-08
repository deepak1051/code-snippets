import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import api from '../config/api';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FiChevronRight } from 'react-icons/fi';
import { FaArrowLeft } from 'react-icons/fa';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

export default function Homepage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data, isError, isPending, error } = useQuery({
    queryKey: ['snippets'],
    queryFn: () => api.get('/snippets').then((res) => res.data),
  });

  const { data: categories, isPending: categoriesPending } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((res) => res.data),
  });

  console.log('data', data);

  const navigate = useNavigate();

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-blue-600">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-red-600">{error.toString()}</div>
      </div>
    );
  }

  console.log('data', data);

  const handleCategoryChange = (value) => {
    console.log(value);

    setSelectedCategory(value);
  };
  const filteredSnippets = data.filter((snippet) => {
    if (selectedCategory === 'all') {
      return true;
    } else {
      return snippet.category === selectedCategory;
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-600">
          Code Snippets
        </h1>
        <p className="text-muted-foreground">
          Browse through the collection of code snippets or create your own.
        </p>
      </div>

      <div>
        <Select onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>

            {categories?.map((category) => (
              <SelectItem key={category._id} value={category._id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredSnippets?.map((snippet) => (
          <Link to={`/snippets/${snippet._id}`} key={snippet._id}>
            <Card className="group hover:shadow-md transition-all  cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between   py-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-4  ">
                  {snippet.title} -
                  {
                    <div className="text-sm text-muted-foreground">
                      {snippet.steps?.length} step
                      {snippet.steps?.length !== 1 ? 's' : ''}
                    </div>
                  }
                  <span className="text-xs text-white bg-orange-600 p-1 rounded ">
                    {snippet.author?.name || 'ADMIN'}
                  </span>
                </CardTitle>

                <Button
                  variant="ghost"
                  className="group-hover:bg-blue-50 group-hover:text-blue-600"
                >
                  View
                  <FiChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardHeader>
            </Card>
          </Link>
        ))}

        {data?.length === 0 && (
          <Card className="bg-muted/50">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <div className="text-2xl font-semibold text-muted-foreground mb-2">
                No snippets yet
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Get started by creating your first code snippet
              </p>
              <Link to="/snippets/new">
                <Button>Create Snippet</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
