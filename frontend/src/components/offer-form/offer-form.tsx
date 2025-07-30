import {type ChangeEvent, FormEvent, useCallback, useState} from 'react';
import Select from 'react-select';

import {City, DetailOffer, Location, NewOffer} from '../../types/types';

import LocationPicker from '../location-picker/location-picker';
import { CityLocation } from '../../const';
import { capitalize } from '../../utils';
import {useAppSelector} from '../../hooks';
import {getCities, getFacilities, getTypes} from '../../store/site-data/selectors';

enum FormFieldName {
  title = 'title',
  description = 'description',
  cityId = 'cityId',
  previewImage = 'previewImage',
  isPremium = 'isPremium',
  type = 'type',
  bedrooms = 'bedrooms',
  maxAdults = 'maxAdults',
  price = 'price',
  good = 'good',
  image = 'image[]'
}

type OfferFormProps<T> = {
  offer: T;
  onSubmit: (offerData: T) => void;
};

const OfferForm = <T extends DetailOffer | NewOffer>({
  offer,
  onSubmit,
}: OfferFormProps<T>): JSX.Element => {
  const {
    title,
    description,
    city,
    previewImage,
    isPremium,
    type,
    bedrooms,
    maxAdults,
    price,
    goods: chosenGoods,
    location,
    images
  } = offer;
  const [chosenLocation, setChosenLocation] = useState<Location>(location);
  const [chosenCity, setChosenCity] = useState<City>(city);
  const [preview, setPreview] = useState<File | undefined>();
  const [photos, setImages] = useState<(File | undefined)[]>(
    Array(6).fill(undefined) // Replace numberOfImages with your desired count
  );
  const types = useAppSelector(getTypes);
  const facilities = useAppSelector(getFacilities);
  const cities = useAppSelector(getCities);

  const handlePreviewUpload = (evt: ChangeEvent<HTMLInputElement>) => {
    if (!evt.target.files) {
      return;
    }
    setPreview(evt.target.files[0]);
  };

  const handleImageUpload = (evt: ChangeEvent<HTMLInputElement>, index: number) => {
    if (!evt.target.files) {
      return;
    }

    setImages((prevImages) => {
      const newImages = [...prevImages];
      if (evt.target.files) {
        newImages[index] = evt.target.files[0];
      }
      return newImages;
    });
  };

  const handleCityChange = (value: keyof typeof CityLocation) => {
    if (cities) {
      setChosenCity(cities.find((el) => el.id === value) as City);
      setChosenLocation(cities.find((el) => el.id === value)?.location as Location ?? { latitude: 0, longitude: 0 } as Location);
    }
  };

  const handleLocationChange = useCallback(
    ({ lat, lng }: { lat: number; lng: number }) => {
      setChosenLocation({ latitude: lat, longitude: lng });
    },
    []
  );

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      ...offer,
      title: formData.get(FormFieldName.title),
      description: formData.get(FormFieldName.description),
      city: chosenCity,
      previewImage: formData.get(FormFieldName.previewImage),
      isPremium: Boolean(formData.get(FormFieldName.isPremium)),
      type: formData.get(FormFieldName.type),
      bedrooms: Number(formData.get(FormFieldName.bedrooms)),
      maxAdults: Number(formData.get(FormFieldName.maxAdults)),
      price: Number(formData.get(FormFieldName.price)),
      goods: formData.getAll(FormFieldName.good),
      location: chosenLocation,
      images: formData.getAll(FormFieldName.image),
    };

    onSubmit(data);
  };

  return (
    <form
      className="form offer-form"
      action="#"
      method="post"
      onSubmit={handleFormSubmit}
    >
      <fieldset className="title-fieldset">
        <div className="form__input-wrapper">
          <label htmlFor="title" className="title-fieldset__label">
            Title
          </label>
          <input
            className="form__input title-fieldset__text-input"
            placeholder="Title"
            name={FormFieldName.title}
            id="title"
            required
            defaultValue={title}
          />
        </div>
        <div className="title-fieldset__checkbox-wrapper">
          <input
            className="form__input"
            type="checkbox"
            name={FormFieldName.isPremium}
            id="isPremium"
            defaultChecked={isPremium}
          />
          <label htmlFor="isPremium" className="title-fieldset__checkbox-label">
            Premium
          </label>
        </div>
      </fieldset>
      <div className="form__input-wrapper">
        <label htmlFor="description" className="offer-form__label">
          Description
        </label>
        <textarea
          className="form__input offer-form__textarea"
          placeholder="Description"
          name={FormFieldName.description}
          id="description"
          required
          defaultValue={description}
        />
      </div>
      <div className="form__input-wrapper">
        <label htmlFor="previewImage" className="offer-form__label">
          Preview Image
        </label>
        <input
          className="visually-hidden"
          type="file"
          name={FormFieldName.previewImage}
          id="previewImage"
          accept="image/png, image/jpeg"
          onChange={handlePreviewUpload}
        />
        <label htmlFor="previewImage" className="register-form__avatar-label offer-form__text-input">
          {preview ? (
            <img
              src={URL.createObjectURL(preview)}
              alt="Image preview"
              className="register-form__avatar-preview"
            />
          ) : (
            'Upload preview image'
          )}
        </label>
      </div>
      <fieldset className="images-fieldset">
        {images.map((image, index) => (
          <div key={`image-${index}`} className="form__input-wrapper">
            <label htmlFor={`image-${index}`} className="offer-form__label">
              Offer Image #{index + 1}
            </label>
            <input
              className="visually-hidden"
              type="file"
              name={FormFieldName.image}
              id={`image-${index}`}
              accept="image/png, image/jpeg"
              onChange={(e) => handleImageUpload(e, index)}
            />
            <label htmlFor={`image-${index}`} className="register-form__avatar-label offer-form__text-input">
              {photos[index] ? (
                <img
                  src={photos[index]?.name ? URL.createObjectURL(photos[index]!) : ''}
                  alt={`Offer image ${index + 1} preview`}
                  className="register-form__avatar-preview"
                />
              ) : (
                `Upload offer image ${index + 1}`
              )}
            </label>
          </div>
        ))}

      </fieldset>
      <fieldset className="type-fieldset">
        <div className="form__input-wrapper">
          <label htmlFor="type" className="type-fieldset__label">
            Type
          </label>
          <Select
            className="type-fieldset__select"
            classNamePrefix="react-select"
            name={FormFieldName.type}
            id="type"
            defaultValue={type && typeof type === 'object' ? { value: type.id, label: capitalize(type.name) } : null}
            options={types?.map((typeItem) => ({
              value: typeItem.id,
              label: capitalize(typeItem.name),
            })) || []}
          />
        </div>
        <div className="form__input-wrapper">
          <label htmlFor="price" className="type-fieldset__label">
            Price
          </label>
          <input
            className="form__input type-fieldset__number-input"
            type="number"
            placeholder="100"
            name={FormFieldName.price}
            id="price"
            defaultValue={price}
          />
        </div>
        <div className="form__input-wrapper">
          <label htmlFor="bedrooms" className="type-fieldset__label">
            Bedrooms
          </label>
          <input
            className="form__input type-fieldset__number-input"
            type="number"
            placeholder="1"
            name={FormFieldName.bedrooms}
            id="bedrooms"
            required
            step={1}
            defaultValue={bedrooms}
          />
        </div>
        <div className="form__input-wrapper">
          <label htmlFor="maxAdults" className="type-fieldset__label">
            Max adults
          </label>
          <input
            className="form__input type-fieldset__number-input"
            type="number"
            placeholder="1"
            name={FormFieldName.maxAdults}
            id="maxAdults"
            required
            step={1}
            defaultValue={maxAdults}
          />
        </div>
      </fieldset>
      <fieldset className="goods-list">
        <h2 className="goods-list__title">Goods</h2>
        <ul className="goods-list__list">
          {facilities?.map((good) => (
            <li key={good.id} className="goods-list__item">
              <input
                type="checkbox"
                id={good.id}
                value={good.id}
                name={`${FormFieldName.good}`}
                defaultChecked={chosenGoods.includes(good.name)}
              />
              <label className="goods-list__label" htmlFor={good.id}>
                {good.name}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      <div className="form__input-wrapper location-picker">
        <label htmlFor="cityId" className="location-picker__label">
          Location
        </label>
        <Select
          className="location-picker__select"
          classNamePrefix="react-select"
          name={FormFieldName.cityId}
          id="cityId"
          defaultValue={{ value: city.name, label: city.name }}
          options={cities?.map((cityItem) => ({
            value: cityItem.id,
            label: cityItem.name,
          }))}
          onChange={(evt) => {
            if (evt) {
              handleCityChange(evt.value);
            }
          }}
        />
      </div>
      <LocationPicker
        city={chosenCity}
        onChange={handleLocationChange}
        location={chosenLocation}
      />
      <button className="form__submit button" type="submit">
        Save
      </button>
    </form>
  );
};

export default OfferForm;
