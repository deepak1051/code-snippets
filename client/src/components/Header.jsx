import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-indigo-50 p-2 rounded flex items-center justify-between">
        <Link to="/" className="text-3xl  font-bold  italic text-indigo-500">
          Snippets
        </Link>
        <Link
          className="bg-indigo-500 text-white p-2 rounded"
          to="/snippets/new"
        >
          Create
        </Link>
      </div>
    </div>
  );
}
