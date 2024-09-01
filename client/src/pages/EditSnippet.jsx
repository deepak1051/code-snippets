import { Editor } from '@monaco-editor/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { url } from '../App';
import { nanoid } from 'nanoid';

export default function EditSnippet({ editSnippet }) {
  const { id } = useParams();

  const [title, setTitle] = useState('');
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${url}/${id}`);
        setTitle(data.title);
        setSteps(data.steps);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    setError(null);

    if (!title || steps.length === 0) {
      setError('Please add  code');
      return;
    }

    editSnippet({ title, steps, _id: id });
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
            <div key={item.id} className="border border-teal-400 p-2 rounded">
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
                <Editor
                  height="40vh"
                  theme="vs-dark"
                  language="javascript"
                  defaultValue={item.stepCode}
                  options={{ minimap: { enabled: false } }}
                  // onChange={(code) => setCode(code)}
                  onChange={(code) => handleChangeStepCode(code, item.id)}
                />
              </div>
            </div>
          ))}
        </div>

        <button type="button" onClick={handleAddMore}>
          Add More
        </button>

        {error ? (
          <div className="my-2 p-2 bg-red-200 border rounded border-red-400">
            {error}
          </div>
        ) : null}
      </div>

      <div>
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