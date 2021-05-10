import {Measurement} from './Measurement';
import {TravelDestination} from './TravelDestination';

export interface ActiveDestination {
  destination: TravelDestination;
  measurement: Measurement;
}
