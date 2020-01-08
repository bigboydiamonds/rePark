import React, { useContext, useState } from 'react';
import { Avatar } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { CssBaseline } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';
import { Checkbox } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { Box } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import {
  Link,
  useHistory,
  useLocation
} from 'react-router-dom';
import Copyright from '../CopyrightComponent/Copyright';
import { UserContext } from '../../contexts/UserContext';

//TODO: Add form validation before user can move on to secondary sign up page
//we need to validate user input on this form.
const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
    padding: '15px'

  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  text: {
    marginTop: '10px'
  }
}));

export default function SignUpInitial(props) {
  const classes = useStyles();
  let history = useHistory(); //this is the histroy of the client, 
  //pushing to this cause the client to move to a different part of the app
  let location = useLocation(); //need to research this

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pass, setPass] = useState(''); 
  const [email, setEmail] = useState(''); //need to add email

  const { user, updateUser
  } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        phone: phone,
        pass: pass,
        email: email, //email added
      }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(res => {
        updateUser({
          id: res,
          isLoggedIn: true,
          name: name,
          phone: phone,
          email: email, //update with email
        });
        if (res) {
          history.push('/signup2') // if user creation is successful, redirect signup2
        }
        else {
          history.push('/signup') // if user creation fails
        }
      })
      .then() //might want to delete this
      .catch(err => {
        console.log(err);
      });
  }
  const handleNameChange = e => {
    setName(e.target.value);
  }
  const handlePhoneChange = e => {
    setPhone(e.target.value);
  }
  const handlePassChange = e => {
    setPass(e.target.value);
  }
  const handleEmailChange = e => {
    setEmail(e.target.value);
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} method="POST" action="/signup" noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="name"
                name="name"
                variant="outlined"
                required
                fullWidth
                className={classes.text}
                id="name"
                label="Name"
                autoFocus
                value={name}
                onChange={handleNameChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                className={classes.text}
                id="phoneNumber"
                label="Phone Number"
                name="phoneNumber"
                autoComplete="phoneNum"
                value={phone}
                onChange={handlePhoneChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                className={classes.text}
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={pass}
                onChange={handlePassChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                className={classes.text}
                id="eMail"
                label="Email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={handleEmailChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid>
          </Grid>
          <Link to={`/signup2`}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleSubmit}
            >
              Sign Up
          </Button>
          </Link>
          <Grid container justify="center">
            <Grid item>
              <Link to={`/login`}>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
