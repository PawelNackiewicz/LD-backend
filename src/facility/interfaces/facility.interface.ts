import { Document } from 'mongoose';

export interface FacilityProps {
  readonly name: string;
  readonly userId: string;
  readonly streetName: string;
  readonly houseNumber: string;
  readonly flatNumber: string;
  readonly city: string;
  readonly postcode: string;
  readonly phone: string;
  readonly description: string;
  readonly longitude: number;
  readonly latitude: number;
}

export type Facility = FacilityProps & Document;
