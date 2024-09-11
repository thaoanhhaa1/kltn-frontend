export const inputNumberProps = {
    style: {
        width: '100%',
    },
    controls: true,
    min: 0,
    max: 10,
    precision: 0,
};

export const selectProps = {
    fieldNames: {
        label: 'name',
        value: '_id',
    },
    showSearch: true,
    optionFilterProp: 'name',
};

export const datePickerProps = {
    style: {
        width: '100%',
    },
    format: 'DD/MM/YYYY',
};
