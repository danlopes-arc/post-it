export const Datatype = [
  'integer',
  'string',
  'float',
  // 'decimal',
  'datetime'
] as const;

// export type DecimalPrecision = [precision: number, scale: number];
export type ColumnConstraint = [
  'isPk',
  'isAutoIncrement',
  'isCreateTimestamp',
  'isUpdateTimestamp',
  'isNullable',
  'stringMaxLength',
  // 'decimalPrecision',
];
export const DatetimeIsoPattern = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\.([0-9]+))?(Z)?$/;


export class Column {
  // readonly defaultDecimalPrecision: DecimalPrecision = [18, 0];

  public isPk = false;
  public isAutoIncrement = false;
  public isCreateTimestamp = false;
  public isUpdateTimestamp = false;
  public isNullable = false;

  public stringMaxLength: number | null = null;

  // public decimalPrecision: DecimalPrecision | null = null;

  constructor(public name: string, public datatype: typeof Datatype[number]) {
  }

  checkValue(value: any, ignore: ColumnConstraint[number][]): string[] | null {
    const errors: string[] = [];
    if (this.isPk && !ignore.includes('isPk')) {
      if (value === null) {
        errors.push('Pk cannot be null');
      }
    }
    // nullable
    if (this.isNullable && value !== null) {
      // integer
      if (this.datatype === 'integer') {
        if (!Number.isInteger(value)) {
          errors.push('No an integer');
        }
      }
      // datetime
      else if (this.datatype === 'datetime') {
        if (typeof value !== 'string' || !value.match(DatetimeIsoPattern)) {
          errors.push('Not an ISO datetime string');
        }
      }
      // float
      else if (this.datatype === 'float') {
        if (typeof value !== 'number' || Number.isNaN(value)) {
          errors.push('Not a float');
        }
      }
      // string
      else {
        if (typeof value !== 'string') {
          errors.push('Not a string');
        }
        // stringMaxLength
        else if (this.stringMaxLength &&
          !ignore.includes('stringMaxLength') &&
          value.length > this.stringMaxLength) {

          errors.push(`Cannot be longer than ${this.stringMaxLength} characters`);
        }
      }
    }

    return errors.length ? errors : null;
  }

  validate(): string[] | null {
    const errors: string[] = [];
    if (this.isPk) {
      if (this.isNullable) {
        errors.push('Pk cannot be null');
      }
    }
    if (this.isAutoIncrement) {
      if (this.datatype !== 'integer') {
        errors.push('Autoincrement must be integer');
      }
    }
    if (this.isCreateTimestamp || this.isUpdateTimestamp) {
      if (this.datatype !== 'datetime') {
        errors.push('Timestamp must be datetime');
      }
      if (this.isNullable) {
        errors.push('Timestamp cannot be nullable');
      }
    }
    if (this.stringMaxLength !== null) {
      if (this.datatype !== 'string') {
        errors.push('stringMaxLength can only be used on strings');
      } else if (!Number.isInteger(this.stringMaxLength) || this.stringMaxLength < 0) {
        errors.push('stringMaxLength must be an integer greater or equal zero');
      }
    }
    // if (this.decimalPrecision !== null) {
    //   if (this.datatype !== 'decimal') {
    //     errors.push('Decimal Precision can only be used on decimal');
    //   }
    // }

    return errors.length ? errors : null;
  }

}
