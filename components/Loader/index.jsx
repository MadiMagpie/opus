import React from 'react';
import loader from '../../public/loader.json';
import {useLottie} from 'lottie-react';

const style = {
       width: 60,
       zIndex: 50,
};
     
export const Loader = () => {
       const options = {
              animationData: loader,
              loop: false,
              autoplay: true,
       };
       const { View } = useLottie(options, style);
     
       return View;
};
