import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Homepage() {
  const { data, isError, isPending, error } = useQuery({
    queryKey: ['snippets'],
    queryFn: () => axios.get('/api/snippets').then((res) => res.data),
  });

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>{error.toString()}</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mt-6 flex flex-col gap-2">
        {data?.map((snippet) => (
          <div
            key={snippet._id}
            className="p-2 bg-blue-50 rounded cursor-pointer flex items-center justify-between"
          >
            <h2 className="text-xl">{snippet.title}</h2>
            <Link
              to={`/snippets/${snippet._id}`}
              className="border border-indigo-500 text-indigo-500  p-2 rounded"
            >
              View
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
