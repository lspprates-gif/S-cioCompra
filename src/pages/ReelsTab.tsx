import React from 'react';
import VideoFeed from '../components/VideoFeed';
import { useVarzea } from '../hooks/useVarzea';

export const ReelsTab: React.FC = () => {
  const { videos, handleClaimCouponFromReels } = useVarzea();
  return (
    <VideoFeed 
      videos={videos} 
      onClaimCoupon={handleClaimCouponFromReels} 
    />
  );
};
export default ReelsTab;
