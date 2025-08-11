import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

const ToggleContainer = styled.div`
  position: relative;
  width: 60px;
  height: 30px;
  background: ${props => props.isLightMode 
    ? 'linear-gradient(145deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)' 
    : 'linear-gradient(145deg, #2a2a5a 0%, #1a1a3a 100%)'};
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.isLightMode
    ? 'inset 2px 2px 5px rgba(0,0,0,0.1), inset -2px -2px 5px rgba(255,255,255,0.8), 0 2px 8px rgba(0,0,0,0.1)'
    : 'inset 2px 2px 5px rgba(0,0,0,0.3), inset -2px -2px 5px rgba(255,255,255,0.1)'};
  border: ${props => props.isLightMode ? '1px solid rgba(255,255,255,0.3)' : 'none'};
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: ${props => props.isLightMode 
      ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
      : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)'};
    transition: left 0.5s;
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: ${props => props.isLightMode
      ? 'inset 2px 2px 5px rgba(0,0,0,0.15), inset -2px -2px 5px rgba(255,255,255,0.9), 0 4px 12px rgba(0,0,0,0.15), 0 0 15px rgba(102, 126, 234, 0.3)'
      : 'inset 2px 2px 5px rgba(0,0,0,0.4), inset -2px -2px 5px rgba(255,255,255,0.15), 0 0 15px rgba(58, 58, 255, 0.3)'};
    
    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ToggleSwitch = styled.div`
  position: absolute;
  top: 2px;
  left: ${props => props.isLightMode ? '32px' : '2px'};
  width: 26px;
  height: 26px;
  background: ${props => props.isLightMode
    ? 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%)'
    : 'linear-gradient(145deg, #4a4aff 0%, #3a3aff 100%)'};
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.isLightMode
    ? '2px 2px 4px rgba(0,0,0,0.2), -1px -1px 2px rgba(255,255,255,0.8), inset 1px 1px 2px rgba(255,255,255,0.8)'
    : '2px 2px 4px rgba(0,0,0,0.4), -1px -1px 2px rgba(255,255,255,0.1)'};
  border: ${props => props.isLightMode ? '1px solid rgba(255,255,255,0.3)' : 'none'};

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 12px;
    height: 12px;
    background: ${props => props.isLightMode
      ? 'radial-gradient(circle, #ffd700 0%, #ffed4e 50%, #ffd700 100%)'
      : 'radial-gradient(circle, #ffffff 0%, #f0f0f0 50%, #ffffff 100%)'};
    border-radius: 50%;
    opacity: 0.8;
    box-shadow: ${props => props.isLightMode 
      ? '0 0 4px rgba(255, 215, 0, 0.6)'
      : '0 0 4px rgba(255, 255, 255, 0.6)'};
  }

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    height: 50%;
    background: ${props => props.isLightMode
      ? 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, transparent 100%)'
      : 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)'};
    border-radius: 50% 50% 0 0;
  }
`;

const IconContainer = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: ${props => props.isLightMode ? '#ffd700' : '#ffffff'};
  transition: all 0.3s ease;
  text-shadow: ${props => props.isLightMode 
    ? '0 0 4px rgba(255, 215, 0, 0.6)'
    : '0 0 4px rgba(255, 255, 255, 0.6)'};
  
  &.sun {
    left: 8px;
    opacity: ${props => props.isLightMode ? '1' : '0.3'};
  }
  
  &.moon {
    right: 8px;
    opacity: ${props => props.isLightMode ? '0.3' : '1'};
  }
`;

const ThemeToggle = () => {
  const { isLightMode, toggleTheme } = useTheme();

  return (
    <ToggleContainer isLightMode={isLightMode} onClick={toggleTheme}>
      <IconContainer isLightMode={isLightMode} className="sun">
        ☀️
      </IconContainer>
      <IconContainer isLightMode={isLightMode} className="moon">
        🌙
      </IconContainer>
      <ToggleSwitch isLightMode={isLightMode} />
    </ToggleContainer>
  );
};

export default ThemeToggle; 