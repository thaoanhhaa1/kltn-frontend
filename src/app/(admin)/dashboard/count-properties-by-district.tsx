'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ICountPropertyByDistrict } from '@/interfaces/dashboard';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartConfig = {} as ChartConfig;

const CountPropertiesByDistrict = ({ data }: { data: Array<ICountPropertyByDistrict> }) => {
    return (
        <Card>
            <CardContent>
                <ChartContainer className="h-[400px] w-full pt-4" config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="district" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
                        <YAxis tickLine={false} axisLine={false} />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="count"
                                    labelFormat={() => `Số lượng`}
                                />
                            }
                        />
                        <Bar dataKey="count" fill="hsl(var(--chart-2))" />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default CountPropertiesByDistrict;
