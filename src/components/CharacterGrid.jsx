import React, { useState, useEffect } from "react";
import "./CharacterGrid.css";
import CharacterDisplay from "./CharacterDisplay";

function CharacterGrid({ characters, onSelect }) {
  // 사용자 보유 돈 상태 (A, B, C, D)
  const [userMoney, setUserMoney] = useState(() => {
    const saved = localStorage.getItem('userMoney');
    return saved ? JSON.parse(saved) : {
      A: 3, // 테스트용 초기값
      B: 2,
      C: 1,
      D: 1
    };
  });

  // 캐릭터 해금 상태 관리
  const [unlockedCharacters, setUnlockedCharacters] = useState(() => {
    const saved = localStorage.getItem('unlockedCharacters');
    if (saved) {
      return JSON.parse(saved);
    }
    return characters.map(char => ({ ...char, unlocked: char.unlocked }));
  });

  // 닉네임 상태 관리
  const [nickname, setNickname] = useState(() => {
    const saved = localStorage.getItem('userNickname');
    return saved || '내이름은뿌꾸';
  });
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [tempNickname, setTempNickname] = useState('');

  // 해금 애니메이션 상태 관리
  const [unlockingCharacters, setUnlockingCharacters] = useState(new Set());
  const [selectedCharacter, setSelectedCharacter] = useState(() => {
    const saved = localStorage.getItem('selectedCharacter');
    return saved ? JSON.parse(saved) : null;
  });

  // 해금 조건을 만족하는지 확인하는 함수
  const canUnlock = (character) => {
    const { unlockCost } = character;
    return (
      userMoney.A >= unlockCost.A &&
      userMoney.B >= unlockCost.B &&
      userMoney.C >= unlockCost.C &&
      userMoney.D >= unlockCost.D
    );
  };

  // 돈 상태 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('userMoney', JSON.stringify(userMoney));
  }, [userMoney]);

  // 캐릭터 해금 상태 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('unlockedCharacters', JSON.stringify(unlockedCharacters));
  }, [unlockedCharacters]);

  // 자동 해금 체크 및 업데이트
  useEffect(() => {
    setUnlockedCharacters(prevCharacters => 
      prevCharacters.map(character => {
        if (!character.unlocked && canUnlock(character)) {
          // 해금 애니메이션 시작
          setUnlockingCharacters(prev => new Set([...prev, character.id]));
          
          // 2초 후 애니메이션 완료
          setTimeout(() => {
            setUnlockingCharacters(prev => {
              const newSet = new Set(prev);
              newSet.delete(character.id);
              return newSet;
            });
          }, 2000);
          
          return { ...character, unlocked: true };
        }
        return character;
      })
    );
  }, [userMoney]);

  // 캐릭터 선택 함수
  const handleCharacterSelect = (character) => {
    if (character.unlocked) {
      setSelectedCharacter(character);
      localStorage.setItem('selectedCharacter', JSON.stringify(character));
      onSelect(character);
    }
  };

  // 돈 추가 함수 (테스트용)
  const addMoney = (type, amount) => {
    setUserMoney(prev => ({
      ...prev,
      [type]: prev[type] + amount
    }));
  };

  // 닉네임 편집 시작
  const startEditingNickname = () => {
    setTempNickname(nickname);
    setIsEditingNickname(true);
  };

  // 닉네임 편집 취소
  const cancelEditingNickname = () => {
    setTempNickname('');
    setIsEditingNickname(false);
  };

  // 닉네임 저장
  const saveNickname = () => {
    if (tempNickname.trim()) {
      setNickname(tempNickname.trim());
      localStorage.setItem('userNickname', tempNickname.trim());
      setIsEditingNickname(false);
      setTempNickname('');
    }
  };

  // 엔터키로 닉네임 저장
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveNickname();
    } else if (e.key === 'Escape') {
      cancelEditingNickname();
    }
  };

  return (
    <div className="backgroundColor">
      {/* 사이드바 */}
      <div className="side-bar">
        <div className="sidebar-top-icons">
          {/* 원자 모형 아이콘 (활성화된 상태) */}
          <div className="sidebar-icon active">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" fill="#4A90E2"/>
              <circle cx="12" cy="12" r="8" stroke="white" strokeWidth="2"/>
              <circle cx="12" cy="12" r="12" stroke="white" strokeWidth="1" opacity="0.5"/>
            </svg>
          </div>
          
          {/* 돋보기 아이콘 */}
          <div className="sidebar-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          
          {/* 집 아이콘 */}
          <div className="sidebar-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="white" strokeWidth="2"/>
              <polyline points="9,22 9,12 15,12 15,22" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          
          {/* 상점 아이콘 */}
          <div className="sidebar-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="white" strokeWidth="2"/>
              <polyline points="9,22 9,12 15,12 15,22" stroke="white" strokeWidth="2"/>
              <path d="M8 7h8" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
        </div>
        
        {/* 하단 사용자 프로필 아이콘 */}
        <div className="sidebar-bottom-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="2"/>
            <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2"/>
          </svg>
        </div>
      </div>
      
      <div className="backRectangle">
        {/* 선택된 캐릭터 이미지 표시 */}
        <div className="character-user-box">
          <CharacterDisplay character={selectedCharacter || unlockedCharacters.find(char => char.unlocked)} />
        </div>
      
        {/* 사용자 보유 돈 표시 (테스트용) */}
        <div className="money-display">
          <div>A: {userMoney.A}</div>
          <div>B: {userMoney.B}</div>
          <div>C: {userMoney.C}</div>
          <div>D: {userMoney.D}</div>
        </div>

        {/* 테스트용 돈 추가 버튼들 */}
        <div className="test-buttons">
          <button onClick={() => addMoney('A', 1)}>A+1</button>
          <button onClick={() => addMoney('B', 1)}>B+1</button>
          <button onClick={() => addMoney('C', 1)}>C+1</button>
          <button onClick={() => addMoney('D', 1)}>D+1</button>
        </div>

        <div className="character-grid">
          {unlockedCharacters.map((character) => (
            <div
              key={character.id}
              className={`character-box ${!character.unlocked ? "LockBox" : "UnlockBox"} ${
                unlockingCharacters.has(character.id) ? "unlocking" : ""
              } ${selectedCharacter?.id === character.id ? "selected" : ""}`}
              onClick={() => handleCharacterSelect(character)}
            >
              <img src={character.image} alt={character.name} className="character-image" />
              <div className="character-name">{character.name}</div>
              {!character.unlocked && (
                <div className="unlock-cost">
                  {Object.entries(character.unlockCost).map(([type, cost]) => 
                    cost > 0 && (
                      <span key={type} className={`cost-item ${type.toLowerCase()}`}>
                        {type}: {cost}
                      </span>
                    )
                  )}
                </div>
              )}
              {unlockingCharacters.has(character.id) && (
                <div className="unlock-effect">
                  <div className="sparkle">✨</div>
                  <div className="sparkle">✨</div>
                  <div className="sparkle">✨</div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="nameLine" />
        <div className="name-section">
          {isEditingNickname ? (
            <div className="nickname-edit">
              <input
                type="text"
                value={tempNickname}
                onChange={(e) => setTempNickname(e.target.value)}
                onKeyDown={handleKeyPress}
                className="nickname-input"
                autoFocus
                maxLength={20}
              />
              <div className="nickname-buttons">
                <button onClick={saveNickname} className="save-btn">저장</button>
                <button onClick={cancelEditingNickname} className="cancel-btn">취소</button>
              </div>
            </div>
          ) : (
            <div className="nickname-display">
              <span className="name">{nickname}</span>
              <button onClick={startEditingNickname} className="edit-nickname-btn" title="닉네임 수정">
                ✏️
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CharacterGrid;