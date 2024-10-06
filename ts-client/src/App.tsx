import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import SingleSnippet from './pages/SingleSnippet';
import CreateSnippet from './pages/CreateSnippet';
import Header from './components/Header';
import EditSnippet from './pages/EditSnippet';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/snippets/:id" element={<SingleSnippet />} />
        <Route path="/snippets/new" element={<CreateSnippet />} />

        <Route path="/snippets/:id/edit" element={<EditSnippet />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
