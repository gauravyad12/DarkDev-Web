import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from '@/redux/store';
import { fetchTitle, resetTitle } from '@/redux/slices/titleSlice';
import useMediaQuery from '../../hooks/useMediaQuery';
import sliceOverview from '@/utils/sliceOverview';
import Spinner from '../layout/Spinner';
import NotFound from '../layout/NotFound';
import TitleBackdrop from './TitleBackdrop';
import TitlePoster from './TitlePoster';
import TitleRating from './TitleRating';
import TitleCast from './TitleCast';
import TitleButtons from './TitleButtons';
import { Container, Card, Heading, Overview, Info, Row } from './TitleStyles';

const Title = () => {
  const [, mediaType, titleId] = useLocation().pathname.split('/');
  const dispatch = useDispatch();
  const matches = useMediaQuery('(min-width: 960px)');

  const { title, name, backdrop_path, poster_path, overview, vote_average } =
    useSelector((state) => state.title.title);

  const cast = useSelector((state) => state.title.cast);
  const error = useSelector((state) => state.title.error);

  useEffect(() => {
    dispatch(fetchTitle(mediaType, titleId));
    return () => {
      dispatch(resetTitle());
    };
  }, [mediaType, titleId, dispatch]);

  const heading = title || name;

  if (!error && !heading) return <Spinner />;
  if (error) return <NotFound />;

  return (
    <Container>
      <TitleBackdrop title={heading} backdropPath={backdrop_path} />
      <Card>
        {matches && <TitlePoster title={heading} posterPath={poster_path} />}
        <Info>
          <Heading>{heading}</Heading>
          <Overview>{matches ? sliceOverview(overview) : overview}</Overview>
          <TitleRating rating={vote_average} />
          <Row>
            {cast.length > 0 &&
              cast
                .slice(0, 4)
                .map((person) => (
                  <TitleCast
                    profilePath={person.profile_path}
                    name={person.name}
                    id={person.id}
                    key={person.credit_id}
                  />
                ))}
          </Row>
          <TitleButtons
            title={heading}
            id={titleId}
            mediaType={mediaType}
            posterPath={poster_path}
          />
        </Info>
      </Card>
    </Container>
  );
};

export default Title;
