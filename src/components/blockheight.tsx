import React from 'react';
import useChainInfo from '@/utils/hooks/useChainInfo';

const Blockheight: React.FC = () => {
  const { data, isLoading } = useChainInfo();

  return (
    <div>
      {isLoading ? (
        <p>Loading chain info...</p>
      ) : (
        <div className="flex text-xs text-gray-300 ml-2">
          <div className='w-full'> As Of Block: </div>
          <div className='mr-2'>{data?.blocks}</div>
          </div>
      )}
    </div>
  );
};

export default Blockheight;