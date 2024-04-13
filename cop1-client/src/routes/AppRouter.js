import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
//import HomePage from './containers/HomePage';
//import EventsPage from './containers/EventsPage';

const AppRouter = () => (
    <Router>
        <Switch>
            <Route path="/" exact component={HomePage} />
            <Route path="/events" component={EventsPage} />
        </Switch>
    </Router>
);

export default AppRouter;
