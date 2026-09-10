import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Mascot } from './components/Mascot';
import { Home } from './pages/Home';
import { CategoryPage } from './pages/CategoryPage';
import { ActivityDetail } from './pages/ActivityDetail';
import { ReadingDetail } from './pages/ReadingDetail';
import { AIAssistant } from './pages/AIAssistant';
import { Chuparim } from './pages/Chuparim';
import { ChuparDetail } from './pages/ChuparDetail';
import { SearchResults } from './pages/SearchResults';
import { Favorites } from './pages/Favorites';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { SubmitActivity } from './pages/SubmitActivity';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  const isChat = location.pathname.startsWith('/ai');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ScrollToTop />
      <Header />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/activity/:id" element={<ActivityDetail />} />
          <Route path="/reading/:id" element={<ReadingDetail />} />
          <Route path="/ai" element={<AIAssistant />} />
          <Route path="/chuparim" element={<Chuparim />} />
          <Route path="/chupar/:id" element={<ChuparDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/submit" element={<SubmitActivity />} />
        </Routes>
      </div>
      {!isChat && <Footer />}
      <Mascot />
    </div>
  );
}
