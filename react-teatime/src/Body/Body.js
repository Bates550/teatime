import React from "react";
import * as workerTimers from "worker-timers";
import * as R from "ramda";
import TimeInput from "../TimeInput";
import StartStopButton from "../StartStopButton";

const formattedTimeToMs = formattedTime => {
  const [minutes, seconds] = formattedTime.split(":");
  const minutesInMs = parseInt(minutes, 10) * 60 * 1000;
  const secondsInMs = parseInt(seconds, 10) * 1000;
  return minutesInMs + secondsInMs;
};

const msToFormattedTime = ms => {
  const MS_PER_SECOND = 1000;
  const MS_PER_MINUTE = MS_PER_SECOND * 60;
  const minutes = Math.trunc(ms / MS_PER_MINUTE);
  const secondsInMs = ms % MS_PER_MINUTE;
  const seconds = Math.trunc(secondsInMs / MS_PER_SECOND);
  const secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`;
  const result = `${minutes}:${secondsString}`;
  return result;
};

const startTimer = (time, intervalId) => state => {
  return R.pipe(setInitialTime(time), setDelta(0), setInterval(intervalId))(
    state
  );
};

const clearTimer = state => {
  return {
    ...state,
    intervalId: null,
    delta: null,
    initialTime: null,
    inputTime: "00:00"
  };
};

const setDelta = delta => state => {
  return { ...state, delta };
};

const setInterval = intervalId => state => {
  return { ...state, intervalId };
};

const setInitialTime = initialTime => state => {
  return { ...state, initialTime };
};

class Body extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      intervalId: null,
      delta: null,
      inputTime: "00:00",
      initialTime: null
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
          {!this.state.delta ? (
            <TimeInput
              onChange={value => {
                this.setState(state => {
                  return { ...state, inputTime: value };
                });
              }}
            />
          ) : (
            <div>
              {msToFormattedTime(
                formattedTimeToMs(this.state.inputTime) - this.state.delta
              )}
            </div>
          )}
          {this.state.inputTime !== "00:00" && (
            <StartStopButton
              isTimerRunning={this.state.intervalId !== null}
              onStartClick={() => {
                workerTimers.clearInterval(this.state.intervalId);
                this.setState(clearTimer);
              }}
              onStopClick={() => {
                const intervalId = workerTimers.setInterval(() => {
                  const time = new Date().getTime();
                  const delta = time - this.state.initialTime;
                  this.setState(setDelta(delta));
                  if (delta >= formattedTimeToMs(this.state.inputTime)) {
                    workerTimers.clearInterval(this.state.intervalId);
                    this.setState(clearTimer);
                  }
                }, 100);
                const time = new Date().getTime();
                this.setState(startTimer(time, intervalId));
              }}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Body;
