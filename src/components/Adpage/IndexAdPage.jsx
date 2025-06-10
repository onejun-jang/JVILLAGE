import { useRef , useEffect, useState} from 'react';
import MainHeader from './MainHeader';
import FirstAppearence from './FirstAppearence';
import AdvantageSection from './AdvantageSection';
import RecommandationSection from './RecommandationSection';
import PriceSection from './PriceSection';
import LessonFlow from './LessonFlow';
import TrialStartSection from './TrialStartSection';

import { useNavigate } from 'react-router-dom';

function AdPage() {
  const advantageRef = useRef(null);
  const priceRef = useRef(null);
  const lessonFlowRef = useRef(null);
  const navigate = useNavigate();
  const [showFooter, setShowFooter] = useState(false);

  const scrollToAdvantage = () => {
    advantageRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToPrice = () => {
    priceRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToLessonFlow = () => {
    lessonFlowRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = 1.5 * window.innerHeight;
      setShowFooter(prev => {
        if (prev) return prev; 
        if (scrollY > windowHeight) return true; 
        return prev; 
      });
    }
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <header>
        <MainHeader
          onScrollToAdvantage={scrollToAdvantage}
          onScrollToPrice={scrollToPrice}
          onScrollToLessonFlow={scrollToLessonFlow}
          onLoginClick={() => navigate('/login')}
        />
      </header>

      <main>
      <div style={{ height: 'clamp(150px, 10vh, 180px)' }}></div>
      <FirstAppearence />
      {/* <div style={{ height: 'clamp(50px, 18vh, 180px)' } }></div> */}
      <div ref={advantageRef}>
        <AdvantageSection />
      </div>
      {/* <div style={{ height: '18vh' }}></div> */}
      <RecommandationSection />
      {/* <div style={{ height: '18vh' }}></div> */}
      <div ref={priceRef}>
        <PriceSection />
      </div>
      <div style={{ height: '18vh' }}></div>
      <div ref={lessonFlowRef}>
        <LessonFlow />
      </div>  
      </main>

      <footer   style={{
        opacity: showFooter ? 1 : 0,
        visibility: showFooter ? 'visible' : 'hidden',
        transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
      }}>
      <div style={{ height: '10vh' }}></div>
        <TrialStartSection
          onLoginClick={() => navigate('/login')}
        />
      </footer>

      {/* // <button onClick={() => setMode("SIGNIN")}>asd</button> */}
    </>
  );
}

export default AdPage;