import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Mascot } from './components/Mascot';
import { Home } from './pages/Home';
import { CategoryPage } from './pages/CategoryPage';
import { ActivityDetail } from './pages/ActivityDetail';
import { ReadingDetail } from './pages/ReadingDetail';
import { StaffStudyDetail } from './pages/StaffStudyDetail';
import { AIAssistant } from './pages/AIAssistant';
import { Chuparim } from './pages/Chuparim';
import { ChuparDetail } from './pages/ChuparDetail';
import { SearchResults } from './pages/SearchResults';
import { Favorites } from './pages/Favorites';
import { About } from './pages/About';
import { Reviews } from './pages/Reviews';
import { HowToBuild } from './pages/HowToBuild';
import { SubmitActivity } from './pages/SubmitActivity';
import { Admin } from './pages/Admin';

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
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <ScrollToTop />
        <Routes>
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    );
  }

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
          <Route path="/staff-study/:id" element={<StaffStudyDetail />} />
          <Route path="/ai" element={<AIAssistant />} />
          <Route path="/chuparim" element={<Chuparim />} />
          <Route path="/chupar/:id" element={<ChuparDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-to-build" element={<HowToBuild />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Reviews />} />
          <Route path="/submit" element={<SubmitActivity />} />
          {/* כל כתובת לא מוכרת (וגם פתיחה של האתר בתוך תצוגה מוטמעת) נוחתת על מסך הבית */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
      {!isChat && <Footer />}
      <Mascot />
    </div>
  );
}
