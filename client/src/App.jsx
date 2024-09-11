import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import SingleSnippetPage from './pages/SingleSnippetPage';
import CreateSnippet from './pages/CreateSnippet';
import Header from './components/Header';
import { useEffect, useState } from 'react';
import EditSnippet from './pages/EditSnippet';
import axios from 'axios';

// export const url = '/api/snippets';
export const url = 'http://localhost:5000/api/snippets';

function App() {
  const [snippets, setSnippets] = useState(
    JSON.parse(localStorage.getItem('snippets')) || []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(url);
        console.log(data);

        setSnippets(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

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

  const deleteSnippet = (id) => {
    setSnippets((prev) => prev.filter((s) => s.id !== id));
  };

  // useEffect(() => {
  //   localStorage.setItem('snippets', JSON.stringify(snippets));
  // }, [snippets]);

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
