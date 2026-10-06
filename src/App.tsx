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
import { PresentMode } from './pages/PresentMode';
import { PlanBuilder } from './pages/PlanBuilder';
import { ShabbatPack } from './pages/ShabbatPack';
import { WhatsNew } from './pages/WhatsNew';
import { Privacy, Terms, Accessibility } from './pages/Legal';
import { trackVisit } from './lib/api';
import { ScrollProgress } from './components/ScrollProgress';

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

  useEffect(() => {
    if (!isAdmin) trackVisit();
  }, [isAdmin]);

  if (location.pathname.startsWith('/present/')) {
    return (
      <Routes>
        <Route path="/present/:id" element={<PresentMode />} />
      </Routes>
    );
  }

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
      <ScrollProgress />
      <a href="#main" className="skip-link">דלג לתוכן הראשי</a>
      <Header />
      <main id="main" tabIndex={-1} style={{ flex: 1, outline: 'none' }}>
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
          <Route path="/builder" element={<PlanBuilder />} />
          <Route path="/shabbat-pack" element={<ShabbatPack />} />
          <Route path="/whats-new" element={<WhatsNew />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Reviews />} />
          <Route path="/submit" element={<SubmitActivity />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/accessibility" element={<Accessibility />} />
          {/* כל כתובת לא מוכרת (וגם פתיחה של האתר בתוך תצוגה מוטמעת) נוחתת על מסך הבית */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      {!isChat && <Footer />}
      <Mascot />
    </div>
  );
}
