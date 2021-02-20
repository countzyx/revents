import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import EventForm from '../Form/EventForm';
import EventList from './EventsList';
import SampleData from '../../../App/Api/SampleData';
import type { EventInfo } from '../../../Shared/Types';

type Props = {
  isFormOpen: boolean;
  onCloseEventForm: () => void;
};

type State = {
  events: EventInfo[];
};

const initialState: State = {
  events: SampleData,
};

const EventDashboard: React.FC<Props> = (props: Props) => {
  const { isFormOpen, onCloseEventForm } = props;
  const [eventsState] = React.useState(initialState);

  return (
    <Grid>
      <Grid.Column width={10}>
        <EventList events={eventsState.events} />
      </Grid.Column>
      <Grid.Column width={6}>{isFormOpen && <EventForm onCloseEventForm={onCloseEventForm} />}</Grid.Column>
    </Grid>
  );
};

export default EventDashboard;
