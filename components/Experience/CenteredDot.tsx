import styled from 'styled-components';

const CenteredDot = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1000;
`;

export default CenteredDot;