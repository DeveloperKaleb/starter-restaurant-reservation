import React, { useState, useEffect } from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NewReservation from "./NewReservation";
import SeatReservation from "./SeatReservation";
import EditReservation from "./EditReservation";
import NewTable from "./NewTable";
import Search from "./Search";
import NotFound from "./NotFound";
import { useLocation } from "react-router-dom"
import { today, asDateString } from "../utils/date-time";
import { listReservations } from "../utils/api";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  let date = today()
  const { search } = useLocation()
  if (search) {
    const junkIndex = search.indexOf("=")
    const subDate = search.slice(junkIndex + 1)
    const dateObject = new Date(subDate + "T00:00:00")
    date = asDateString(dateObject)
  }
  const [currentDate, setCurrentDate] = useState(date)
  const [reservations, setReservations] = useState(null);
  const [reservationsError, setReservationsError] = useState(null);

  
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
      <Route path="/reservations/:reservation_id/seat">
        <SeatReservation />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <EditReservation reservations={reservations} setDay={setDay} setReservations={setReservations} reservationsError={reservationsError} setReservationsError={setReservationsError} />
      </Route>
      <Route path="/dashboard">
        <Dashboard reservations={reservations} setReservations={setReservations} reservationsError={reservationsError} setReservationsError={setReservationsError} date={currentDate} addDay={addDay} setDay={setDay} subtractDay={subtractDay} />
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
