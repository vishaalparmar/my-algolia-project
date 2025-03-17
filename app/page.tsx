import React from 'react';
import Search from '../components/Search';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Algolia Search</h1>
      <Search />
    </div>
  );
};

export default Home;
