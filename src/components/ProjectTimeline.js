// ProjectTimeline.js - 날짜 처리 디버깅 버전
import React, { useState, useEffect } from "react";
import "./ProjectTimeline.css";

function ProjectTimeline({ projects = [] }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  const convertFirebaseTimestamp = (timestamp) => {
    if (!timestamp) return null;
    
    try {
      if (timestamp.toDate && typeof timestamp.toDate === 'function') {
        return timestamp.toDate();
      }
      if (timestamp.seconds !== undefined) {
        return new Date(timestamp.seconds * 1000);
      }
      return new Date(timestamp);
    } catch (error) {
      console.error('Date conversion error:', error);
      return null;
    }
  };

  return (
    <div className="simple-timeline">
      <div className="simple-line"></div>
      
      <div className="debug-info">
        <div>현재 시간: {now.toLocaleString()}</div>
        <div>프로젝트 수: {projects.length}</div>
      </div>
      
      {/* 각 프로젝트의 날짜 정보를 표시 */}
      {projects.map((project, index) => {
        const createdDate = convertFirebaseTimestamp(project.createdAt);
        const deadlineDate = convertFirebaseTimestamp(project.deadline);
        
        console.log(`Project ${index}:`, {
          title: project.title,
          createdAt: project.createdAt,
          deadline: project.deadline,
          createdDate: createdDate,
          deadlineDate: deadlineDate
        });

        // 간단한 진행률 계산
        let progressRatio = 0;
        let errorMsg = '';
        
        if (!createdDate || !deadlineDate) {
          errorMsg = '날짜 없음';
        } else if (isNaN(createdDate.getTime()) || isNaN(deadlineDate.getTime())) {
          errorMsg = '잘못된 날짜';
        } else {
          const totalDuration = deadlineDate - createdDate;
          const elapsed = now - createdDate;
          
          if (totalDuration <= 0) {
            errorMsg = '마감일이 시작일보다 이전';
          } else {
            progressRatio = Math.min(Math.max(elapsed / totalDuration, 0), 1);
          }
        }
        
        return (
          <div key={project.id || index}>
            {/* 타임라인 점 */}
            {!errorMsg && (
              <div 
                className="simple-dot"
                style={{
                  left: `${progressRatio * 100}%`,
                  background: progressRatio > 1 ? 'red' : progressRatio > 0.8 ? 'orange' : 'green'
                }}
                title={`${project.title} - ${Math.round(progressRatio * 100)}%`}
              >
                {index + 1}
              </div>
            )}
            
            {/* 프로젝트 정보 */}
            <div 
              style={{
                position: 'absolute',
                top: '70px',
                left: `${index * 150}px`,
                width: '140px',
                background: errorMsg ? '#ffebee' : '#e8f5e8',
                border: '1px solid ' + (errorMsg ? '#f44336' : '#4caf50'),
                borderRadius: '4px',
                padding: '8px',
                fontSize: '11px'
              }}
            >
              <strong>{project.title || `프로젝트 ${index + 1}`}</strong><br/>
              {errorMsg ? (
                <span style={{color: 'red'}}>❌ {errorMsg}</span>
              ) : (
                <>
                  📅 시작: {createdDate ? createdDate.toLocaleDateString() : 'N/A'}<br/>
                  🎯 마감: {deadlineDate ? deadlineDate.toLocaleDateString() : 'N/A'}<br/>
                  📊 진행률: {Math.round(progressRatio * 100)}%
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProjectTimeline;