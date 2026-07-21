import { IsInt, IsString, ValidateNested, validateSync, type ValidationError } from 'class-validator';

import { ValidationUtil } from './validation';

class AddressDto {
  @IsInt()
  zip!: number;
}

class CustomerDto {
  @IsString()
  name!: string;

  @ValidateNested()
  address!: AddressDto;
}

describe('ValidationUtil', () => {
  it('maps decorated and nested validation errors', () => {
    const customer = new CustomerDto();
    customer.name = 42 as unknown as string;
    customer.address = new AddressDto();
    customer.address.zip = 'invalid' as unknown as number;

    expect(ValidationUtil.mapValidationErrorsToObject(validateSync(customer))).toEqual({
      name: [{ name: 'isString', constraints: [] }],
      address: {
        zip: [{ name: 'isInt', constraints: ['zip must be an integer number'] }],
      },
    });
  });

  it('uses constraint messages when validation metadata is unavailable', () => {
    const error = {
      property: 'filter',
      constraints: { custom: 'Invalid filter.' },
    } as unknown as ValidationError;

    expect(ValidationUtil.mapValidationErrorsToObject([error])).toEqual({
      filter: [{ name: 'custom', constraints: ['Invalid filter.'] }],
    });
  });
});
