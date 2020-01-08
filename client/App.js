import React, { useContext } from 'react';
import LogInComponent from './components/LogInComponent/LogInComponent';
import SignUpInitial from './components/SignUpInitialComponent/SignUpInitial';
import SignUpSecondary from './components/SignUpSecondaryComponent/SignUpSecondary';
import MapComponent from './components/MapComponent/MapComponent';
import OnboardingComponent from "./components/OnboardingComponent/OnboardingComponent";
import { UserContext } from './contexts/UserContext';
import MainPage from './components/MainPage/MainPage';
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
  Link
} from "react-router-dom";
//imported features include larged React with Hooks (user Context), and various components built within the component folder.


//TODO: Add "/" route and corresponding component as a splash page for users who are not logged in
//TODO: Add a route for the actual app once a user has logged in
//TODO: Add a route for the users profile page
//
const App = () => {
  const { user } = useContext(UserContext) //user Context is where the user information is pulled/updated (via useContext)
  //This functions as a state for the 
  return (
    <Router>
      <Switch>
        <Route
          exact
          path="/"
          component={MainPage}
        >
          {/* {user.isLoggedIn ? <Redirect to="/main" /> : <Redirect to="/welcome" />} 
          we will use this when the authentication portion of the app is complete*/}
        </Route>
        <Route
          path="/main" //main is the Map
          exact
          component={MapComponent}
        />
        <Route
          path="/login" 
          exact
          component={LogInComponent}
        />
        <Route
          path="/signup"
          exact
          component={SignUpInitial}
        />
        <Route
          path="/signup2"//car details page
          exact
          component={SignUpSecondary}
        />
        
        <Route
          //TODO: I inserted a temporary path actually another prop should be passed as isLogged in
          path="/welcome"
          exact
          component={OnboardingComponent}
        />
      </Switch>
    </Router>
  )
};

export default App;
