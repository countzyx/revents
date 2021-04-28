import * as React from 'react';
import Calendar from 'react-calendar';
import { Header, Menu } from 'semantic-ui-react';
import styles from './EventFilters.module.css';

const EventFilters: React.FC = () => (
  <>
    <Menu className={styles.FilterMenu} size='large' vertical>
      <Header attached color='teal' content='Filters' icon='filter' />
      <Menu.Item content='All events' />
      <Menu.Item content="I'm going" />
      <Menu.Item content="I'm hosting" />
    </Menu>
    <Header attached color='teal' content='Select date' icon='calendar' />
    <Calendar className={styles.Calendar} />
  </>
);

export default EventFilters;
