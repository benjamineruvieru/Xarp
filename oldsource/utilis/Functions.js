import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../oldsource/constants/Variables';

export const getPercentHeight = percent => {
  return (percent / 100) * SCREEN_HEIGHT;
};
export const getPercentWidth = percent => {
  return (percent / 100) * SCREEN_WIDTH;
};

export const spawn = () => {
  const x = Math.floor(Math.random() * (250 - 50 + 1) + 20);
  const y = Math.floor(Math.random() * (400 - 300 - 70 + 1) + 70);
  return {x, y};
};
