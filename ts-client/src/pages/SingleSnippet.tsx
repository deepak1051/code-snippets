import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import axios from 'axios';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../config/api';
import { type Snippet } from '../types';

export default function SingleSnippetPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data, isPending, isError, error } = useQuery<Snippet>({
    queryKey: ['snippets', id],
    queryFn: () => axios.get(`/api/snippets/${id}`).then((res) => res.data),
  });

  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`snippets/${id}`),
    onSuccess: async () => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ['snippets'] });
      navigate('/');
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('you really want to delete this snippet')) {
      deleteMutation.mutate(id);
    }
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) return <div>{error.toString()}</div>;

  return (
    <div className="m-4 container mx-auto px-4 max-w-4xl">
      <div className="flex my-4 justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-400">{data.title}</h1>

        <div className="flex gap-4">
          <Link
            to={`/snippets/${data._id}/edit`}
            className="p-2 border rounded"
          >
            Edit
          </Link>
          <div>
            <button
              onClick={async () => handleDelete(data._id)}
              className="p-2 border rounded"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting..' : 'Delete'}
            </button>
          </div>
        </div>
      </div>

      {deleteMutation.isError && <div>{deleteMutation.error.message}</div>}

      <div className="flex flex-col gap-6">
        {data?.steps?.map((step) => (
          <div key={step.id} className="flex flex-col gap-2">
            <h2>{step.stepTitle}</h2>
            <pre className="p-3 border rounded bg-gray-200 border-gray-200 relative">
              <code>{step.stepCode}</code>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(step.stepCode);
                  toast.success('Code copied to clipboard');
                }}
                className="text-white font-bold p-2 border bg-slate-400 rounded absolute right-4 top-4 text-xs"
              >
                Copy
              </button>
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
