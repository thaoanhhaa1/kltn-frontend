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

    return (
        <div className="mt-4">
            <Card>
                <CardContent>
                    <ChartContainer className="h-[400px] w-full pt-4" config={chartConfig}>
                        <LineChart
                            accessibilityLayer
                            data={data}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => `Tháng ${value}`}
                            />
                            <YAxis
                                width={80}
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => formatCurrency(value)}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent format={(value) => formatCurrency(Number(value))} />}
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Line
                                dataKey="expenditure"
                                type="monotone"
                                stroke="var(--color-expenditure)"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Line
                                dataKey="income"
                                type="monotone"
                                stroke="var(--color-income)"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Line
                                dataKey="netIncome"
                                type="monotone"
                                stroke="var(--color-netIncome)"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default IncomeExpenditure;
