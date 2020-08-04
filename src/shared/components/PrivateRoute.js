import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isForbidden } from '../helpers/isForbidden';

const PrivateRoute = ({component: Component, ...rest}) => {
    return (

        // Show the component only when the user is not forbidden in
        // Otherwise, redirect the user to '/' page
        <Route {...rest} render={props => (
            !isForbidden() ?
                <Component {...props} />
            : <Redirect to="/" />
        )} />
    );
};

export default PrivateRoute;