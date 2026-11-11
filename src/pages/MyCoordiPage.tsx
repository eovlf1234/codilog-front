import "./CoordiPage.css";
import TopBar from "../components/TopBar/TopBar";
import api from "../api/api";
import { useEffect, useRef, useState } from "react";
import type { Coordi } from "../types/Coordi";
import CoordiPost from "../components/CoordiPost/CoordiPost";
import type { PageResponse } from "../types/PageResponse";
import CommentModal from "../components/Modal/CommentModal";
import type { CoordiSort } from "../types/SortOrder";
import { coordiSort } from "../types/SortOrder";
import toast from "react-hot-toast";

const MyCoordiPage = () => {

  const [coordis, setCoordis] = useState<Coordi[]>([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  const observerRef = useRef<HTMLDivElement>(null);

  const [commentCoordiId, setCommentCoordiId] = useState<number | null>(null);

  const selectedCoordi = coordis.find(coordi => coordi.id === commentCoordiId);

  // 정렬 타입
  const [sortOrder, setSortOrder] = useState<CoordiSort>("LATEST");

  // 게시글 가져오기
    const getCoordis = async () => {

      if(loading || !hasNext) {
        return;
      }

      setLoading(true);

    try{
      const response = await api.get("/coordi/my", {
        params: {
          page: page,
          coordiSort: sortOrder
        }
      });

      const data = response.data.data as PageResponse<Coordi>;

      setCoordis(prev => [
        ...prev,
        ...data.content
      ]);

      setPage(prev => prev + 1);

      setHasNext(!data.last);

    } catch(error) {
      toast.error("게시글을 불러오는데 실패하였습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 무한스크롤
  useEffect(() => {

    const observer = new IntersectionObserver(([entry]) => {
      if(entry.isIntersecting) {
        getCoordis();
      }
    });

    if(observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [page]);

  // 댓글 작성 후 수정
  const EditCommentCount = (coordiId: number, commentCount: number) => {
    setCoordis(prev =>
      prev.map(coordi =>
        coordi.id === coordiId ? {...coordi, commentCount} : coordi
      )
    );
  };

  // 정렬
  useEffect(() => {
    setCoordis([]);
    setHasNext(true);
    setPage(0);
  }, [sortOrder]);

  return (
    <>
      <TopBar title="내 게시글" upButton={true} sortButton={true} sortOptions={coordiSort} onSortChange={setSortOrder} />
      <div className="coordi-feed">
        {
          coordis.map((coordi) => (
            <CoordiPost key={coordi.id} coordi={coordi} setCommentCoordiId={setCommentCoordiId} ManagerButton={true} />
          ))
        }
        <div ref={observerRef}></div>
      </div>
      
      <CommentModal coordiId={commentCoordiId} commentCount={selectedCoordi?.commentCount ?? 0} onClose={() => setCommentCoordiId(null)} onCommentCreated={EditCommentCount}>

      </CommentModal>
      
    </>
  );
};

export default MyCoordiPage;