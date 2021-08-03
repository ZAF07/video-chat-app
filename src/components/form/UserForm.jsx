import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import {
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  Button,
  Grid,
  Container,
} from '@material-ui/core';

const useStyles = makeStyles({
  topInput: {
    marginBottom: '3%',
    marginTop: '3%',
    width: '100%',
  },
});

function UserForm(props) {
  const styles = useStyles();
  const { addNewUser } = props;

  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);

  // const handleSubmitNewUser = () => {
  //   addnewUser(name, email);
  // };

  return (
    <>
      <Container maxWidth="xl">
        <Grid item xs={12}>

          <FormControl className={styles.topInput}>
            <InputLabel htmlFor="name">Your name please</InputLabel>
            <Input id="name" aria-describedby="my-helper-text" onChange={(e) => setName(e.target.value)} />
          </FormControl>
        </Grid>
        <Grid item xs={12}>

          <FormControl className={styles.topInput}>
            <InputLabel htmlFor="my-input">Email address</InputLabel>
            <Input id="my-input" aria-describedby="my-helper-text" onChange={(e) => setEmail(e.target.value)} />
            <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={() => addNewUser(name, email)}>Submit</Button>
        </Grid>
      </Container>
    </>
  );
}

export default UserForm;
