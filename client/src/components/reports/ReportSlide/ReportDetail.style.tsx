import styled from 'styled-components';

export const CarouselWrapper = styled.div`
  margin-left: -1.25rem;
  margin-right: -1.25rem;

  .slick-track {
    display: flex;
    align-items: center;
  }

  .slick-initialized .slick-slide {
    margin: 0 50px;
  }
`;

export const SliderArrow = styled.div`
  z-index: 1;
  width: unset;
  height: unset;

  &.slick-prev {
    left: 1.25rem;
  }

  &.slick-next {
    right: 1.25rem;
  }

  &:before {
    color: var(--primary-color) !important;
    font-size: 2rem !important;
    position: absolute;
    left: -6px;
    top: -6px;
  }
`;

export const SlideContain = styled.div`
  border:none
`
/* ReportCard.style.ts */

export const CardContainer = styled.div`
  /* styles for the slide content container */
  &.slide-content {
    height: auto;
    transition: height 0.3s ease-in-out;
  }
`;
