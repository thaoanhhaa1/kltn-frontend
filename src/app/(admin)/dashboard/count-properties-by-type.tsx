'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

export interface ICountPropertyByTypeChart {
    fill: string;
    type: string;
    count: number;
    avgPrice: number;
}

const CountPropertiesByType = ({
    chartData,
    config,
}: {
    config: ChartConfig;
    chartData: Array<ICountPropertyByTypeChart>;
}) => {
    return (
        <Card className="flex-1">
            <CardContent className="flex items-center h-full">
                <ChartContainer config={config} className="mx-auto mt-6 h-[400px]">
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 0,
                        }}
                    >
                        <XAxis dataKey="type" type="category" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis dataKey="count" type="number" hide />
                        <ChartTooltip
                            content={<ChartTooltipContent nameKey="count" labelFormat={() => `Số lượng`} hideLabel />}
                        />
                        <Bar dataKey="count" layout="vertical" radius={5} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default CountPropertiesByType;
