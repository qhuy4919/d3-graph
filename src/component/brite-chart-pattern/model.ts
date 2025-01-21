export type Datum = {
    [key: string]: any;
} 

export const DataPrimaryField = {
    nameLabel: 'date',
    valueLabel: 'value',
    stackLabel: 'stack',
};

export type DataPrimaryField = typeof DataPrimaryField;

export type D3GraphContainer = {
    width: number,
    height: number,
    margin: {top: number, right: number, bottom: number, left: number},    
}