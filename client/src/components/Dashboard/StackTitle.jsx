import React from 'react';

const StackTitle = ({ title }) => {
  return (
    <div className="border-b pb-2">
      <h1 className="font-semibold text-zinc-800 text-center">{title}</h1>
    </div>
  );
};

export default StackTitle;
