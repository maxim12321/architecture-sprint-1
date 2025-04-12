import React, {useEffect} from 'react';
import SuccessIcon from '../images/success-icon.svg';
import ErrorIcon from '../images/error-icon.svg';
import CloseIcon from 'libs/src/images/close.svg';

function InfoTooltip() {

  const closeStyle = { backgroundImage: `url(${CloseIcon})` };

  const [isOpen, setIsOpen] = React.useState(false);
  const [status, setStatus] = React.useState("");

  const icon = status === 'success' ? SuccessIcon : ErrorIcon
  const text = status === 'success' ? "Вы успешно зарегистрировались" : 
     "Что-то пошло не так! Попробуйте ещё раз.";

  useEffect(() => {
    addEventListener("login-result", handleLogin);
    return () => removeEventListener("login-result", handleLogin);
  }, []);

  function handleLogin(event) {
    if (!event.detail.successful) {
      setStatus("fail");
      setIsOpen(true);
    }
  }

  useEffect(() => {
    addEventListener("register-result", handleRegister);
    return () => removeEventListener("register-result", handleRegister);
  }, []);

  function handleRegister(event) {
    if (event.detail.successful) {
      setStatus("success");
      setIsOpen(true);
    }
    else {
      setStatus("fail");
      setIsOpen(true);
    };
  }

  useEffect(() => {
    addEventListener("close-popups", handleClosePopups);
    return () => removeEventListener("close-popups", handleClosePopups);
  }, []);

  function handleClosePopups(event) {
    setIsOpen(false);
  }

  function onClose() {
    dispatchEvent(new CustomEvent("close-popups", {}));
  }

  return (
    <div className={`popup ${isOpen && 'popup_is-opened'}`}>
      <div className="popup__content">
        <form className="popup__form" noValidate>
          <button type="button" className="popup__close" onClick={onClose} style={closeStyle}></button>
            <div>
              <img className="popup__icon" src={icon} alt=""/>
              <p className="popup__status-message">{text}</p>
            </div>
        </form>
      </div>
    </div>
  );
}

export default InfoTooltip;

 