
import React from 'react';
import { useParams } from 'react-router-dom';

const SubscriberDetail = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Subscriber Detail</h1>
        <p className="text-gray-600">Subscriber ID: {id}</p>
        <p className="text-gray-600">Subscriber detail content coming soon...</p>
      </div>
    </div>
  );
};

export default SubscriberDetail;
