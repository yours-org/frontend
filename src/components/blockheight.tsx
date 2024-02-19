import React from 'react';
import useChainInfo from '@/utils/hooks/useChainInfo';

const Blockheight: React.FC = () => {
  const { data, isLoading } = useChainInfo();

  return (
    <div>
      {isLoading ? (
        <p>Loading chain info...</p>
      ) : (
        <div className="flex text-sm ml-2">
          <div className='w-full text-gray-300'> Block Height: </div>
          <div className='w-full mr-2 text-xs text-right text-white'>{data?.tip} / {data?.blocks}</div>
        </div>
      )}
    </div>
  );
};

export default Blockheight;