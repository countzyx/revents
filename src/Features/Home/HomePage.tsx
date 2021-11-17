import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Header, Icon, Image, Segment } from 'semantic-ui-react';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const onGetStartedClick = () => {
    navigate('/events');
  };

  return (
    <Segment inverted textAlign='center' vertical className={styles.mastHead}>
      <Container>
        <Header as='h1' inverted>
          <Image size='massive' src='/assets/logo.png' style={{ marginBotton: 12 }} />
          Re-vents
        </Header>
        <Button size='huge' inverted onClick={() => onGetStartedClick()}>
          Get Started
          <Icon name='arrow right' inverted />
        </Button>
      </Container>
    </Segment>
  );
};

export default HomePage;
