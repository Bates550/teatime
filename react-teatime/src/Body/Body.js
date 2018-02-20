import React from 'react';

const Body = () => {
  return (
    <div
      className="body flexCenter"
      style={{
        height: '100vh',
        width: '100%',
      }}
    >
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ marginBottom: '10px', height: '200px', width: '160px', backgroundColor: 'dodgerblue' }} />
        <div>
          Set steep time:
        </div>
        <div style={{ marginBottom: '10px', height: '80px', width: '160px', backgroundColor: 'dodgerblue' }} />
        <div style={{ marginBottom: '10px', height: '80px', width: '160px', backgroundColor: 'dodgerblue' }} />
      </div>
    </div>
  );
};

export default Body;
