import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import SingleSnippetPage from './pages/SingleSnippetPage';
import CreateSnippet from './pages/CreateSnippet';
import Header from './components/Header';
import { useCallback, useEffect, useState } from 'react';
import EditSnippet from './pages/EditSnippet';
import axios from 'axios';

export const url = '/api/snippets';
// export const url = 'http://localhost:5000/api/snippets';

function App() {
  const [snippets, setSnippets] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const { data } = await axios.get(url);

      setSnippets(data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createSnippet = async (snippet) => {
    try {
      const { data } = await axios.post(url, snippet);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const editSnippet = async (snippet) => {
    try {
      const { data } = await axios.put(`${url}/${snippet._id}`, snippet);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteSnippet = async (id) => {
    try {
      await axios.delete(`${url}/${id}`);
      await fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage snippets={snippets} />} />
        <Route
          path="/snippets/:id"
          element={
            <SingleSnippetPage
              snippets={snippets}
              deleteSnippet={deleteSnippet}
            />
          }
        />
        <Route
          path="/snippets/new"
          element={
            <CreateSnippet snippets={snippets} createSnippet={createSnippet} />
          }
        />

        <Route
          path="/snippets/:id/edit"
          element={
            <EditSnippet snippets={snippets} editSnippet={editSnippet} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
