import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IMAGE_BASE_URL, PHOTO_SIZE } from '@/src/config';
import Poster from '@/assets/poster.webp';
import { Column, Photo, Img, Name } from './TitleCastStyles';

interface Props {
  id: number;
  name: string;
  profilePath: string;
}

const TitleCast: React.VFC<Props> = ({ id, name, profilePath }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <Column>
      <Link to={`/person/${id}`}>
        <Photo>
          <Img
            src={
              profilePath
                ? `${IMAGE_BASE_URL}${PHOTO_SIZE}${profilePath}`
                : Poster
            }
            alt={name}
            fade={loaded}
            onLoad={() => setLoaded(true)}
          />
        </Photo>
        <Name>{name}</Name>
      </Link>
    </Column>
  );
};

export default TitleCast;
