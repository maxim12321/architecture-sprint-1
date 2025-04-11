import React, { Suspense, lazy } from 'react';

function Main() {

  const Profile = lazy(() => import('profile/Profile').catch(() => {
      return {
        default: () => <div className="error">Profile component is not available!</div>
      };
    })
  );

  const Places = lazy(() => import('places/Places').catch(() => {
      return {
        default: () => <div className="error">Places component is not available!</div>
      };
    })
  );

  return (
    <main className="content">
      <Suspense fallback="<div>Loading Profile</div>">
        <Profile />
      </Suspense>
      <Suspense fallback="<div>Loading Places</div>">
        <Places />
      </Suspense>
    </main>
  );
}

export default Main;
