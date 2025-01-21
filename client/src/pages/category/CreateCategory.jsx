import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/config/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function CreateCategory() {
  const [name, setName] = useState('');

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setError(null);
    try {
      e.preventDefault();

      await api.post('/categories', { name });
      toast.success('Category created successfully');
      navigate('/');
    } catch (error) {
      console.log('error');
      setError(
        error.response.data.message || error.message || 'Something went wrong'
      );
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-indigo-400">
              Create a Category
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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
