import { Link } from 'react-router-dom';

export default function Homepage({ snippets }) {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mt-6 flex flex-col gap-2">
        {snippets?.map((snippet) => (
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
