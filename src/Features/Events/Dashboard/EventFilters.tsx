import * as React from 'react';
import Calendar from 'react-calendar';
import { Header, Menu } from 'semantic-ui-react';
import { selectAuthIsAuthed } from 'src/Features/Auth/authSlice';
import type { CriteriaKeys, FilterValues, EventSearchCriteria } from '../../../App/Shared/Types';
import { getDateTimeStringFromDate } from '../../../App/Shared/Utils';
import { useAppDispatch, useAppSelector } from '../../../App/Store/hooks';
import {
  clearEvents,
  getAllEvents,
  selectEventsIsLoading,
  selectEventsSearchCriteria,
  setSearchCriteria,
} from '../eventsSlice';
import styles from './EventFilters.module.css';

const EventFilters: React.FC = () => {
  const isAuthed = useAppSelector(selectAuthIsAuthed);
  const isLoadingEvents = useAppSelector(selectEventsIsLoading);
  const searchCriteria = useAppSelector(selectEventsSearchCriteria);
  const dispatch = useAppDispatch();

  const onUpdateSearchCriteria = (key: CriteriaKeys, value: FilterValues | string) => {
    const newCriteria: EventSearchCriteria = { ...searchCriteria, [key]: value };
    dispatch(setSearchCriteria(newCriteria));
    dispatch(clearEvents());
    dispatch(getAllEvents());
  };

  return (
    <>
      {isAuthed && (
        <Menu className={styles.FilterMenu} size='large' vertical>
          <Header attached color='teal' content='Filters' icon='filter' />
          <Menu.Item
            active={searchCriteria.filter === 'all'}
            content='All events'
            disabled={isLoadingEvents}
            onClick={() => onUpdateSearchCriteria('filter', 'all')}
          />
          <Menu.Item
            active={searchCriteria.filter === 'isGoing'}
            content="I'm going"
            disabled={isLoadingEvents}
            onClick={() => onUpdateSearchCriteria('filter', 'isGoing')}
          />
          <Menu.Item
            active={searchCriteria.filter === 'isHost'}
            content="I'm hosting"
            disabled={isLoadingEvents}
            onClick={() => onUpdateSearchCriteria('filter', 'isHost')}
          />
        </Menu>
      )}
      <Header attached color='teal' content='Select date' icon='calendar' />
      <Calendar
        className={styles.Calendar}
        onChange={(date: Date) =>
          onUpdateSearchCriteria('startDate', getDateTimeStringFromDate(date))
        }
      />
    </>
  );
};

export default EventFilters;
