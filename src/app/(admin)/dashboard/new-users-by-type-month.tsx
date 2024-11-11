'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ICountNewUserByTypeAndMonth } from '@/interfaces/dashboard';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartConfig = {
    owner: {
        label: 'Chủ nhà',
        color: 'hsl(var(--chart-1))',
    },
    renter: {
        label: 'Người thuê',
        color: 'hsl(var(--chart-2))',
    },
} satisfies ChartConfig;

const NewUsersByTypeAndMonth = ({ data }: { data: Array<ICountNewUserByTypeAndMonth> }) => {
    return (
        <Card>
            <CardContent>
                <ChartContainer className="h-[400px] w-full pt-4" config={chartConfig}>
                    <BarChart accessibilityLayer data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => `Tháng ${value}`}
                        />
                        <YAxis tickLine={false} axisLine={false} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                        <Bar dataKey="owner" fill="var(--color-owner)" radius={4} />
                        <Bar dataKey="renter" fill="var(--color-renter)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default NewUsersByTypeAndMonth;
