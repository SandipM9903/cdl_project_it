
import React, { useEffect, useState } from 'react';

const Avatar = () => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
      setImageUrl("https://joeschmoe.io/api/v1/random");
  }, []);

  console.log(imageUrl)

  return (
    <div>
      <img src={imageUrl} alt='Avatar' />
    </div>
  );
};

export default Avatar;
