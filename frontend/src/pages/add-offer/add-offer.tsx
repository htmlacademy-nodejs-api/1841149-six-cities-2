import { NewOffer } from '../../types/types';
import { CITIES, CityLocation } from '../../const';
import OfferForm from '../../components/offer-form/offer-form';
import {useAppDispatch, useAppSelector} from '../../hooks';
import { postOffer } from '../../store/action';
import {getCities, getTypes} from '../../store/site-data/selectors';

const AddOffer = (): JSX.Element | null => {
  const dispatch = useAppDispatch();
  const types = useAppSelector(getTypes);
  const cities = useAppSelector(getCities);

  const handleFormSubmit = (offerData: NewOffer) => {
    dispatch(postOffer(offerData));
  };

  const emptyOffer: NewOffer = {
    title: '',
    description: '',
    city: cities ? cities[0] : { id: '123' ,name: CITIES[0], location: CityLocation[CITIES[0]] },
    previewImage: new Blob(),
    isPremium: false,
    type: types ? types[0] : null,
    bedrooms: 1,
    maxAdults: 1,
    price: 0,
    goods: [],
    location: CityLocation[CITIES[0]],
    images: new Array(6).fill('')
  };

  return (
    <main className="page__main">
      <div className="container">
        <section>
          <h1>Add new offer</h1>
          <OfferForm offer={emptyOffer} onSubmit={handleFormSubmit} />
        </section>
      </div>
    </main>
  );};

export default AddOffer;
