import React from "react";

const displayDigits = digits => {
  const minutes = digits.slice(-4, -2).join("");
  const seconds = digits.slice(-2).join("");
  return `${minutes}:${seconds}`;
};

const deleteLastCharacter = state => {
  if (state.digits.length > 4) {
    return { ...state, digits: state.digits.slice(0, -1) };
  }
  return { ...state };
};

const addCharacter = char => state => {
  return {
    ...state,
    digits: state.digits.concat(`${char}`)
  };
};

class TimeInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      digits: ["0", "0", "0", "0"]
    };
  }

  setStateAndChange = reducer => {
    this.setState(reducer, () => {
      this.props.onChange(displayDigits(this.state.digits));
    });
  };

  render() {
    return (
      <input
        onKeyDown={e => {
          const key = e.key;
          if (key === "Backspace") {
            this.setStateAndChange(deleteLastCharacter);
          } else if (key.match(/[0-9]/)) {
            this.setStateAndChange(addCharacter(key));
          }
        }}
        onChange={() => {
          /* This is here to prevent a warning requiring that an onchange 
           * handler be defined. All the logic is handled in onKeyDown because 
           * it seemed easier to reason about that way. 
           */
        }}
        value={displayDigits(this.state.digits)}
      />
    );
  }
}

export default TimeInput;
