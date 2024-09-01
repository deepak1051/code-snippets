import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';

export default function CreateSnippet({ createSnippet }) {
  const [title, setTitle] = useState('');

  const [code, setCode] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    setError(null);

    if (!title || !code) {
      setError('Please add a title and code');
      return;
    }

    createSnippet({ title, code, id: nanoid() });
    navigate('/');
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

          <div className="flex gap-4">
            <label className="w-12" htmlFor="code">
              Code
            </label>
            <textarea
              name="code"
              className="border rounded p-2 w-full"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={8}
            />
          </div>

          {error ? (
            <div className="my-2 p-2 bg-red-200 border rounded border-red-400">
              {error}
            </div>
          ) : null}

          <button type="submit" className="rounded p-2 bg-blue-200">
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
