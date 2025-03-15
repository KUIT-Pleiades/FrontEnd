import React, { useState, useEffect, useRef } from 'react';
import s from './SetStationBackground.module.scss';

// image files
import slideBoxShowUpArrow from '../../../../assets/StationCreate/slideBoxShowupArrow.svg';

interface SetStationBackgroundProps {
	backgrounds: string[];
    backgroundPrevs: string[];
    background: string;
    setBackground: React.Dispatch<React.SetStateAction<string>>;
    handleBack: () => void;
    handleComplete: () => void;
}
//const IMG_BASE_URL: string = import.meta.env.VITE_PINATA_ENDPOINT;

const SetStationBackground: React.FC<SetStationBackgroundProps> = ({
	backgrounds,
    backgroundPrevs,
    background,
    setBackground,
    handleBack,
    handleComplete,
}) => {
    const [isOpen, setIsOpen] = useState(true); // 슬라이드 박스 상태
    const containerRef = useRef<HTMLDivElement>(null);

    // 외부 클릭 시 슬라이드 박스 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // 슬라이드 박스 토글 함수
    const toggleOpen = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <div className={s.container} style={{ backgroundImage: `url(${background})` }}>
            {/* 헤더 영역 */}
            <div className={s.header}>
                <div className={s.headerContents}>
                    <button className={s.headerBackButton} onClick={handleBack}>
                        이전
                    </button>
                    <span className={s.headerTitle}>정거장 배경 선택하기</span>
                    <button className={s.headerNextButton} onClick={handleComplete}>
                        완료
                    </button>
                </div>
            </div>
			<span className={s.guideText}>정거장 컨셉에 어울리는 배경을 골라보세요!</span>

            {/* 슬라이드 박스 */}
            <div className={`${s.slideBox} ${isOpen ? s.open : ''}`} ref={containerRef}>
                <div className={s.backgroundList}>
                {backgroundPrevs.map((prevSrc, index) => (
                    <div
                    key={prevSrc}
                    // 선택된 배경과 일치하면 s.selected 클래스가 추가되어 스타일이 적용됩니다.
                    className={`${s.backgroundItem} ${background === backgrounds[index] ? s.selected : ''}`}
                    onClick={() => setBackground(backgrounds[index])}
                    style={{ backgroundImage: `url(${prevSrc})` }}
                    />
                ))}
                </div>
            </div>

            {/* 화살표 버튼 */}
            {!isOpen && (
                <button className={s.arrowButton} onClick={toggleOpen}>
                    <img src={slideBoxShowUpArrow} alt='arrow' />
                </button>
            )}
			<div className={s.bottomWhiteSpace}></div>
        </div>
    );
};

export default SetStationBackground;

