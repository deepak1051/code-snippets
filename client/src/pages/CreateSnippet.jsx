import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { MdDelete } from 'react-icons/md';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

export default function CreateSnippet() {
  const [title, setTitle] = useState('');
  const [isDraft, setIsDraft] = useState(false);
  const [error, setError] = useState(null);
  const [steps, setSteps] = useState([]);

  const navigate = useNavigate();

  console.log('isDraft', isDraft);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!title || steps.length === 0) {
      setError('Please add a title and steps');
      return;
    }

    try {
      await axios.post('/api/snippets', { title, steps, isDraft });
      navigate('/');
    } catch (error) {
      console.log('ERROR', error);
      setError(error.response.data.message || error.message);
    }
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

  const handleDelete = (id) => {
    setSteps((prev) => prev.filter((item) => item.id != id));
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-indigo-400">
              Create a snippet
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                type="text"
                name="title"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 ">
              <input
                className=" p-4 h-6 w-6 cursor-pointer"
                type="checkbox"
                id="isDraft"
                checked={isDraft}
                onChange={(e) => setIsDraft(e.target.checked)}
              />
              <Label htmlFor="isDraft" className="cursor-pointer ">
                Draft Mode
              </Label>
            </div>

            <div className="flex flex-col gap-4">
              {steps.map((item) => (
                <Card key={item.id}>
                  <CardContent className="relative flex gap-4 p-4">
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`step-title-${item.id}`}>
                          Step Title
                        </Label>
                        <Input
                          type="text"
                          name="title"
                          id={`step-title-${item.id}`}
                          value={item.stepTitle}
                          onChange={(e) =>
                            handleChangeStepTitle(e.target.value, item.id)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`step-code-${item.id}`}>
                          Step Code
                        </Label>
                        <Textarea
                          name="code"
                          id={`step-code-${item.id}`}
                          value={item.stepCode}
                          onChange={(e) =>
                            handleChangeStepCode(e.target.value, item.id)
                          }
                          rows={4}
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDelete(item.id)}
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10"
                    >
                      <MdDelete className="h-4 w-4 text-red-500" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              type="button"
              onClick={handleAddMore}
              variant="outline"
              className="w-full"
            >
              Add More
            </Button>

            {error && (
              <div className="rounded-md bg-destructive/15 text-destructive p-3">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full">
              Create
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
