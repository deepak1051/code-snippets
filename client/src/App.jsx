import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import CreateSnippet from './pages/CreateSnippet';
import EditSnippet from './pages/EditSnippet';
import Homepage from './pages/Homepage';
import SingleSnippetPage from './pages/SingleSnippetPage';
import MySnippets from './pages/MySnippets';
import CreateCategory from './pages/category/CreateCategory';
import CategoryList from './pages/category/CategoryList';
import CategoryPage from './pages/category/CategoryPage';

export const url = '/api/snippets';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Header />
        <main className="container mx-auto lg:px-8 py-2 max-w-7xl px-2">
          <Routes>
            <Route path="/snippets" element={<Homepage />} />
            <Route path="/" element={<CategoryList />} />
            <Route path="/:categoryId" element={<CategoryPage />} />
            <Route path="/categories/new" element={<CreateCategory />} />
            <Route path="/snippets/:id" element={<SingleSnippetPage />} />
            <Route path="/snippets/new" element={<CreateSnippet />} />
            <Route path="/snippets/:id/edit" element={<EditSnippet />} />
            <Route path="/my-snippets" element={<MySnippets />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
