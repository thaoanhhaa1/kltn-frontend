'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { IIncomeExpenditure } from '@/interfaces/dashboard';
import { formatCurrency } from '@/lib/utils';
import { useMemo } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { ValueType } from 'recharts/types/component/DefaultTooltipContent';

const chartConfig = {
    expenditure: {
        label: 'Tổng chi',
        color: 'hsl(var(--chart-1))',
    },
    income: {
        label: 'Tổng thu',
        color: 'hsl(var(--chart-2))',
    },
    netIncome: {
        label: 'Thu nhập ròng',
        color: '#2563eb',
    },
} satisfies ChartConfig;

const IncomeExpenditure = ({ incomeExpenditures }: { incomeExpenditures: IIncomeExpenditure[] }) => {
    const data = useMemo(
        () =>
            incomeExpenditures.map((item) => ({
                ...item,
                netIncome: item.income - item.expenditure,
            })),
        [incomeExpenditures],
    );

    const tickXFormatter = (value: string) => `Tháng ${value}`;
    const tickYFormatter = (value: number) => formatCurrency(value);
    const chartTooltipFormatter = (value: ValueType) => formatCurrency(Number(value));

    return (
        <Card>
            <CardContent>
                <ChartContainer className="h-[400px] w-full pt-4" config={chartConfig}>
                    <LineChart accessibilityLayer data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tickFormatter={tickXFormatter} />
                        <YAxis width={80} tickFormatter={tickYFormatter} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent format={chartTooltipFormatter} />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Line dataKey="expenditure" type="monotone" stroke="var(--color-expenditure)" strokeWidth={2} />
                        <Line dataKey="income" type="monotone" stroke="var(--color-income)" strokeWidth={2} />
                        <Line dataKey="netIncome" type="monotone" stroke="var(--color-netIncome)" strokeWidth={2} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default IncomeExpenditure;
