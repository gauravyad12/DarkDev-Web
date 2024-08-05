import { useDispatch } from 'react-redux';
import { useSelector } from '@/redux/store';
import { setLoaded } from '@/redux/slices/titleSlice';
import Backdrop from '@/assets/backdrop.webp';
import { IMAGE_BASE_URL, BACKDROP_SIZE } from '@/src/config';
import { Placeholder, Img, Background } from './TitleBackdropStyles';

interface Props {
  title: string;
  backdropPath: string | null;
}

const TitleBackdrop: React.VFC<Props> = ({ title, backdropPath }) => {
  const dispatch = useDispatch();
  const isLoaded = useSelector((state) => state.title.backdrop);
  return (
    <>
      <Placeholder>
        <Img
          alt={title}
          src={
            backdropPath
              ? `${IMAGE_BASE_URL}${BACKDROP_SIZE}${backdropPath}`
              : Backdrop
          }
          fade={isLoaded}
          onLoad={() => dispatch(setLoaded('backdrop'))}
        />
      </Placeholder>

      {backdropPath && (
        <Background
          alt={title}
          src={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${backdropPath}`}
          fade={isLoaded}
          onLoad={() => dispatch(setLoaded('backdrop'))}
        />
      )}
    </>
  );
};

export default TitleBackdrop;
