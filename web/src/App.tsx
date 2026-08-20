import { BrowserRouter, Routes, Route, Outlet } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { TopPage } from './pages/TopPage';
import { TopicDetail } from './pages/TopicDetail';
import { NewTopic } from './pages/NewTopic';
import { AnswerDetail } from './pages/AnswerDetail';
import { UserProfile } from './pages/UserProfile';

// -----------------------------
// モックコンポーネント (後で pages/ に分割)
// -----------------------------

const Layout = () => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <Header />
    <main style={{ flex: 1, padding: '2rem', maxWidth: '1024px', margin: '0 auto', width: '100%' }}>
      <Outlet />
    </main>
  </div>
);

// -----------------------------
// アプリケーション
// -----------------------------

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<TopPage />} />
            <Route path="/topics/:id" element={<TopicDetail />} />
            <Route path="/topics/new" element={<NewTopic />} />
            <Route path="/answers/:id" element={<AnswerDetail />} />
            <Route path="/users/:id" element={<UserProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
