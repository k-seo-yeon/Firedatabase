const characters = [
  { 
    id: 1, 
    name: "캐릭터1", 
    image: "/images/char1.png", 
    unlocked: true, // 기본 캐릭터는 해금되어 있음
    unlockCost: { A: 0, B: 0, C: 0, D: 0 }
  },
  { 
    id: 2, 
    name: "캐릭터2", 
    image: "/images/char2.png", 
    unlocked: false,
    unlockCost: { A: 3, B: 0, C: 0, D: 0 }
  },
  { 
    id: 3, 
    name: "캐릭터3", 
    image: "/images/char1.png", 
    unlocked: false,
    unlockCost: { A: 0, B: 5, C: 0, D: 0 }
  },
  { 
    id: 4, 
    name: "캐릭터4", 
    image: "/images/char1.png", 
    unlocked: false,
    unlockCost: { A: 0, B: 0, C: 2, D: 0 }
  },
  { 
    id: 5, 
    name: "캐릭터5", 
    image: "/images/char2.png", 
    unlocked: false,
    unlockCost: { A: 0, B: 0, C: 0, D: 4 }
  },
  { 
    id: 6, 
    name: "캐릭터6", 
    image: "/images/char1.png", 
    unlocked: false,
    unlockCost: { A: 2, B: 3, C: 0, D: 0 }
  },
  { 
    id: 7, 
    name: "캐릭터7", 
    image: "/images/char1.png", 
    unlocked: false,
    unlockCost: { A: 0, B: 1, C: 4, D: 0 }
  },
  { 
    id: 8, 
    name: "캐릭터8", 
    image: "/images/char2.png", 
    unlocked: false,
    unlockCost: { A: 1, B: 0, C: 0, D: 6 }
  },
  { 
    id: 9, 
    name: "캐릭터9", 
    image: "/images/char1.png", 
    unlocked: false,
    unlockCost: { A: 3, B: 2, C: 1, D: 2 }
  },
];

export default characters;
