import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { MdDelete } from 'react-icons/md';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../config/api';
import { AxiosError } from 'axios';

interface Step {
  id: string;
  stepTitle: string;
  stepCode: string;
}

interface AxiosErrorResponse {
  message: string;
}

export default function CreateSnippet() {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const createSnippetMutation = useMutation<
    unknown,
    AxiosError<AxiosErrorResponse>,
    { title: string; steps: Step[] }
  >({
    mutationFn: (value: { title: string; steps: Step[] }) =>
      api.post(`/snippets`, value),
    onSuccess: async () => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ['snippets'] });
      navigate('/');
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!title || steps.length === 0) {
      setError('Please add a title and steps');
      return;
    }
    await createSnippetMutation.mutate({ title, steps });
  };

  const handleAddMore = () => {
    setSteps((prev) => [
      ...prev,
      { stepTitle: '', stepCode: '', id: nanoid() },
    ]);
  };

  const handleChangeStepTitle = (value: string, id: string) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === id ? { ...step, stepTitle: value } : step
      )
    );
  };

  const handleChangeStepCode = (value: string, id: string) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, stepCode: value } : step))
    );
  };

  const handleDelete = (id: string) => {
    setSteps((prev) => prev.filter((item) => item.id != id));
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <form onSubmit={handleSubmit}>
        <h3 className="font-semibold my-3 text-2xl text-center text-indigo-400">
          Create a snippet
        </h3>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <label className="w-12" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              name="title"
              className="border rounded p-2 w-full"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-4">
            {steps.map((item) => (
              <div
                key={item.id}
                className="relative bg-gray-300 shadow-lg  border p-2 rounded flex gap-2"
              >
                <div className="flex-1">
                  <div className="flex gap-4 mb-2">
                    <label className="whitespace-nowrap" htmlFor="title">
                      step title
                    </label>
                    <input
                      type="text"
                      name="title"
                      className="border rounded p-2 w-full"
                      id="title"
                      value={item.stepTitle}
                      onChange={(e) =>
                        handleChangeStepTitle(e.target.value, item.id)
                      }
                    />
                  </div>

                  <div className="flex gap-4">
                    <label className="whitespace-nowrap" htmlFor="code">
                      step code
                    </label>
                    <textarea
                      name="code"
                      className="border rounded p-2 w-full"
                      id="code"
                      value={item.stepCode}
                      onChange={(e) =>
                        handleChangeStepCode(e.target.value, item.id)
                      }
                      rows={4}
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  type="button"
                  className="p-2 rounded border  h-16"
                >
                  <MdDelete size={24} color="red" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddMore}
            className="p-2 rounded-md border bg-slate-50 "
          >
            Add More
          </button>

          {error ? (
            <div className="my-2 p-2 bg-red-200 border rounded border-red-400">
              {error}
            </div>
          ) : null}

          {createSnippetMutation.isError ? (
            <div className="my-2 p-2 bg-red-200 border rounded border-red-400">
              {createSnippetMutation.error?.response?.data?.message ||
                createSnippetMutation.error?.message}
            </div>
          ) : null}

          <button
            disabled={createSnippetMutation.isPending}
            type="submit"
            className="rounded p-2 bg-blue-800 text-white"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
