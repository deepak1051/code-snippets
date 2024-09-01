import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function SingleSnippetPage({ snippets, deleteSnippet }) {
  const { id } = useParams();

  const snippet = snippets.find((snippet) => snippet.id == id);

  const navigate = useNavigate();

  if (!snippet) {
    return <div>Snippet not found</div>;
  }

  return (
    <div className="m-4 container mx-auto px-4 max-w-4xl">
      <div className="flex my-4 justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-400">{snippet.title}</h1>

        <div className="flex gap-4">
          <Link
            to={`/snippets/${snippet.id}/edit`}
            className="p-2 border rounded"
          >
            Edit
          </Link>
          <div>
            <button
              onClick={() => {
                deleteSnippet(snippet.id);
                navigate('/');
              }}
              className="p-2 border rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <pre className="p-3 border rounded bg-gray-200 border-gray-200 relative">
        <code>{snippet.code}</code>

        <button
          onClick={() => {
            navigator.clipboard.writeText(snippet.code);
            toast.success('Code copied to clipboard');
          }}
          className="p-2 border bg-slate-400 rounded absolute right-4 top-4"
        >
          Copy
        </button>
      </pre>
    </div>
  );
}
