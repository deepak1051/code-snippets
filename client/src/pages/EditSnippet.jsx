import { Editor } from '@monaco-editor/react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditSnippet({ editSnippet, snippets }) {
  const { id } = useParams();

  const snippet = snippets.find((snippet) => snippet.id == id);

  const [code, setCode] = useState(snippet.code || '');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    setError(null);

    if (!code) {
      setError('Please add  code');
      return;
    }

    editSnippet({ title: snippet.title, code, id: snippet.id });
    navigate('/');
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div>
        <Editor
          height="40vh"
          theme="vs-dark"
          language="javascript"
          defaultValue={snippet.code}
          options={{ minimap: { enabled: false } }}
          onChange={(code) => setCode(code)}
        />

        {error && (
          <p className="bg-red-200 border p-2 border-red-400 my-4 rounded">
            {error}
          </p>
        )}

        <form className="mt-4" onSubmit={handleSubmit}>
          <button
            type="submit"
            className="bg-indigo-500 text-white p-2 border rounded "
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
