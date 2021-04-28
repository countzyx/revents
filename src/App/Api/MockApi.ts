import { EventInfo } from '../Shared/Types';
import { delay } from '../Shared/Utils';
import SampleData from './SampleData';

export const fetchSampleData = (): Promise<EventInfo[]> =>
  delay(1000).then(() => Promise.resolve(SampleData));

export default fetchSampleData;
