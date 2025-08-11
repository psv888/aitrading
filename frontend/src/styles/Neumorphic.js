import styled from 'styled-components';

// Theme variables
const getThemeColors = (isLightMode) => ({
  // Light mode colors (metallic paint effect)
  background: isLightMode 
    ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' 
    : '#23234b',
  cardBg: isLightMode 
    ? 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%)' 
    : '#23234b',
  buttonBg: isLightMode 
    ? 'linear-gradient(145deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)' 
    : '#23234b',
  text: isLightMode ? '#2c3e50' : '#ffffff',
  shadowDark: isLightMode ? 'rgba(0,0,0,0.15)' : '#181829',
  shadowLight: isLightMode ? 'rgba(255,255,255,0.9)' : '#2d2d5a',
  primary: isLightMode ? '#667eea' : '#3a3aff',
  primaryHover: isLightMode ? '#764ba2' : '#4a4aff',
  accent: isLightMode ? '#f093fb' : '#4a4aff',
  border: isLightMode ? 'rgba(255,255,255,0.3)' : '#2d2d5a',
  inputBg: isLightMode 
    ? 'linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%)' 
    : '#23234b',
  placeholder: isLightMode ? '#6c757d' : '#8888aa',
  // Metallic paint specific colors
  metallicLight: isLightMode ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.1)',
  metallicDark: isLightMode ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.3)',
  shimmer: isLightMode ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.1)'
});

export const NeumorphicCard = styled.div`
  background: ${props => getThemeColors(props.isLightMode).cardBg};
  border-radius: 20px;
  box-shadow: ${props => {
    const colors = getThemeColors(props.isLightMode);
    return props.isLightMode
      ? `12px 12px 24px ${colors.shadowDark},
         -12px -12px 24px ${colors.shadowLight},
         inset 1px 1px 2px ${colors.metallicLight},
         inset -1px -1px 2px ${colors.metallicDark}`
      : `12px 12px 24px ${colors.shadowDark},
         -12px -12px 24px ${colors.shadowLight}`;
  }};
  padding: 2rem;
  margin: 2rem 0;
  color: ${props => getThemeColors(props.isLightMode).text};
  border: ${props => props.isLightMode ? '1px solid rgba(255,255,255,0.2)' : 'none'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  ${props => props.isLightMode && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.4),
        transparent
      );
      transition: left 0.5s;
    }
    
    &:hover::before {
      left: 100%;
    }
  `}
`;

export const NeumorphicButton = styled.button`
  background: ${props => {
    const colors = getThemeColors(props.isLightMode);
    return props.isLightMode
      ? `linear-gradient(145deg, ${colors.buttonBg}, #e9ecef 50%, #dee2e6 100%)`
      : `linear-gradient(90deg, ${colors.buttonBg} 0%, #2d2d5a 100%)`;
  }};
  border-radius: 16px;
  box-shadow: ${props => {
    const colors = getThemeColors(props.isLightMode);
    return props.isLightMode
      ? `4px 4px 12px ${colors.shadowDark},
         -4px -4px 12px ${colors.shadowLight},
         inset 1px 1px 2px ${colors.metallicLight},
         inset -1px -1px 2px ${colors.metallicDark},
         0 0 8px ${colors.primary}40`
      : `4px 4px 12px ${colors.shadowDark},
         -4px -4px 12px ${colors.shadowLight},
         0 0 8px ${colors.primary}66`;
  }};
  color: ${props => getThemeColors(props.isLightMode).text};
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  ${props => props.isLightMode && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.6),
        transparent
      );
      transition: left 0.5s;
    }
  `}

  &:hover {
    background: ${props => {
      const colors = getThemeColors(props.isLightMode);
      return props.isLightMode
        ? `linear-gradient(145deg, ${colors.primary}, ${colors.primaryHover} 50%, ${colors.accent} 100%)`
        : `linear-gradient(90deg, ${colors.primary} 0%, ${colors.primaryHover} 100%)`;
    }};
    box-shadow: ${props => {
      const colors = getThemeColors(props.isLightMode);
      return props.isLightMode
        ? `6px 6px 16px ${colors.shadowDark},
           -6px -6px 16px ${colors.shadowLight},
           0 0 20px ${colors.primary}80,
           inset 1px 1px 3px ${colors.metallicLight}`
        : `6px 6px 16px ${colors.shadowDark},
           -6px -6px 16px ${colors.shadowLight},
           0 0 20px ${colors.primary}99`;
    }};
    transform: translateY(-2px);
    color: #ffffff;

    ${props => props.isLightMode && `
      &::before {
        left: 100%;
      }
    `}
  }

  &:active {
    box-shadow: ${props => {
      const colors = getThemeColors(props.isLightMode);
      return props.isLightMode
        ? `inset 2px 2px 8px ${colors.shadowDark},
           inset -2px -2px 8px ${colors.shadowLight}`
        : `inset 2px 2px 8px ${colors.shadowDark},
           inset -2px -2px 8px ${colors.shadowLight}`;
    }};
    background: ${props => {
      const colors = getThemeColors(props.isLightMode);
      return props.isLightMode
        ? `linear-gradient(145deg, #e9ecef, #dde2e6 50%, #ced4da 100%)`
        : `linear-gradient(90deg, ${colors.buttonBg} 0%, ${colors.buttonBg} 100%)`;
    }};
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    
    &:hover {
      background: ${props => {
        const colors = getThemeColors(props.isLightMode);
        return props.isLightMode
          ? `linear-gradient(145deg, ${colors.buttonBg}, #e9ecef 50%, #dee2e6 100%)`
          : `linear-gradient(90deg, ${colors.buttonBg} 0%, #2d2d5a 100%)`;
      }};
      box-shadow: ${props => {
        const colors = getThemeColors(props.isLightMode);
        return props.isLightMode
          ? `4px 4px 12px ${colors.shadowDark},
             -4px -4px 12px ${colors.shadowLight}`
          : `4px 4px 12px ${colors.shadowDark},
             -4px -4px 12px ${colors.shadowLight},
             0 0 8px ${colors.primary}66`;
      }};
      transform: none;
      color: ${props => getThemeColors(props.isLightMode).text};
    }
  }

  /* Selection state styles */
  &.selected {
    background: ${props => {
      const colors = getThemeColors(props.isLightMode);
      return props.isLightMode
        ? `linear-gradient(145deg, ${colors.primary}, ${colors.primaryHover} 50%, ${colors.accent} 100%)`
        : `linear-gradient(90deg, ${colors.primary} 0%, ${colors.buttonBg} 100%)`;
    }};
    box-shadow: ${props => {
      const colors = getThemeColors(props.isLightMode);
      return props.isLightMode
        ? `0 0 20px ${colors.primary}80,
           4px 4px 12px ${colors.shadowDark},
           -4px -4px 12px ${colors.shadowLight},
           inset 1px 1px 3px ${colors.metallicLight}`
        : `0 0 20px ${colors.primary}99,
           4px 4px 12px ${colors.shadowDark},
           -4px -4px 12px ${colors.shadowLight}`;
    }};
    color: #ffffff;
    font-weight: 700;
    
    &:hover {
      background: ${props => {
        const colors = getThemeColors(props.isLightMode);
        return props.isLightMode
          ? `linear-gradient(145deg, ${colors.primaryHover}, ${colors.primary} 50%, ${colors.accent} 100%)`
          : `linear-gradient(90deg, ${colors.primaryHover} 0%, ${colors.primary} 100%)`;
      }};
      box-shadow: ${props => {
        const colors = getThemeColors(props.isLightMode);
        return props.isLightMode
          ? `0 0 25px ${colors.primary}cc,
             6px 6px 16px ${colors.shadowDark},
             -6px -6px 16px ${colors.shadowLight},
             inset 1px 1px 3px ${colors.metallicLight}`
          : `0 0 25px ${colors.primary}cc,
             6px 6px 16px ${colors.shadowDark},
             -6px -6px 16px ${colors.shadowLight}`;
      }};
    }
  }
`;

export const NeumorphicInput = styled.input`
  background: ${props => getThemeColors(props.isLightMode).inputBg};
  border-radius: 12px;
  box-shadow: ${props => {
    const colors = getThemeColors(props.isLightMode);
    return props.isLightMode
      ? `inset 2px 2px 8px ${colors.shadowDark},
         inset -2px -2px 8px ${colors.shadowLight},
         inset 1px 1px 2px ${colors.metallicLight}`
      : `inset 2px 2px 8px ${colors.shadowDark},
         inset -2px -2px 8px ${colors.shadowLight}`;
  }};
  border: ${props => props.isLightMode ? '1px solid rgba(255,255,255,0.2)' : 'none'};
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: ${props => getThemeColors(props.isLightMode).text};
  margin-bottom: 1rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    box-shadow: ${props => {
      const colors = getThemeColors(props.isLightMode);
      return props.isLightMode
        ? `inset 2px 2px 8px ${colors.shadowDark},
           inset -2px -2px 8px ${colors.shadowLight},
           0 0 12px ${colors.primary}66,
           inset 1px 1px 2px ${colors.metallicLight}`
        : `inset 2px 2px 8px ${colors.shadowDark},
           inset -2px -2px 8px ${colors.shadowLight},
           0 0 12px ${colors.primary}66`;
    }};
    background: ${props => props.isLightMode 
      ? 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)' 
      : '#2a2a5a'};
  }

  &::placeholder {
    color: ${props => getThemeColors(props.isLightMode).placeholder};
  }
`;

export const NeumorphicLabel = styled.label`
  color: ${props => getThemeColors(props.isLightMode).text};
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: block;
`; 