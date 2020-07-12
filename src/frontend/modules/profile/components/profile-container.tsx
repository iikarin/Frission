import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Profile } from './profile';

export const ProfileContainer: React.FunctionComponent<{}> = (): JSX.Element => {
  const { id } = useParams();
  return (
    <Profile id={id} />
  );
};