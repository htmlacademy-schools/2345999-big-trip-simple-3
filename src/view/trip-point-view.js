import {capitalizeType, getItemFromItemsById} from '../utils/utils.js';
import { convertToEventDateTime, convertToEventDate, convertToDateTime, convertToTime } from '../utils/formatTime-Utils.js';
import AbstractView from '../framework/view/abstract-view.js';
import he from 'he';

const createOffersTemplate = (offers, offersIDs, type) => {
  const currentTypes = offers.find((el) => el.type === type);
  let currentTypeOffers = [];
  if (currentTypes) {
    currentTypeOffers = currentTypes.offers;
  }
  return currentTypeOffers.filter((el) => offersIDs.includes(el.id)).map((offer) => `
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`
  ).join('');
};

function createTripPointTemplate(tripPoint, destinations, offers) {
  const destination = getItemFromItemsById(destinations, tripPoint.destination);
  return (`
    <li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${convertToEventDateTime(tripPoint.dateFrom)}">${convertToEventDate(tripPoint.dateFrom)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${tripPoint.type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${capitalizeType(tripPoint.type)} ${he.encode(destination.name)}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${convertToDateTime(tripPoint.dateFrom)}">${convertToTime(tripPoint.dateFrom)}</time>
          &mdash;
          <time class="event__end-time" datetime="${convertToDateTime(tripPoint.dateTo)}">${convertToTime(tripPoint.dateTo)}</time>
        </p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${tripPoint.basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${createOffersTemplate(offers, tripPoint.offersIDs, tripPoint.type)}
      </ul>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`
  );
}

export default class TripPointView extends AbstractView {
  #tripPoint = null;
  #destinations = null;
  #offers = null;

  constructor({tripPoint, destinations, offers, onEditClick}) {
    super();
    this.#tripPoint = tripPoint;
    this.#destinations = destinations;
    this.#offers = offers;
    this._callback.onEditClick = onEditClick;
    setTimeout(() => this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler),2000);
  }

  get template() {
    let template = '';
    try {
      template = createTripPointTemplate(this.#tripPoint, this.#destinations, this.#offers);
    }
    catch(err) { location.reload(); }
    return template;
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.onEditClick();
  };

}
