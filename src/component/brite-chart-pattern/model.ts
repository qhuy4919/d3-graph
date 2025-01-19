export type Datum = {
    [key: string]: any;
} 

export const DataPrimaryField = {
    nameLabel: 'date',
    valueLabel: 'value',
    stackLabel: 'stack',
};

export type DataPrimaryField = typeof DataPrimaryField;