'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Pie, PieChart } from 'recharts';

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
                    <PieChart>
                        <ChartTooltip
                            content={<ChartTooltipContent nameKey="count" labelFormat={() => `Số lượng`} hideLabel />}
                        />
                        <Pie data={chartData} dataKey="count" nameKey="type" label={(item) => item.type} />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default CountPropertiesByType;
