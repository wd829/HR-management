// Import necessary libraries
import React, { useEffect, useState, useRef } from 'react';
import { Card } from 'antd';
import { BasicReportTableRow } from '@app/api/report.api';
import * as S from './ReportDetail.style';
import { ReportCard } from '../ReportCard/ReportCard';

type MyComponentProps = {
    content: BasicReportTableRow[];
};

const CustomSlide: React.FC<MyComponentProps> = ({ content }) => {
    const slideContainerRef = useRef<HTMLDivElement>(null);
    const slideContentRef = useRef<HTMLDivElement>(null);
    const [slideHeight, setSlideHeight] = useState(0);

    const [reports, setReports] = useState<BasicReportTableRow[]>(content);

    useEffect(() => {
        calculateSlideHeight();
        window.addEventListener('resize', calculateSlideHeight);
        return () => {
            window.removeEventListener('resize', calculateSlideHeight);
        };
    }, []);

    const calculateSlideHeight = () => {
        const containerHeight = slideContainerRef.current?.offsetHeight || 0;
        const contentHeight = slideContentRef.current?.offsetHeight || 0;

        setSlideHeight(Math.max(containerHeight, contentHeight));
    };

    return (
        <Card>
            <div ref={slideContainerRef} style={{ height: slideHeight,  overflowX: 'auto'}}>
                <div ref={slideContentRef}>
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
                </div>
            </div>
        </Card>
    );
};

export default CustomSlide;
