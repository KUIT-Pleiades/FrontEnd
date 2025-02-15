import React, { useState, useEffect, useRef } from 'react';
import s from './CreateStationBackground.module.scss';

// image files
import slideBoxShowUpArrow from '../../../../assets/StationCreate/slideBoxShowupArrow.svg';

interface CreateStationBackgroundProps {
	backgrounds: string[];
    background: string;
    setBackground: React.Dispatch<React.SetStateAction<string>>;
    handleBack: () => void;
    handleComplete: () => void;
}

const CreateStationBackground: React.FC<CreateStationBackgroundProps> = ({
	backgrounds,
    background,
    setBackground,
    handleBack,
    handleComplete,
}) => {
    const [isOpen, setIsOpen] = useState(false); // 슬라이드 박스 상태
    const containerRef = useRef<HTMLDivElement>(null);

    // 배경 후보 이미지 리스트
    // const backgrounds = [
    //     '../../../../assets/stationBackgroundImg/stationBackground_01.png',
    //     '../../../../assets/stationBackgroundImg/stationBackground_02.png',
    //     '../../../../assets/stationBackgroundImg/stationBackground_03.png',
    // ];

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
            {/* 현재 선택한 배경 미리보기 */}
            {/* <div className={s.body}>
                <span className={s.guideText}>정거장 컨셉에 어울리는 배경을 골라보세요!</span>
                <div 
                    className={s.selectedBackground} 
                />
            </div> */}

            {/* 슬라이드 박스 */}
            <div className={`${s.slideBox} ${isOpen ? s.open : ''}`} ref={containerRef}>
                <div className={s.backgroundList}>
                    {backgrounds.map((bgSrc) => (
                        <div
                            key={bgSrc}
                            className={`${s.backgroundItem} ${background === bgSrc ? s.selected : ''}`}
                            onClick={() => setBackground(bgSrc)}
							style={{ backgroundImage: `url(${bgSrc})` }}
                        >
                            {/* <img src={bgSrc} alt="background" className={s.backgroundImage} /> */}
                        </div>
                    ))}
                </div>
            </div>

            {/* 화살표 버튼 */}
            {!isOpen && (
                <button className={s.arrowButton} onClick={toggleOpen}>
                    <img src={slideBoxShowUpArrow} alt='arrow' />
                </button>
            )}
			<div className={s.bottomWhiteSpace}>
			</div>
        </div>
    );
};

export default CreateStationBackground;