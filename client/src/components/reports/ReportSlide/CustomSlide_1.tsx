import React, { useEffect, useState } from 'react';
import { ReportCard } from '../ReportCard/ReportCard';

interface Report {
  _id: string;
  other: string;
  ipMsgId: string;
  userTeam: string;
  lastName: string;
  firstName: string;
  userName: string;
  performed: string;
  achieved: string;
  request: string;
  issue: string;
  skillImprovement: string;
  plan: string;
}

interface CarouselComponentProps {
  reports: Report[];
}

const CarouselComponent: React.FC<CarouselComponentProps> = ({ reports }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    const carouselSlides = document.querySelectorAll('.carousel-slide');

    const adjustSlideHeight = () => {
      carouselSlides.forEach((slide) => {
        const slideElement = slide as HTMLElement; // Type assertion
        slideElement.style.height = 'auto';
        const slideHeight = slideElement.scrollHeight;
        slideElement.style.height = `${slideHeight}px`;
      });
    };

    window.addEventListener('resize', adjustSlideHeight);
    adjustSlideHeight();

    return () => {
      window.removeEventListener('resize', adjustSlideHeight);
    };
  }, []);

  const goToNextSlide = () => {
    const totalSlides = reports.length;
    setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
  };

  const goToPrevSlide = () => {
    const totalSlides = reports.length;
    setCurrentSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="carousel">
      {/* Render the current slide */}
      <div className="carousel-slide">
        {/* Slide content */}
        <ReportCard
          other={reports[currentSlide]?.other}
          ipMsgId={reports[currentSlide]?.ipMsgId}
          userTeam={reports[currentSlide]?.userTeam}
          realName={reports[currentSlide]?.lastName + ' ' + reports[currentSlide]?.firstName}
          userName={reports[currentSlide]?.userName}
          performed={reports[currentSlide]?.performed}
          achieved={reports[currentSlide]?.achieved}
          request={reports[currentSlide]?.request}
          issue={reports[currentSlide]?.issue}
          skillImprovement={reports[currentSlide]?.skillImprovement}
          plan={reports[currentSlide]?.plan}
        />
      </div>

      {/* Next and previous buttons */}
      <button className="carousel-button" onClick={goToPrevSlide}>
        Previous
      </button>
      <button className="carousel-button" onClick={goToNextSlide}>
        Next
      </button>
    </div>
  );
};

export default CarouselComponent;
