import { render, remove, RenderPosition } from '../framework/render';
import EditFormView from '../view/edit-form-view';
import { isEscapeKey } from '../utils/utils';
import { UserAction, UpdateType } from '../const';

export default class NewTripPointPresenter {
  #handleDataChange = null;
  #handleDestroy = null;
  #tripPointListContainer = null;

  #tripPointEditComponent = null;

  constructor({tripPointListContainer, onDataChange, onDestroy}) {
    this.#tripPointListContainer = tripPointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init(destinations, offers) {
    if (this.#tripPointEditComponent !== null) {
      return;
    }

    this.#tripPointEditComponent = new EditFormView({
      destinations: destinations,
      offers: offers,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      isEditForm: false
    });

    render(this.#tripPointEditComponent, this.#tripPointListContainer,
      RenderPosition.AFTERBEGIN);

    document.body.addEventListener('keydown', this.#ecsKeyDownHandler);
  }

  destroy() {
    if (this.#tripPointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#tripPointEditComponent);
    this.#tripPointEditComponent = null;

    document.body.removeEventListener('keydown', this.#ecsKeyDownHandler);
  }


  #ecsKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };

  setSaving() {
    this.#tripPointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#tripPointEditComponent.updateElement({
        isDisabled: false,
        isSavinf: false,
        isDeleting: false,
      });
    };

    this.#tripPointEditComponent.shake(resetFormState);
  }

  #handleFormSubmit = (tripPoint) => {
    this.#handleDataChange(
      UserAction.ADD_TRIPPOINT,
      UpdateType.MINOR,

      this.#deleteId(tripPoint)
    );

  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #deleteId = (tripPoint) => {
    delete tripPoint.id;
    return tripPoint;
  };

}
