import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../components/ui/card';
import { Code, Pre } from '../components/ui/code';
import { FiEdit3, FiTrash2, FiCopy } from 'react-icons/fi';
import { FaArrowLeft } from 'react-icons/fa6';

export default function SingleSnippetPage() {
  const { id } = useParams();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['snippets', id],
    queryFn: () => axios.get(`/api/snippets/${id}`).then((res) => res.data),
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: () =>
      axios.delete(`/api/snippets/${id}`).then((res) => res.data),
    onSuccess: () => {
      navigate('/');
      queryClient.invalidateQueries(['snippets']);
      toast.success('Snippet deleted successfully');
    },
    onError(error) {
      toast.error(
        error.response.data.message || error.message || 'Something went wrong'
      );
    },
  });

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this snippet?')) {
      try {
        await deleteMutation.mutate();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

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

  return (
    <div className="space-y-8">
      <Link to="/">
        <Button className="bg-gray-400 hover:bg-gray-500">
          <FaArrowLeft className="mr-2" /> Back
        </Button>
      </Link>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold text-blue-600">
            {data.title}
            <span className="text-xs text-white bg-orange-600 p-2 rounded mx-2 ">
              {data?.author?.name || 'ADMIN'}
            </span>
          </CardTitle>
          <div className="flex gap-2">
            <Link to={`/snippets/${data._id}/edit`}>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <FiEdit3 className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-600"
              disabled={deleteMutation.isPending}
              onClick={handleDelete}
            >
              <FiTrash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6">
        {data?.steps?.map((step, index) => (
          <Card key={step._id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">
                Step {index + 1}: {step.stepTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <Pre className="relative group">
                <Code>{step.stepCode}</Code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    navigator.clipboard.writeText(step.stepCode);
                    toast.success('Code copied to clipboard');
                  }}
                >
                  <FiCopy className="h-4 w-4" />
                </Button>
              </Pre>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
