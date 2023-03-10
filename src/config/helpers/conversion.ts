import { z } from 'zod';

const stringToBool = (val: string | undefined): boolean | undefined =>
  val !== undefined && val !== ''
    ? ['1', 'true'].includes(val.toLowerCase())
    : undefined;

export const stringifiedBooleanZod = (defaultVal: boolean) => {
  return z.preprocess(stringToBool, z.boolean().default(defaultVal));
};

export const stringifiedOptionalBooleanZod = () => {
  return z.preprocess(stringToBool, z.boolean().optional());
};

const stringToInteger = (str: string | undefined): number | undefined =>
  str !== undefined ? parseInt(str) : undefined;

export const stringifiedIntegerZod = (defaultVal: number) => {
  return z.preprocess(stringToInteger, z.number().default(defaultVal));
};

export const stringifiedOptionalIntegerZod = () => {
  return z.preprocess(stringToInteger, z.number().optional());
};
