import * as React from 'react';
import { Grid, Header } from 'semantic-ui-react';

const PhotoUpload: React.FC = () => (
  <Grid>
    <Grid.Column width={4}>
      <Header color='teal' content='Step 1 - Add Photo' sub />
    </Grid.Column>
    <Grid.Column width={1} />
    <Grid.Column width={4}>
      <Header color='teal' content='Step 2 - Resize' sub />
    </Grid.Column>
    <Grid.Column width={1} />
    <Grid.Column width={4}>
      <Header color='teal' content='Step 3 - Preview & Upload' sub />
    </Grid.Column>
  </Grid>
);

export default PhotoUpload;
