import { inputNumberProps } from '@/constants/init-props';
import { InputNumber, InputNumberProps } from 'antd';
import React from 'react';

const PriceInput = (props: InputNumberProps<number>) => {
    return (
        <InputNumber<number>
            addonAfter="VND"
            {...inputNumberProps}
            max={1000000000000}
            min={0}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
            parser={(value) => value?.replace(/\$\s?|(\.*)/g, '') as unknown as number}
            {...props}
        />
    );
};

export default PriceInput;
