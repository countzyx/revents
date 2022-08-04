// Actually not a real slice but a stub for extra functionality to support the Redux-First-History router
import { Location } from 'history';
import { RootState } from '../../App/Store/store';

export const selectRouterPreviousLocation = (state: RootState): Location | null | undefined =>
  state.router.previousLocations && state.router.previousLocations[1].location;

export default selectRouterPreviousLocation;
