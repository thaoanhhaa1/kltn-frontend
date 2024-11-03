'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { IGetTenantDistributionByOwner } from '@/interfaces/dashboard';
import { getRandomColor } from '@/lib/utils';
import { useMemo } from 'react';
import { Pie, PieChart } from 'recharts';

const TenantDistribution = ({ data }: { data: Array<IGetTenantDistributionByOwner> }) => {
    const [chartConfig, chartData] = useMemo(() => {
        const config: ChartConfig = {};
        const chartData = data.map((item) => {
            const color = getRandomColor();

            config[item.district] = {
                label: item.district,
                color,
            };

            return {
                ...item,
                fill: color,
            };
        });
        return [config, chartData];
    }, [data]);

    return (
        <Card className="flex-1">
            <CardContent className="flex items-center h-full">
                <ChartContainer config={chartConfig} className="mx-auto mt-6 h-[400px]">
                    <PieChart>
                        <ChartTooltip
                            content={<ChartTooltipContent nameKey="count" labelFormat={() => `Số lượng`} hideLabel />}
                        />
                        <Pie data={chartData} dataKey="count" nameKey="district" label={(item) => item.district} />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default TenantDistribution;
