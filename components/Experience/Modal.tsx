import styled from 'styled-components';

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
  backdrop-filter: blur(10px); /* Blur effect */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* Ensure it's above other content */
`;

const ModalContent = styled.div`
//   background: rgba(255, 255, 255, 0.8); /* Semi-transparent white */
//   backdrop-filter: blur(10px); /* Blur effect for content */
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  color: white;
  width: 90%;
  padding: 20px;
  z-index: 1000; /* Ensure content is above background */
  text-align: center;
`;

const Modal = ({ isOpen, onClose, data }: any) => {
    if (!isOpen) return null;
  
    return (
    <ModalBackground>
      <ModalContent>
        <h1>Milkybar</h1>
        <p>Description of the product goes here...</p>
        {/* Your modal content */}
        <button onClick={onClose}>Close</button>
      </ModalContent>
    </ModalBackground>
  );
};

export default Modal;
