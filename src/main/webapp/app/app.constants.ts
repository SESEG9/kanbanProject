// These constants are injected via webpack DefinePlugin variables.
// You can add more variables in webpack.common.js or in profile specific webpack.<dev|prod>.js files.
// If you change the values in the webpack config files, you need to re run webpack to update the application

declare const __DEBUG_INFO_ENABLED__: boolean;
declare const __VERSION__: string;

export const VERSION = __VERSION__;
export const DEBUG_INFO_ENABLED = __DEBUG_INFO_ENABLED__;

export const rooms = [
  {
    id: 1,
    title: 'Luxury Sweet',
    image: 'luxury.jpg',
    price: '379€',
    description:
      'Unsere Luxury Sweet im obersten Stockwerk bietet Ihnen ein King-Size Bett, als auch einen Whirlpool zum entspanne. Auf Ihrem großen Balkon haben Sie einen wunderschönen Blick auf das Meer.',
  },
  {
    id: 2,
    title: 'Presidentschal Sweet',
    image: 'presidential.jpg',
    price: '280€',
    description: 'Unsere Presidentschal Sweet bietet Ihnen ein Queen-Size Bett, als auch direkten Blick zum Meer.',
  },
  {
    id: 3,
    title: 'Doppelzimmer Meerblick',
    image: 'dz-sea.jpg',
    price: '140€',
    description: 'Doppelzimmer mit Blick aufs Meer!',
  },
  {
    id: 4,
    title: 'Doppelzimmer ohne Meerblick',
    image: 'dz-no-sea.jpg',
    price: '110€',
    description: 'Doppelzimmer ohne Blick aufs Meer!',
  },
  {
    id: 5,
    title: 'Einzelzimmer Meerblick',
    image: 'ez-sea.jpg',
    price: '90€',
    description: 'Einzelzimmer mit Flat-Screen',
  },
];

export const HOTEL_ADDRESS = 'Karlsplatz 1, 1010 Wien';
