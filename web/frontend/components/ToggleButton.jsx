import React from 'react';
import PropTypes from 'prop-types';
import './ToggleSwitch.css'; 

const ToggleSwitch = ({ checked, onChange, round }) => {
  const sliderClass = round ? 'slider round' : 'slider';

  return (
    <label className={`switch ${round ? 'round' : ''}`}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className={sliderClass}></span>
    </label>
  );
};

ToggleSwitch.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  round: PropTypes.bool,
};

export default ToggleSwitch;
