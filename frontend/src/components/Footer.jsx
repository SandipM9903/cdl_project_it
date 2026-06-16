import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white text-center text-xs py-4 border-t mt-auto ">
      Powered By{" "}
      <a href="https://www.cms.co.in/" className="text-red-600 hover:underline">
        CMS Computers India Pvt. Ltd.
      </a>{" "}
      Copyright 2025. All Rights Reserved.
    </footer>
  );
};

export default Footer;
