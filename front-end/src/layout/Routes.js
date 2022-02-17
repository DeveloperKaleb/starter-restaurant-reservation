import React, { useState } from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NewReservation from "./NewReservation";
import Search from "./Search";
import NotFound from "./NotFound";
import { today, asDateString } from "../utils/date-time";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const date = today()
  const [currentDate, setCurrentDate] = useState(date)
  
  const addDay = () => {setCurrentDate((prevDate) => {
    const cloneDate = new Date(prevDate + "T00:00:00")
    const newDate = cloneDate.getDate() + 1
    const setDate = cloneDate.setDate(newDate)
    return asDateString(new Date(setDate))
  })}

  const subtractDay = () => {setCurrentDate((prevDate) => {
    const cloneDate = new Date(prevDate + "T00:00:00")
    const newDate = cloneDate.getDate() - 1
    const setDate = cloneDate.setDate(newDate)
    return asDateString(new Date(setDate))
  })}

  const resetDay = () => {setCurrentDate(date)} 

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <NewReservation />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={currentDate} addDay={addDay} resetDay={resetDay} subtractDay={subtractDay} />
      </Route>
      <Route path="/search">
        <Search />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
