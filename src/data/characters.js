// Temporary compatibility layer for character data
// TODO: Migrate to Clean Architecture

export const characters = [
  {
    id: 1,
    name: '기본 캐릭터',
    image: '/images/char1.png',
    unlocked: true,
    price: null // 기본 캐릭터는 무료
  },
  {
    id: 2,
    name: '프리미엄 캐릭터',
    image: '/images/char2.png', 
    unlocked: false,
    price: {
      fireJelly: 3000
    }
  },
  {
    id: 3,
    name: '기본 캐릭터',
    image: '/images/char1.png',
    unlocked: false,
    price: {
      heartJelly: 4000
    }
  },
  {
    id: 4,
    name: '프리미엄 캐릭터',
    image: '/images/char2.png',
    unlocked: false,
    price: {
      lightJelly: 5000
    }
  },
  {
    id: 5,
    name: '기본 캐릭터',
    image: '/images/char1.png',
    unlocked: false,
    price: {
      fireJelly: 3000,
      heartJelly: 2000
    }
  }
];

export default characters;