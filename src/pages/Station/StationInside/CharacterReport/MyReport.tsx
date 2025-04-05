import React from "react";
import { useState, useEffect } from "react";
import { axiosRequest } from "../../../../functions/axiosRequest";
import { formatDateTime } from "../../../../functions/formatDateTime";
import s from "./CharacterReport.module.scss";
import messageIcon from "../../../../assets/Icon/message.svg";
import closeBtn from "../../../../assets/btnImg/closeBtn.svg";

interface ReportProps {
  onClose: () => void;
  stationId: string;
  userId: string;
}

interface Report {
  reportId: number;
  questionId: number;
  question: string;
  createdAt: string;
  modifiedAt: string;
  answer: string;
}

const MyReport: React.FC<ReportProps> = ({ onClose, stationId, userId }) => {
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedAnswer, setEditedAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const maxLength = 150;

  useEffect(() => {
    const getReport = async () => {
      try {
        setIsLoading(true);
        const response = await axiosRequest<{ report: Report }>(
          `/stations/${stationId}/users/${userId}/report`,
          "GET",
          null
        );

        if (response) {
          setReport(response.data.report);
          setEditedAnswer(response.data.report.answer);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "리포트 조회에 실패했습니다"
        );
      } finally {
        setIsLoading(false);
      }
    };

    getReport();
  }, [stationId, userId]);

  const handleEdit = () => {
    setIsEditing(true);
    setTimeout(() => {
      const textarea = document.querySelector(
        `.${s.editAnswer}`
      ) as HTMLTextAreaElement;
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
      }
    }, 0);
  };

  const handleSave = async () => {
    if (!editedAnswer.trim() || !report) {
      setError("답변 내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosRequest<{ message: string }>(
        `/stations/${stationId}/report`,
        "PATCH",
        { answer: editedAnswer.trim() }
      );

      if (response) {
        setReport({
          ...report,
          answer: editedAnswer.trim(),
          modifiedAt: new Date().toISOString(),
        });
        setIsEditing(false);
        setError(null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "답변 수정 중 오류가 발생했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditedAnswer(report?.answer || "");
    setIsEditing(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxLength) {
      setEditedAnswer(text);
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
    }
  };

  if (isLoading) return <div>...</div>;
  if (error) return <div>{error}</div>;
  if (!report) return null;

  return (
    <div className={s.container}>
      <div className={s.overlay} onClick={onClose}>
        <div className={s.modal} onClick={(e) => e.stopPropagation()}>
          <div className={s.modalHeader}>
            <div className={s.modalQuestion}>
              <img
                src={messageIcon}
                alt="메세지 아이콘"
                className={s.messageIcon}
              />
              <div className={s.modalContent}>
                <div className={s.question}>{report.question}</div>
                <div className={s.date}>{formatDateTime(report.createdAt)}</div>
              </div>
            </div>
            <button className={s.closeButton} onClick={onClose}>
              <img src={closeBtn} alt="닫기 버튼" />
            </button>
          </div>
          <div className={s.modalBody}>
            <div className={s.infoWrapper}>
              <div className={s.modifedAt}>
                {formatDateTime(report.modifiedAt)}
              </div>
              {!isEditing && (
                <div className={s.btnGroup}>
                  <button className={s.modifyBtn} onClick={handleEdit}>
                    수정
                  </button>
                </div>
              )}
            </div>
            {isEditing ? (
              <div className={s.editWrapper}>
                <textarea
                  className={s.editAnswer}
                  value={editedAnswer}
                  onChange={handleTextChange}
                  maxLength={maxLength}
                />
                {error && <div className={s.error}>{error}</div>}
                <div className={s.editFooter}>
                  <div className={s.characterCount}>
                    {editedAnswer.length} / {maxLength}byte
                  </div>
                  <div className={s.buttonGroup}>
                    <button
                      className={s.saveBtn}
                      onClick={handleSave}
                      disabled={isSubmitting || !editedAnswer.trim()}
                    >
                      {isSubmitting ? "저장 중..." : "완료"}
                    </button>
                    <button className={s.cancelBtn} onClick={handleCancel}>
                      취소
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={s.answer}>{report.answer}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyReport;
