import { Offer } from '../../types/types';

import { useAppDispatch, useAppSelector } from '../../hooks';
import {postFavorite, deleteFavorite, fetchOffers, fetchFavoriteOffers} from '../../store/action';
import { getIsAuthorized } from '../../store/user-process/selectors';

type BookmarkProps = {
    id: Offer['id'];
    isActive: boolean;
    place?: 'place-card' | 'property'
}

const Bookmark = ({ id, isActive, place = 'place-card' }: BookmarkProps) => {
  const dispatch = useAppDispatch();
  const isAuthorized = useAppSelector(getIsAuthorized);

  const handleButtonClick = async () => {
    if (isActive) {
      await dispatch(deleteFavorite(id));
      await dispatch(fetchOffers());
      await dispatch(fetchFavoriteOffers());
    } else {
      await dispatch(postFavorite(id));
      await dispatch(fetchOffers());
      await dispatch(fetchFavoriteOffers());
    }
  };

  return (
    <button
      onClick={handleButtonClick}
      className={`${place}__bookmark-button button${(isActive && isAuthorized) ? ` ${place}__bookmark-button--active` : ''
      }`}
      type="button"
    >
      <svg className="place-card__bookmark-icon" width={place === 'property' ? 31 : 18} height={place === 'property' ? 33 : 19}>
        <use xlinkHref="#icon-bookmark"></use>
      </svg>
      <span className="visually-hidden">{(isActive && isAuthorized) ? 'From' : 'To'} bookmarks</span>
    </button>
  );
};

export default Bookmark;
