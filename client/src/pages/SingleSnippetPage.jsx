import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import axios from 'axios';
import { url } from '../App';

export default function SingleSnippetPage({ deleteSnippet }) {
  const [snippet, setSnippet] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${url}/${id}`);
        setSnippet(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);

  const navigate = useNavigate();

  if (!snippet) {
    return <div>Loading...</div>;
  }

  return (
    <div className="m-4 container mx-auto px-4 max-w-4xl">
      <div className="flex my-4 justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-400">{snippet.title}</h1>

        <div className="flex gap-4">
          <Link
            to={`/snippets/${snippet._id}/edit`}
            className="p-2 border rounded"
          >
            Edit
          </Link>
          <div>
            <button
              onClick={() => {
                deleteSnippet(snippet._id);
                navigate('/');
              }}
              className="p-2 border rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {snippet?.steps?.map((step) => (
          <div key={step._id} className="flex flex-col gap-2">
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
