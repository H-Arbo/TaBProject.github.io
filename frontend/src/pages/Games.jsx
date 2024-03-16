import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Loading from '../components/Loading';
import Pat_Navbar from '../components/Pat_Navbar';

const Games = () => {

  return (
    <>
      <Pat_Navbar />
      <div className='p-4'>
        <BackButton />

        <h1 className='text-3xl my-4'>Games</h1>

      </div>
    </>
  );
};

export default Games;