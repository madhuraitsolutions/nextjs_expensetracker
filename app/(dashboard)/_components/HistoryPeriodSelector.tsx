"use client";

import { Period, TimeFrame } from '@/lib/types';
import React from 'react'

interface Props {
    period: Period;
    setPeriod: (period: Period) => void;
    timeFrame: TimeFrame;
    setTimeFrame: (timeFrame: TimeFrame) => void;
}

function HistoryPeriodSelector({ period, setPeriod, timeFrame, setTimeFrame }: Props) {
    return (
        <div>HistoryPeriodSelector</div>
    )
}

export default HistoryPeriodSelector