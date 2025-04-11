import React from 'react';
import api from "../utils/api";
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';

import '../blocks/profile/profile.css';

function Profile() {

  const [currentUser, setCurrentUser] = React.useState({});
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);

  const imageStyle = { backgroundImage: `url(${currentUser.avatar})` };

  React.useEffect(() => {
    api
      .getUserInfo()
      .then((userData) => {
        setCurrentUser(userData);
        dispatchEvent(new CustomEvent("full-user-data", {
            detail: userData,
        }));
      })
      .catch((err) => console.log(err));
  }, []);

  React.useEffect(() => {
    addEventListener("close-popups", handleClosePopups);
    return () => removeEventListener("close-popups", handleClosePopups);
  }, []);

  function handleClosePopups(event) {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
  }

  function handleEditProfile() {
    setIsEditProfilePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleAddPlace() {
    dispatchEvent(new CustomEvent("add-place", {}));
  }

  function handleUpdateAvatar(avatarUpdate) {
    api
      .setUserAvatar(avatarUpdate)
      .then((newUserData) => {
        setCurrentUser(newUserData);
        handleClosePopup();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateUser(userUpdate) {
    api
      .setUserInfo(userUpdate)
      .then((newUserData) => {
        setCurrentUser(newUserData);
        handleClosePopup();
      })
      .catch((err) => console.log(err));
  }

  function handleClosePopup() {
    dispatchEvent(new CustomEvent("close-popups", {}));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <section className="profile page__section">
        <div className="profile__image" onClick={handleEditAvatarClick} style={imageStyle}></div>
        <div className="profile__info">
          <h1 className="profile__title">{currentUser.name}</h1>
          <button className="profile__edit-button" type="button" onClick={handleEditProfile}></button>
          <p className="profile__description">{currentUser.about}</p>
        </div>
        <button className="profile__add-button" type="button" onClick={handleAddPlace}></button>
      </section>
      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onUpdateUser={handleUpdateUser}
        onClose={handleClosePopup}
      />
      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onUpdateAvatar={handleUpdateAvatar}
        onClose={handleClosePopup}
      />
    </CurrentUserContext.Provider>
  )
}

export default Profile;
