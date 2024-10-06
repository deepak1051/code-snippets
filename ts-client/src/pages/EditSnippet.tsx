import { Editor } from '@monaco-editor/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { MdDelete } from 'react-icons/md';
import { CiSquareChevDown, CiSquareChevUp } from 'react-icons/ci';
import { api } from '../config/api';
import { Snippet, Step } from '../types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const STEP_ADD_TYPE = {
  UP: 'UP',
  DOWN: 'DOWN',
};

export default function EditSnippet() {
  const { id } = useParams();

  const [error, setError] = useState<string | null>(null);

  const { data, isPending, isError } = useQuery({
    queryKey: ['snippets', id],
    queryFn: async () =>
      api.get<Snippet>(`/snippets/${id}`).then((res) => res.data),
  });
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [title, setTitle] = useState<string>(data?.title || '');
  const [steps, setSteps] = useState<Step[]>(data?.steps || []);

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setSteps(data.steps);
    }
  }, [data]);

  const editSnippetMuation = useMutation({
    mutationFn: (value: { title: string; steps: Step[] }) =>
      api.put(`/snippets/${id}`, value),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
      navigate('/');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);

    if (!title || steps.length === 0) {
      setError('Please add  code');
      return;
    }

    editSnippetMuation.mutate({ title, steps });
  };

  const handleAddMore = (id?: string, type?: string) => {
    if (!id || !type) {
      setSteps((prev) => [
        ...prev,
        { stepTitle: '', stepCode: '', id: nanoid() },
      ]);
      return;
    }

    const stepIndex = steps.findIndex((item) => item.id === id);

    if (type === STEP_ADD_TYPE.UP) {
      setSteps((prev) => {
        return [
          ...prev.slice(0, stepIndex),
          { stepTitle: '', stepCode: '', id: nanoid() },
          ...prev.slice(stepIndex),
        ];
      });
    }

    if (type === STEP_ADD_TYPE.DOWN) {
      setSteps((prev) => {
        return [
          ...prev.slice(0, stepIndex + 1),
          { stepTitle: '', stepCode: '', id: nanoid() },
          ...prev.slice(stepIndex + 1),
        ];
      });
    }
  };

  const handleChangeStepTitle = (value: string, id: string) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === id ? { ...step, stepTitle: value } : step
      )
    );
  };

  const handleChangeStepCode = (value: string | undefined, id: string) => {
    if (!value) {
      setSteps((prev) =>
        prev.map((step) => (step.id === id ? { ...step, stepCode: '' } : step))
      );
      return;
    }

    setSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, stepCode: value } : step))
    );
  };

  const handleDeleteStep = (id: string) => {
    if (window.confirm('Are you sure you want to delete this code step')) {
      setSteps((prev) => prev.filter((step) => step.id !== id));
    }
  };

  if (isPending) return <div>Loading...</div>;

  if (isError) return <div>something went wrong</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
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
              className=" flex gap-2 border bg-gray-400 shadow-lg  p-2 rounded "
            >
              <div className="flex-1 flex flex-col">
                <div className="flex gap-4 mb-2 items-center">
                  <label className="whitespace-nowrap" htmlFor="title">
                    step title
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="border rounded p-2 w-full "
                    id="title"
                    value={item.stepTitle}
                    onChange={(e) =>
                      handleChangeStepTitle(e.target.value, item.id)
                    }
                  />
                </div>

                <div className="flex gap-4  flex-1">
                  <Editor
                    height="30vh"
                    theme="vs-dark"
                    language="javascript"
                    defaultValue={item.stepCode}
                    options={{ minimap: { enabled: false } }}
                    onChange={(code) => handleChangeStepCode(code, item.id)}
                  />
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={() => handleAddMore(item.id, STEP_ADD_TYPE.UP)}
                  type="button"
                  className="p-2 rounded   h-8 bg-blue-800 flex items-center justify-center"
                >
                  <CiSquareChevUp size={20} color="white" />
                </button>

                <button
                  onClick={() => handleAddMore(item.id, STEP_ADD_TYPE.DOWN)}
                  type="button"
                  className="p-2 rounded   h-8  bg-blue-800 flex items-center justify-center"
                >
                  <CiSquareChevDown size={20} color="white" />
                </button>
                <button
                  onClick={() => handleDeleteStep(item.id)}
                  type="button"
                  className="p-2 rounded   h-8 bg-white flex items-center justify-center"
                >
                  <MdDelete size={20} color="red" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          className="p-2 rounded-md border bg-slate-50 "
          type="button"
          onClick={() => handleAddMore()}
        >
          Add More
        </button>

        {error ? (
          <div className="my-2 p-2 bg-red-200 border rounded border-red-400">
            {error}
          </div>
        ) : null}
      </div>

      <form className="mt-4 flex items-center w-full" onSubmit={handleSubmit}>
        <button
          type="submit"
          className="w-full bg-indigo-800 text-white p-2 border rounded "
        >
          Save
        </button>
      </form>
    </div>
  );
}
