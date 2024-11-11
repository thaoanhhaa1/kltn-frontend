'use client';

import { ICountPropertyByTypeChart } from '@/app/(admin)/dashboard/count-properties-by-type';
import { Card, CardContent } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { formatCurrency } from '@/lib/utils';
import { Pie, PieChart } from 'recharts';

const CountPropertiesByRevenue = ({
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
                            content={
                                <ChartTooltipContent
                                    nameKey="avgPrice"
                                    labelFormat={() => `Giá thuê trung bình`}
                                    hideLabel
                                    format={(value) => formatCurrency(Number(value), true)}
                                />
                            }
                        />
                        <Pie data={chartData} dataKey="avgPrice" nameKey="type" label={(item) => item.type} />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default CountPropertiesByRevenue;
