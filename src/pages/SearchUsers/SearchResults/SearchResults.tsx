import s from './SearchResults.module.scss';

//components
import ShowSearchedUser from './ShowSearchedUser/ShowSearchedUser';
import { fetchRequest } from '../../../functions/fetchRequest';
import { SocialUser } from '../../../interfaces/Interfaces';

interface SearchResultsProps {
    filteredUsers: SocialUser[];
    refreshSearch: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ filteredUsers, refreshSearch }) => {
    const doRefresh = () => {
        setTimeout(() => {
            refreshSearch();
        }, 1290);
    }
    // ✅ 친구 요청 보내기
    const handleSendRequestFriend = async (friendId: string) => {
        const response = await fetchRequest<{ message: string }>(
            `/friends/requests`,
            "POST",
            { receiverId: friendId }
        );
        if (response) {
            console.log('친구 요청 보냄. to: ', friendId);
            doRefresh();
        } else console.error("친구 요청 실패");
    };

    // ✅ 친구 요청 취소 or 삭제
    const handleDeleteRequest = async (friendId: string, type: "REQUEST" | "FRIEND") => {
        const response = await fetchRequest<{ message: string }>(
            `/friends/requests/${friendId}`,
            "DELETE",
            null
        );
        if (response) {
            console.log('딜리트 실행 완료. 메시지: ', response.message);
            if(type === "REQUEST"){
                doRefresh();
            }else{
                refreshSearch();
            }
        } else console.error(type === "REQUEST" ? "친구 요청 취소 실패" : "친구 삭제 실패");
    };

    // ✅ 친구 요청 거절
    const handleRejectRequest = async (friendId: string) => {
        const response = await fetchRequest<{ message: string }>(
            `/friends/requests/${friendId}`,
            "PATCH",
            { status: "REJECTED" }
        );
        if (response) {
            console.log(response.message);
            doRefresh();
        } else console.error("친구 요청 거절 실패");
    };

    // ✅ 친구 요청 수락
    const handleAcceptRequest = async (friendId: string) => {
        const response = await fetchRequest<{ message: string }>(
            `/friends/requests/${friendId}`,
            "PATCH",
            { status: "ACCEPTED" }
        );
        if (response) {
            console.log(response.message);
            refreshSearch();
        } else console.error("친구 요청 수락 실패");
    };
    const handleSendSignal = async (friendId: string) => {
        const response = await fetchRequest<{ message: string }>(
            `/friends/${friendId}/signal`,
            "POST",
            { receiverId: friendId }
        );
        if (response) {
            console.log(response.message);
        } else console.error("시그널 보내기 실패");
    }

    const handleAddSearchHistory = async (searchedId: string) => {
        console.log('검색기록 추가 시도..!');
        try {
            const response = await fetchRequest<{ message: string }>(
                "/users/histories",
                "POST",
                { searchedId: searchedId }
            );
            if (response) {
                console.log('최근 검색 기록 추가 완료. 추가한 사용자 아이디: ',searchedId);
                console.log('응답: ', response);
                //getRecentSearches();
            } else {
                console.error("최근 검색 기록 추가 실패");
            }
        } catch (error) {
            console.error("최근 검색 기록 추가 중 오류 발생:", error);
        }
    };

    return (
        <div className={s.searchResultContainer}>
            {filteredUsers.map(user => (
                <div className={s.searchUserContainer} key={user.userId}>
                    <ShowSearchedUser
                        user={user}
                        handleSendRequestFriend={handleSendRequestFriend}
                        handleDeleteRequest={handleDeleteRequest}
                        handleRejectRequest={handleRejectRequest}
                        handleAcceptRequest={handleAcceptRequest}
                        handleSendSignal={handleSendSignal}
                        handleAddSearchHistory={handleAddSearchHistory}
                    />
                </div>
            ))}
        </div>
    )
}

export default SearchResults;
