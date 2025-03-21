'use client';

import { memo, CSSProperties } from 'react';

function AnnotationNode({
  data,
}: {
  data: { arrowStyle: CSSProperties | undefined; level: number; label: string };
}) {
  return (
    <div className='px-4 py-2 shadow-md rounded-md w-16'>
      <div className=' text-left font-mono text-base text-[#683bfa]'>
        <div className='mr-1 '>{data.level}.</div>
        <div className=''>{data.label}</div>
      </div>
      {data.arrowStyle && (
        <div className='absolute text-2xl' style={data.arrowStyle}>
          ⤹
        </div>
      )}
    </div>
  );
}

export default memo(AnnotationNode);
