import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import CreateSnippet from './pages/CreateSnippet';
import Header from './components/Header';
import { useCallback, useEffect, useState } from 'react';
import EditSnippet from './pages/EditSnippet';
import axios from 'axios';
import SingleSnippetPage from './pages/SingleSnippetPage';

export const url = '/api/snippets';
// export const url = 'http://localhost:5000/api/snippets';

function App() {
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
        <Route path="/" element={<Homepage />} />
        <Route
          path="/snippets/:id"
          element={<SingleSnippetPage deleteSnippet={deleteSnippet} />}
        />
        <Route path="/snippets/new" element={<CreateSnippet />} />

        <Route
          path="/snippets/:id/edit"
          element={<EditSnippet editSnippet={editSnippet} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
