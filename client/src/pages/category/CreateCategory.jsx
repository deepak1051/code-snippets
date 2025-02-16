import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/config/api';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function CreateCategory({ categoryId = '' }) {
  console.log('categoryId', categoryId);

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const imageRef = useRef(null);

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (categoryId) {
      const fetchData = async () => {
        try {
          const { data } = await axios.get(`/api/categories/${categoryId}`);

          console.log('data', data);

          setName(data?.name || '');
          // setImage(data.image);
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    }
  }, []);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    setError(null);
    try {
      e.preventDefault();

      const formData = new FormData();

      formData.append('image', imageRef.current.files[0]);
      formData.append('name', name);

      await api.post('/categories', formData);
      toast.success('Category created successfully');
      navigate('/');
    } catch (error) {
      console.log('error');
      setError(
        error.response.data.message || error.message || 'Something went wrong'
      );
    }
  };

  const removeImage = () => {
    setImage('');

    if (imageRef.current) {
      imageRef.current.value = '';
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

            <div className="flex flex-col gap-2">
              <Label htmlFor="image">Image</Label>
              <Input
                type="file"
                name="image"
                id="image"
                onChange={onImageChange}
                ref={imageRef}
              />

              {image && (
                <div className="flex relative">
                  <img
                    alt="preview image"
                    src={image}
                    className="w-full h-64 object-contain"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 text-red-600"
                  >
                    <Trash />
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-md bg-destructive/15 text-destructive p-3">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full">
              {categoryId ? 'Update' : Create}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
