import React from "react";
import { axiosRequest } from "../../../../functions/axiosRequest";
import { useState, useEffect } from "react";
import { formatDateTime } from "../../../../functions/formatDateTime";
import s from "./CharacterReport.module.scss";
import messageIcon from "../../../../assets/Icon/message.svg";
import closeBtn from "../../../../assets/btnImg/closeBtn.svg";
import { useNavigate } from "react-router-dom";

interface ReportProps {
  onClose: () => void;
  memberName?: string;
  stationId: string;
  userId: string;
  profile: string;
}

interface ReportResponse {
  report: {
    reportId: number;
    questionId: number;
    question: string;
    written: boolean;
    createdAt: string;
    modifiedAt: string | null;
    answer: string | null;
  };
}

const CharacterReport: React.FC<ReportProps> = ({
  onClose,
  memberName,
  stationId,
  userId,
  profile,
}) => {
  const navigate = useNavigate();
  const [reportData, setReportData] = useState<ReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getReport = async () => {
      try {
        setIsLoading(true);
        const response = await axiosRequest<ReportResponse>(
          `/stations/${stationId}/users/${userId}/report`,
          "GET",
          null
        );

        if (response) {
          setReportData(response.data);
        }
      } catch (err) {
        setError(err as Error);
        console.error("리포트 조회 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getReport();
  }, [stationId, userId]);

  if (isLoading) return <div></div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!reportData) return null;

  return (
    <div className={s.container}>
      <div className={s.overlay}>
        <div className={s.title}>
          <div className={s.bar1}></div>
          <img src={profile} alt="" />
          <div className={s.reportOner}>{memberName}님의 리포트</div>
          <div className={s.handleContainer}>
            <div className={s.reportUserId}>(@{userId})</div>
            <button
              className={s.visitStar}
              onClick={() => navigate("/friendstar", { state: { userId } })}
            >
              별 방문하기
            </button>
          </div>
          <div className={s.bar2}></div>
        </div>
        <div className={s.modal}>
          <div className={s.modalHeader}>
            <div className={s.modalQuestion}>
              <img
                src={messageIcon}
                alt="메세지 아이콘"
                className={s.messageIcon}
              />
              <div className={s.modalContent}>
                <div className={s.question}>{reportData.report.question}</div>
                <div className={s.date}>
                  {formatDateTime(reportData.report.createdAt)}
                </div>
              </div>
            </div>
            <button className={s.closeButton} onClick={onClose}>
              <img src={closeBtn} alt="" />
            </button>
          </div>
          <div className={s.modalBody}>
            <div className={s.infoWrapper}>
              <div className={s.modifedAt}>
                {reportData.report.modifiedAt &&
                  formatDateTime(reportData.report.modifiedAt)}
              </div>
            </div>
            <div className={s.answer}>{reportData.report.answer}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterReport;
