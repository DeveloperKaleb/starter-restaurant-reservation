import React, { useState } from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NewReservation from "./NewReservation";
import NewTable from "./NewTable";
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

  const setDay = (day = null) => {
    if (day) {
      setCurrentDate(asDateString(day))
    } else {
    setCurrentDate(date)
    }
  } 

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <NewReservation setDay={setDay}/>
      </Route>
      <Route path="/dashboard">
        <Dashboard date={currentDate} addDay={addDay} setDay={setDay} subtractDay={subtractDay} />
      </Route>
      <Route exact={true} path="/tables/new">
        <NewTable />
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
