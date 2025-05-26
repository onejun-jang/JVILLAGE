import { useRef } from 'react';
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

  const scrollToAdvantage = () => {
    advantageRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToPrice = () => {
    priceRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToLessonFlow = () => {
    lessonFlowRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

      <footer>
      <div style={{ height: '10vh' }}></div>
        <TrialStartSection />
      </footer>

      {/* // <button onClick={() => setMode("SIGNIN")}>asd</button> */}
    </>
  );
}

export default AdPage;