import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';

export default function CreateSnippet({ createSnippet }) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);
  const [steps, setSteps] = useState([]);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (!title || steps.length === 0) {
      setError('Please add a title and steps');
      return;
    }
    createSnippet({ title, steps });
    navigate('/');
  };

  const handleAddMore = () => {
    setSteps((prev) => [
      ...prev,
      { stepTitle: '', stepCode: '', id: nanoid() },
    ]);
  };

  const handleChangeStepTitle = (value, id) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === id ? { ...step, stepTitle: value } : step
      )
    );
  };

  const handleChangeStepCode = (value, id) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, stepCode: value } : step))
    );
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
                className=" bg-gray-300 shadow-lg  border p-2 rounded"
              >
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

          <button type="submit" className="rounded p-2 bg-blue-800 text-white">
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
