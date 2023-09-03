import React, { useEffect, useMemo, useState } from 'react';
import { BaseCarousel } from '@app/components/common/BaseCarousel/Carousel';
import { useAppSelector } from '@app/hooks/reduxHooks';
import * as S from './ReportDetail.style';
import { BREAKPOINTS } from '@app/styles/themes/constants';
import { BasicReportTableRow } from '@app/api/report.api';
import { ReportCard } from '../ReportCard/ReportCard';
// import { Carousel } from 'react-responsive-carousel';
// import 'react-responsive-carousel/lib/styles/carousel.min.css';

/* eslint-disable @typescript-eslint/no-explicit-any */
const NextArrow = (props: any) => {
    const { className, style, onClick } = props;
    return <S.SliderArrow className={className} style={{ ...style, display: 'block' }} onClick={onClick} />;
};

const PrevArrow = (props: any) => {
    const { className, style, onClick } = props;
    return <S.SliderArrow className={className} style={{ ...style, display: 'block' }} onClick={onClick} />;
};

type MyComponentProps = {
    reportData: BasicReportTableRow[];
};

export const ReportDetailCard: React.FC<MyComponentProps> = ({ reportData }) => {

    const [reports, setReports] = useState<BasicReportTableRow[]>(reportData);

    const user = useAppSelector((state) => state.user.user);

    const carouselRef = React.useRef();

    // const totalRef = ref || carouselRef;

    // useEffect(() => {

    //     const handleKeyDown = (e: KeyboardEvent) => {
    //         console.log('----------------eee');
    //         console.log(e);

    //         if (e.key === 'ArrowRight') {
    //             console.log('======slicknext');
    //             console.log(carouselRef);
    //             console.log(carouselRef.current);
    //             totalRef.current?.slickNext();
    //         } else if (e.key === 'ArrowLeft') {
    //             totalRef.current?.slickPrev();
    //         }
    //     };
    //     window.addEventListener('keydown', handleKeyDown);
    //     return () => {
    //         window.removeEventListener('keydown', handleKeyDown);
    //     };
    // }, []);

    return (
        <S.SlideContain >
            {reports.length > 0 && (
                <S.CarouselWrapper tabIndex={0} >
                    <BaseCarousel
                        arrows={true}
                        nextArrow={<NextArrow />}
                        prevArrow={<PrevArrow />}
                        slidesToShow={1}
                        responsive={[
                            {
                                breakpoint: 2000,
                                settings: {
                                    slidesToShow: 1,
                                },
                            },
                            {
                                breakpoint: 1600,
                                settings: {
                                    slidesToShow: 1,
                                },
                            },
                            {
                                breakpoint: BREAKPOINTS.xl - 1,
                                settings: {
                                    slidesToShow: 1,
                                },
                            },
                            {
                                breakpoint: 1200,
                                settings: {
                                    slidesToShow: 1,
                                },
                            },
                            {
                                breakpoint: 920,
                                settings: {
                                    slidesToShow: 1,
                                },
                            },
                            {
                                breakpoint: BREAKPOINTS.md - 1,
                                settings: {
                                    slidesToShow: 1,
                                },
                            },
                            {
                                breakpoint: 720,
                                settings: {
                                    slidesToShow: 1,
                                },
                            },
                            {
                                breakpoint: 520,
                                settings: {
                                    slidesToShow: 1,
                                },
                            },
                        ]}
                    >
                        {reports.map((report) => {
                            return (
                                <S.SlideContain key={report?._id}>
                                    <ReportCard
                                        other={report?.other}
                                        ipMsgId={report.ipMsgId}
                                        userTeam={report?.userTeam}
                                        realName={report?.lastName + " " + report?.firstName}
                                        userName={report?.userName}
                                        performed={report?.performed} achieved={report?.achieved}
                                        request={report?.request} issue={report?.issue}
                                        skillImprovement={report?.skillImprovement}
                                        plan={report?.plan}
                                    />
                                </S.SlideContain>
                            );
                        })}
                    </BaseCarousel>
                    
                </S.CarouselWrapper>
            )}
        </S.SlideContain>
    );
};
