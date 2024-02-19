import React from 'react';
import useChainInfo from '@/utils/hooks/useChainInfo';

const Blockheight: React.FC = () => {
  const { data, isLoading, lastProcessed } = useChainInfo();

  return (
    <div className="bg-[#17191E] rounded-lg p-2">
      {isLoading ? (
        <p className="text-sm text-gray-300">Loading chain info...</p>
      ) : (
        <div className="text-sm flex justify-between items-center">
          <span className="text-gray-300">Block height</span>
          <span className="text-white">{lastProcessed} / {data?.blocks}</span>
        </div>
      )}
    </div>
  );
};

export default Blockheight;
