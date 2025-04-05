import React, { useState, useEffect } from "react";
import s from "./StationReport.module.scss";
import { axiosRequest } from "../../../../functions/axiosRequest";
// import { formatDateTime } from "../../../../functions/formatDateTime";
import messageIcon from "../../../../assets/Icon/message.svg";
import Pending from "../../../PageManagement/Pending";

interface StationReportProps {
  stationId: string;
  onReportSubmitted: () => void;
}

interface ReportResponse {
  report: {
    reportId: number;
    userId: string;
    station: string;
    questionId: number;
    question: string;
    written: boolean;
    createdAt: string;
    modifiedAt: string | null;
    answer: string | null;
  };
}

const StationReport: React.FC<StationReportProps> = ({
  stationId,
  onReportSubmitted,
}) => {
  const [reportData, setReportData] = useState<ReportResponse["report"] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [editedAnswer, setEditedAnswer] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const maxLength = 150;

  useEffect(() => {
    const getReportData = async () => {
      console.log("API 호출 시작");
      try {
        setIsLoading(true);
        const response = await axiosRequest<ReportResponse>(
          `/stations/${stationId}/report`,
          "GET",
          null
        );

        if (!response) {
          throw new Error("빈 응답이 반환되었습니다");
        }

        if (!response.data.report) {
          throw new Error("report 데이터가 존재하지 않습니다");
        }

        setReportData(response.data.report);
        setEditedAnswer(response.data.report.answer || ""); // answer가 null일 경우 빈 문자열로 초기화
      } catch (err) {
        console.error("API 에러:", err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
        console.log("로딩 완료");
      }
    };

    getReportData();
  }, [stationId]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxLength) {
      setEditedAnswer(text);
      setError(null);
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
    }
  };

  const handleSave = async () => {
    if (editedAnswer.trim() === "") {
      setError(new Error("답변을 입력해주세요"));
      return;
    }
    try {
      setIsSaving(true);
      const response = await axiosRequest<ReportResponse>(
        `/stations/${stationId}/report`,
        "PATCH",
        {
          answer: editedAnswer,
        }
      );

      if (!response) {
        throw new Error("리포트 저장에 실패했습니다");
      }

      // 성공적으로 저장된 경우 reportData 업데이트
			setReportData(response.data.report);
			onReportSubmitted(); 
      console.log("리포트가 성공적으로 저장되었습니다:", response);

      // 여기에 성공 메시지나 추가적인 UI 업데이트 로직을 추가할 수 있습니다
    } catch (err) {
      console.error("리포트 저장 중 에러:", err);
      setError(err as Error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedAnswer(reportData?.answer || "");
  };

  if (isLoading) return <Pending />;
  if (!reportData) return null;

  return (
    <div className={s.container}>
      <div className={s.overlay}>
        <div className={s.title}>
          <div className={s.bar1}></div>
          투데이 리포트
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
                <div className={s.question}>{reportData.question}</div>
                <div className={s.date}>
                  {new Date(reportData.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          <div className={s.modalBody}>
            <div className={s.editWrapper}>
              <textarea
                className={s.editAnswer}
                value={editedAnswer}
                onChange={handleTextChange}
                maxLength={maxLength}
                placeholder="입장을 위해 투데이 리포트를 작성해주세요!"
              />
              {error && <div className={s.error}>{error.message}</div>}
              <div className={s.editFooter}>
                <div className={s.characterCount}>
                  {editedAnswer.length} / {maxLength}byte
                </div>
                <div className={s.buttonGroup}>
                  <button className={s.saveBtn} onClick={handleSave}>
                    {isSaving ? "저장 중..." : "완료"}
                  </button>
                  <button className={s.cancelBtn} onClick={handleCancel}>
                    취소
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationReport;
