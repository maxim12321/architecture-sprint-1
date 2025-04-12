import React, { useEffect } from 'react';
import Card from './Card';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
import PopupWithForm from './PopupWithForm';
import api from "../utils/api";
import { CurrentUserContext } from '../contexts/CurrentUserContext';

import '../blocks/places/places.css';

function Places() {

  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);

  useEffect(() => {
    addEventListener("full-user-data", handleFullUserData);
    return () => removeEventListener("full-user-data", handleFullUserData);
  }, []);

  function handleFullUserData(event) {
    setCurrentUser(event.detail);
  }

  useEffect(() => {
    addEventListener("add-place", handleAddPlaceClick);
    return () => removeEventListener("add-place", handleAddPlaceClick);
  }, []);

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  React.useEffect(() => {
    addEventListener("close-popups", handleClosePopups);
    return () => removeEventListener("close-popups", handleClosePopups);
  }, []);

  function handleClosePopups(event) {
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
  }

  function handleClosePopup() {
    dispatchEvent(new CustomEvent("close-popups", {}));
  }

  useEffect(() => {
    api
      .getCardList()
      .then((cardData) => {
        setCards(cardData);
      })
      .catch((err) => console.log(err));
  }, []);

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((cards) =>
          cards.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    api
      .removeCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit(newCard) {
    api
      .addCard(newCard)
      .then((newCardFull) => {
        setCards([newCardFull, ...cards]);
        handleClosePopup();
      })
      .catch((err) => console.log(err));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <section className="places page__section">
        <ul className="places__list">
          {cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
            />
          ))}
        </ul>
      </section>
      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onAddPlace={handleAddPlaceSubmit}
        onClose={handleClosePopup}
      />
      <ImagePopup card={selectedCard} onClose={handleClosePopup} />
      <PopupWithForm title="Вы уверены?" name="remove-card" buttonText="Да" />
    </CurrentUserContext.Provider>
  )
}

export default Places;
