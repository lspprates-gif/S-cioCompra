import React from 'react';
import RankingList from '../components/RankingList';
import { useVarzea } from '../hooks/useVarzea';

export const RankingTab: React.FC = () => {
  const { times, empresas, usuarios, isSupabaseLive, rankingSegment } = useVarzea();
  return (
    <RankingList 
      times={times} 
      empresas={empresas} 
      usuarios={usuarios} 
      isSupabaseLive={isSupabaseLive} 
      initialSegment={rankingSegment}
    />
  );
};
export default RankingTab;
