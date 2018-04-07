import React from "react";
import * as workerTimers from "worker-timers";
import TimeInput from "../TimeInput";

const startTimer = (time, intervalId) => state => {
  return setTime(time)(setInterval(intervalId)(state));
};

const clearTimer = state => {
  return { ...state, intervalId: null, time: null };
};

const setTime = time => state => {
  return { ...state, time };
};

const setInterval = intervalId => state => {
  return { ...state, intervalId };
};

class Body extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      intervalId: null,
      time: null,
      inputTime: null
    };
  }

  render() {
    return (
      <div
        className="body flexCenter"
        style={{
          height: "100vh",
          width: "100%"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div
            style={{
              marginBottom: "10px",
              height: "200px",
              width: "160px",
              backgroundColor: "dodgerblue"
            }}
          />
          <div>Set steep time:</div>
          {!this.state.time ? (
            <TimeInput
              onChange={value => {
                this.setState(state => {
                  return { ...state, inputTime: value };
                });
              }}
            />
          ) : (
            <div>{this.state.time}</div>
          )}
          {this.state.intervalId !== null ? (
            <div
              style={{
                marginBottom: "10px",
                height: "80px",
                width: "160px",
                backgroundColor: "dodgerblue"
              }}
              onClick={() => {
                workerTimers.clearInterval(this.state.intervalId);
                this.setState(clearTimer);
              }}
            >
              Stop
            </div>
          ) : (
            <div
              style={{
                marginBottom: "10px",
                height: "80px",
                width: "160px",
                backgroundColor: "dodgerblue"
              }}
              onClick={() => {
                const intervalId = workerTimers.setInterval(() => {
                  const time = new Date().getTime();
                  console.log(time);
                }, 1000);
                this.setState(startTimer(this.state.inputTime, intervalId));
              }}
            >
              Start
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Body;
