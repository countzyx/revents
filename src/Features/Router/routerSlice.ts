import { Location } from 'history';
import { RootState } from '../../App/Store/store';

export const selectRouterPreviousLocation = (state: RootState): Location | null | undefined =>
  state.router.previousLocations && state.router.previousLocations[1].location;

export default selectRouterPreviousLocation;
