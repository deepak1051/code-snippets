import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import api from '@/config/api';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

export default function CategoryList() {
  const { data, isPending } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((res) => res.data),
  });
  return (
    <div className="flex gap-4">
      <div className="w-2/3 flex gap-4 flex-col">
        {data?.map((category) => {
          return (
            <Link key={category?._id} to={`/${category?._id}`}>
              <Card className="cursor-pointer">
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>Card Description</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="w-1/3 border  rounded">
        <Link to={`/categories/new`}>
          <Button> New Category</Button>
        </Link>
      </div>
    </div>
  );
}
