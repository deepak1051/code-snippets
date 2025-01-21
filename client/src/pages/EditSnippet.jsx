import { Editor } from '@monaco-editor/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { url } from '../App';
import { nanoid } from 'nanoid';
import { MdDelete } from 'react-icons/md';
import { CiSquareChevDown, CiSquareChevUp } from 'react-icons/ci';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FaArrowLeft } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import api from '@/config/api';

const STEP_ADD_TYPE = {
  UP: 'UP',
  DOWN: 'DOWN',
};

export default function EditSnippet({ editSnippet }) {
  const { id } = useParams();

  const [title, setTitle] = useState('');
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('');

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const categoryQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((res) => res.data),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${url}/${id}`);
        setTitle(data.title);
        setSteps(data.steps.map((item) => ({ ...item, id: item._id })));
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);

  const editSnippetMutation = useMutation({
    mutationFn: ({ title, steps, _id }) =>
      axios.put(`${url}/${_id}`, { title, steps }),
    onSuccess: () => {
      queryClient.invalidateQueries(['snippets']);
      navigate('/');
    },
    onError: (error) => {
      console.log('ERROR', error);
      setError(error.response.data.message || error.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);

    if (!title || steps.length === 0) {
      setError('Please add  code');
      return;
    }

    await editSnippetMutation.mutate({
      title,
      steps,
      _id: id,
      selectedCategory,
    });
  };

  const handleAddMore = (id = null, type = null) => {
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

  const handleDeleteStep = (id) => {
    if (window.confirm('Are you sure you want to delete this code step')) {
      setSteps((prev) => prev.filter((step) => step.id !== id));
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Button
        onClick={() => navigate(-1)}
        className="bg-gray-400 hover:bg-gray-500 mt-2 mb-4"
      >
        <FaArrowLeft className="mr-2" /> Back
      </Button>

      <div className="flex flex-col gap-4">
        <div className="flex gap-10 items-center p-2 border border-gray-200">
          <label className="w-12 font-bold text-gray-500" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            name="title"
            className="border rounded p-2 w-full bg-gray-100"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex gap-10 items-center p-2 border border-gray-200">
          <label className="w-12 mr-2 font-bold text-gray-500" htmlFor="title">
            Category
          </label>
          <select
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 rounded border cursor-pointer bg-gray-100"
          >
            {categoryQuery?.data?.map((cat) => (
              <option value={cat?._id} id={cat?._id}>
                {cat?.name}
              </option>
            ))}
          </select>
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
          onClick={handleAddMore}
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
