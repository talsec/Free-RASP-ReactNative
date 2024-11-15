import { Threat } from './threat';

export const getThreatCount = (): number => {
  return Threat.getValues().length;
};

export const itemsHaveType = (data: any[], desidedType: string) => {
  return data.every((item) => typeof item === desidedType);
};
