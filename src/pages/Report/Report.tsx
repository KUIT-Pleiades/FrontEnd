import backBtn from "../../assets/btnImg/backBtn.png";
import s from "./Report.module.scss";
import { useCharacterStore } from "../../store/useCharacterStore";
import SearchReportsBar from "./SearchReportsBar/SearchReportsBar";
import ReportList from "./ReportList/ReportList";
import { useState, useEffect } from "react";
import SearchReport from "./SearchReport/SearchReport";
import { fetchRequest } from "../../functions/fetchRequest";

interface Report {
  reportId: number;
  questionId: number;
  question: string;
  createdAt: string;
  modifiedAt: string;
  answer: string;
}

interface SearchHistoryItem {
  id: number;
  query: string;
  createdAt: string;
}

interface SearchHistoryResponse {
  history: SearchHistoryItem[];
}

const Report = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [isSearchResult, setIsSearchResult] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [reportsResponse, historyResponse] = await Promise.all([
          fetchRequest<{ reports: Report[] }>("/reports", "GET", null),
          fetchRequest<SearchHistoryResponse>("/reports/history", "GET", null),
        ]);

        if (reportsResponse && reportsResponse.reports) {
          setReports(reportsResponse.reports);
          setFilteredReports(reportsResponse.reports);
        } else {
          throw new Error("리포트를 불러오는데 실패했습니다.");
        }

        if (historyResponse && historyResponse.history) {
          setSearchHistory(historyResponse.history);
        } else {
          throw new Error("검색 기록을 불러오는데 실패했습니다.");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSearchSubmit = async (query: string) => {
    if (query.trim()) {
      try {
        // 검색 API 호출
        const response = await fetchRequest<{ reports: Report[] }>(
          `/reports?query=${encodeURIComponent(query.trim())}`,
          "GET",
          null
        );

        if (response && response.reports) {
          setFilteredReports(response.reports);
          setIsSearchResult(true);
          setShowSearchHistory(false);
          setSearchValue("");
        } else {
          throw new Error("검색 결과를 불러오는데 실패했습니다.");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "검색 처리 중 오류가 발생했습니다."
        );
      }
    }
  };

  const handleSearchFocus = () => {
    setShowSearchHistory(true);
    setIsSearchResult(false);
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setShowSearchHistory(false);
    }, 200); // 검색어 선택할 시간을 주기 위한 지연
  };

  const handleDeleteHistory = async (id: number) => {
    try {
      // 검색어 삭제 API 호출
      await fetchRequest<void>(`/reports/history/${id}`, "DELETE", null);

      // 삭제 후 검색 기록 상태 업데이트
      setSearchHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "검색 기록 삭제 중 오류가 발생했습니다."
      );
    }
  };

  const handleSelectHistory = (query: string) => {
    setSearchValue(query);
    setShowSearchHistory(true);
  };

  const handleUpdateReport = async (reportId: number, newAnswer: string) => {
    try {
      await fetchRequest<void>(`/reports/${reportId}`, "PATCH", {
        answer: newAnswer.trim(),
      });

      // 성공적으로 업데이트되면 로컬 상태 업데이트
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.reportId === reportId
            ? {
                ...report,
                answer: newAnswer,
                modifiedAt: new Date().toISOString(),
              }
            : report
        )
      );

      if (isSearchResult) {
        setFilteredReports((prevFiltered) =>
          prevFiltered.map((report) =>
            report.reportId === reportId
              ? {
                  ...report,
                  answer: newAnswer,
                  modifiedAt: new Date().toISOString(),
                }
              : report
          )
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "리포트 수정 중 오류가 발생했습니다."
      );
    }
  };

  const handleDeleteReport = async (reportId: number) => {
    try {
      // 서버에 삭제 요청
      await fetchRequest<void>(`/reports/${reportId}`, "DELETE", null);

      // 성공적으로 삭제되면 로컬 상태 업데이트
      setReports((prevReports) =>
        prevReports.filter((report) => report.reportId !== reportId)
      );

      // 검색 결과에서도 제거
      if (isSearchResult) {
        setFilteredReports((prevFiltered) =>
          prevFiltered.filter((report) => report.reportId !== reportId)
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "리포트 삭제 중 오류가 발생했습니다."
      );
    }
  };
  const { userInfo } = useCharacterStore();

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>에러: {error}</div>;
  }

  return (
    <div className={s.container}>
      <div className={s.headerWrapper}>
        <div className={s.header}>
          <img src={backBtn} alt="뒤로가기" className={s.backBtn} />
          <div className={s.headerTitle}>리포트</div>
        </div>
        <div className={s.userRecord}>
          <strong>{userInfo.userName}</strong>님의 기록이에요
        </div>
      </div>
      <div className={s.searchWrapper}>
        <SearchReportsBar
          value={searchValue}
          onChange={handleSearchChange}
          onSubmit={handleSearchSubmit}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
        />
      </div>

      {showSearchHistory ? (
        <div className={s.searchReport}>
          <SearchReport
            searchHistory={searchHistory}
            onDeleteHistory={handleDeleteHistory}
            onSelectHistory={(query) => handleSelectHistory(query)}
          />
        </div>
      ) : isSearchResult ? (
        <div className={s.searchReport}>
          <ReportList
            reports={filteredReports}
            onUpdateReport={handleUpdateReport}
            onDeleteReport={handleDeleteReport}
            isSearchResult={true}
          />
        </div>
      ) : (
        <div className={s.reportList}>
          <ReportList
            reports={reports}
            onUpdateReport={handleUpdateReport}
            onDeleteReport={handleDeleteReport}
            isSearchResult={false}
          />
        </div>
      )}
    </div>
  );
};

export default Report;
