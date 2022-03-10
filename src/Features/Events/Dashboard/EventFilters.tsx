import * as React from 'react';
import Calendar from 'react-calendar';
import { Header, Menu } from 'semantic-ui-react';
import type { CriteriaKeys, FilterValues, EventSearchCriteria } from '../../../App/Shared/Types';
import { getStringFromDate } from '../../../App/Shared/Utils';
import { useAppDispatch, useAppSelector } from '../../../App/Store/hooks';
import {
  selectEventsIsLoading,
  selectEventsSearchCriteria,
  setSearchCriteria,
} from '../eventsSlice';
import styles from './EventFilters.module.css';

const EventFilters: React.FC = () => {
  const isLoadingEvents = useAppSelector(selectEventsIsLoading);
  const searchCriteria = useAppSelector(selectEventsSearchCriteria);
  const dispatch = useAppDispatch();

  const onUpdateSearchCriteria = (key: CriteriaKeys, value: FilterValues | string) => {
    const newCriteria: EventSearchCriteria = { ...searchCriteria, [key]: value };
    dispatch(setSearchCriteria(newCriteria));
  };

  return (
    <>
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
      <Header attached color='teal' content='Select date' icon='calendar' />
      <Calendar
        className={styles.Calendar}
        onChange={(date: Date) => onUpdateSearchCriteria('startDate', getStringFromDate(date))}
      />
    </>
  );
};

export default EventFilters;
