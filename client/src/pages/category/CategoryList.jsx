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
import Homepage from '../Homepage';

const API_URL = import.meta.env.VITE_IMAGE_URL;

export default function CategoryList() {
  const { data, isPending } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((res) => res.data),
  });
  return (
    <div className="flex gap-4 border">
      <div className="w-1/3 flex gap-4 flex-col">
        {data?.map((category) => (
          <Link key={category?._id} to={`/${category?._id}`}>
            <div className="relative bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl dark:bg-gray-950 group">
              {/* Image */}
              <img
                src={
                  `${API_URL}/${category?.image}` ||
                  category?.image ||
                  'https://images.unsplash.com/photo-1739382120673-54ec4d63dc62?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8'
                }
                alt="Category"
                className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ aspectRatio: '600/400', objectFit: 'cover' }}
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black opacity-90 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Category Title */}
              <div className="absolute bottom-4 left-0 w-full text-center px-4">
                <h3 className="text-lg font-semibold text-white drop-shadow-md bg-black/40 px-3 py-1 rounded-md inline-block">
                  {category.name}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="w-2/3 border  rounded">
        <Link to={`/categories/new`}>
          <Button> New Category</Button>
        </Link>

        <Homepage />
      </div>
    </div>
  );
}
