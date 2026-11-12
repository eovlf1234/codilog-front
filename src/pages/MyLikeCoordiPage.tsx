// import "./CoordiPage.css";
import TopBar from "../components/TopBar/TopBar";
import type { LikeCoordiSort } from "../types/SortOrder";
import { likeCoordiSort } from "../types/SortOrder";
import { useEffect, useRef, useState } from "react";
import CommentModal from "../components/Modal/CommentModal";
import type { Coordi } from "../types/Coordi";
import api from "../api/api";
import type { PageResponse } from "../types/PageResponse";
import CoordiPost from "../components/CoordiPost/CoordiPost";
import toast from "react-hot-toast";
import axios from "axios";

const MyLikeCoordiPage = () => {

  const [coordis, setCoordis] = useState<Coordi[]>([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  const observerRef = useRef<HTMLDivElement>(null);

  const [commentCoordiId, setCommentCoordiId] = useState<number | null>(null);

  const selectedCoordi = coordis.find(coordi => coordi.id === commentCoordiId);

  const [sortOrder, setSortOrder] = useState<LikeCoordiSort>("LATEST");

  const getCoordis = async () => {

    if(loading || !hasNext) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.get("/coordi/my/like", {
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

    } catch(error: unknown) {
      if(axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("알 수 없는 오류가 발생하였습니다.");
      }
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
      <TopBar title="좋아요 게시글" upButton={true} sortButton={true} sortOptions={likeCoordiSort} onSortChange={setSortOrder} />
      <div className="coordi-feed">
        {
          coordis.map((coordi) => (
            <CoordiPost key={coordi.id} coordi={coordi} setCommentCoordiId={setCommentCoordiId} />
          ))
        }
        <div ref={observerRef}></div>
      </div>
      
      <CommentModal coordiId={commentCoordiId} commentCount={selectedCoordi?.commentCount ?? 0} onClose={() => setCommentCoordiId(null)} onCommentCreated={EditCommentCount}>

      </CommentModal>
    </>
  );
};

export default MyLikeCoordiPage;