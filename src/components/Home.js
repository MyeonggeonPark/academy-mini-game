import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="home-container">
        <h1>맵고맵지 생각훈련소</h1>
        <p>초등학생을 위한 계산 문제와 미로 찾기 문제를 생성하는 도구입니다.</p>
        
        <div className="tool-cards">
          <div className="tool-card">
            <h2>계산 문제 생성기</h2>
            <p>사칙연산 문제를 생성하여 인쇄할 수 있습니다.</p>
            <Link to="/math" className="tool-button">
              계산 문제 생성하기
            </Link>
          </div>
          
          <div className="tool-card">
            <h2>미로 생성기</h2>
            <p>다양한 크기의 미로를 생성하여 인쇄할 수 있습니다.</p>
            <Link to="/maze" className="tool-button">
              미로 생성하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;