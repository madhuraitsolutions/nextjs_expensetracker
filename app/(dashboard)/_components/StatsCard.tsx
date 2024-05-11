"use client";

import { GetBalanceStatsResponseType } from '@/app/api/stats/balance/route';
import SkeletonWrapper from '@/components/SkeletonWrapper';
import { Card } from '@/components/ui/card';
import { GetFormatterforCurrency } from '@/lib/helpers';
import { UserSettings } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import React, { useCallback, useMemo } from 'react';
import CountUp from 'react-countup';

interface Props {
    from: Date;
    to: Date;
    userSettings: UserSettings;
}

function StatsCard({ from, to, userSettings }: Props) {

    const statsQuery = useQuery<GetBalanceStatsResponseType>({
        queryKey: ["overview", "stats", from, to],
        queryFn: () => fetch(
            `/api/stats/balance?from=${from}&to=${to}`
        ).then((res) => res.json()),
    });

    const formatter = useMemo(() => {
        return GetFormatterforCurrency(userSettings.currency);
    }, [userSettings.currency]);

    const income = statsQuery.data?.income || 0;
    const expense = statsQuery.data?.expense || 0;
    const balance = income - expense;

    return (
        <div className='releative flex w-full flex-wrap gap-2 md:flex-nowrap'>
            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <StatCard
                    formatter={formatter}
                    title="Income"
                    value={income}
                    icon={
                        <TrendingUp
                            className='h-12 w-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10'
                        />
                    }
                />
            </SkeletonWrapper>

            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <StatCard
                    formatter={formatter}
                    title="Expense"
                    value={expense}
                    icon={
                        <TrendingDown
                            className='h-12 w-12 items-center rounded-lg p-2 text-rose-500 bg-rose-400/10'
                        />
                    }
                />
            </SkeletonWrapper>

            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <StatCard
                    formatter={formatter}
                    title="Balance"
                    value={balance}
                    icon={
                        <Wallet
                            className='h-12 w-12 items-center rounded-lg p-2 text-violet-500 bg-violet-400/10'
                        />
                    }
                />
            </SkeletonWrapper>
        </div>
    )
}

export default StatsCard

function StatCard({ formatter, title, value, icon, }: {
    formatter: Intl.NumberFormat;
    title: String;
    value: number;
    icon: React.ReactNode;
}) {
    const formatFn = useCallback((value:number) => {
        return formatter.format(value);
     }, [formatter]);

    return (
        <Card className='flex h-24 w-full items-center gap-2 p-4'>            
            {icon}
            <div className='flex flex-col items-start gap-0'>
                <p className='text-muted-background'>{title}</p>
                <CountUp
                    preserveValue
                    redraw={false}
                    end={value}
                    decimals={2}
                    formattingFn={formatFn}
                    className='text-2xl'    
                />
            </div>
        </Card>
    )
}