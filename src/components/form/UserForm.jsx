import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import {
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  Button,
} from '@material-ui/core';

const useStyles = makeStyles({
  topInput: {
    marginBottom: '3%',
    marginTop: '3%',
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
      <FormControl className={styles.topInput}>
        <InputLabel htmlFor="name">Your name please</InputLabel>
        <Input id="name" aria-describedby="my-helper-text" onChange={(e) => setName(e.target.value)} />
      </FormControl>

      <FormControl>
        <InputLabel htmlFor="my-input">Email address</InputLabel>
        <Input id="my-input" aria-describedby="my-helper-text" onChange={(e) => setEmail(e.target.value)} />
        <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
      </FormControl>
      <Button onClick={() => addNewUser(name, email)}>Submit</Button>

    </>
  );
}

export default UserForm;
