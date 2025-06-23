import React from 'react';

interface KategoriCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
}

const KategoriCard: React.FC<KategoriCardProps> = ({ title, icon, description }) => {
  return (
    <div className="border border-gray-300 p-5 rounded-lg bg-gray-50">
      <div className="text-3xl text-gray-700">
        {icon}
      </div>
      <h3 className="text-lg font-bold mt-3 text-gray-900">{title}</h3>
      <p className="text-base text-gray-600 mt-2">{description}</p>
    </div>
  );
};

export default KategoriCard;
