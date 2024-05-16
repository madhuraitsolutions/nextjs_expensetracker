"use client";

import { DateRangePicker } from '@/components/ui/date-range-picker';
import { MAX_DATE_RANGE_DAYS } from '@/lib/constants';
import { differenceInDays, startOfMonth } from 'date-fns';
import React, { useState } from 'react'
import { toast } from 'sonner';

function TranasactionsPage() {
    const [dateRange, SetDateRange] = useState<{ from: Date, to: Date }>({
        from: startOfMonth(new Date()),
        to: new Date()
    });

    return (
        <div className='border-b bg-card'>
            <div className='container flex flex-wrap items-center justify-between gap-6 py-8'>
                <div>
                    <p className='text-3xl font-bold'>Tranasaction History</p>
                </div>
                <DateRangePicker
                    initialDateFrom={dateRange.from}
                    initialDateTo={dateRange.to}
                    showCompare={false}
                    onUpdate={values => {
                        const { from, to } = values.range;

                        if (!from || !to) return;
                        if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                            toast.error("Max date range is " + MAX_DATE_RANGE_DAYS + " days");
                            return;
                        }

                        SetDateRange({ from, to });
                    }}
                />
            </div>
        </div>
    )
}

export default TranasactionsPage;