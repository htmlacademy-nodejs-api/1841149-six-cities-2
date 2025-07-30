import { useCallback } from 'react';


import type { CityName } from '../../types/types';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setCity } from '../../store/site-process/site-process';
import City from '../city/city';
import { getCity } from '../../store/site-process/selectors';
import {getCities} from '../../store/site-data/selectors';

const CitiesList = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const activeCity = useAppSelector(getCity);
  const cities = useAppSelector(getCities);


  const handleCityClick = useCallback((name: CityName) => {
    dispatch(setCity(name));
  }, [dispatch]);

  return (
    <ul className="locations__list tabs__list">
      {cities?.map((city) => (
        <City key={city.id} name={city.name} isActive={city.name === activeCity.name} onClick={handleCityClick} />
      ))}
    </ul>
  );
};

export default CitiesList;
