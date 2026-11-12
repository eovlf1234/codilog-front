import React, { useCallback, useEffect, useRef, useState } from "react";
import Modal from "../Modal/Modal";
import api from "../../api/api";
import type { Comment } from "../../types/Comment";
import "./CommentModal.css";
import { IoClose } from "react-icons/io5";
import { MdSort } from "react-icons/md";
import type { PageResponse } from "../../types/PageResponse";
import type { CoordiSort } from "../../types/SortOrder";
import { coordiSort } from "../../types/SortOrder";
import toast from "react-hot-toast";
import axios from "axios";

type Props = {
  coordiId: number | null;
  commentCount: number;
  onClose: () => void;
  onCommentCreated: (coordiId: number, EditCommentCount: number) => void;
};

const CommentModal = ({
  coordiId, commentCount, onClose, onCommentCreated
}: Props) => {

  const [comments, setComments] = useState<Comment[]>([]);
  const [newContent, setNewContent] = useState("");
  const [sortOpen, setSortopen] = useState<boolean>(false);
  const [sortOrder, setsortOrder] = useState<CoordiSort>("LATEST");
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  const observerRef = useRef<HTMLDivElement>(null);

  // 댓글 리스트
  const getComments = useCallback(async(
    targetPage: number,
  ) => {

    if(coordiId === null || loading || !hasNext) return;

    setLoading(true);

    try {
      const response = await api.get(`/coordi/${coordiId}/comment`, {
        params: {
          page: targetPage,
          sort: sortOrder
        }
      });

      const data = response.data.data as PageResponse<Comment>;

      setComments(prev => [
        ...prev,
        ...data.content
      ]);

      setHasNext(!data.last);
      setPage(targetPage + 1);

    } catch(error: unknown) {
      if(axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("알 수 없는 오류가 발생하였습니다.");
      }
    } finally {
      setLoading(false);
    }
  }, [coordiId, loading, hasNext, sortOrder]);

  // 게시글 바뀌면 댓글 데이터 초기화
  useEffect( () => {
    if (coordiId === null) return;

    setsortOrder("LATEST");
    resetComment();
  }, [coordiId])

  // 무한스크롤
  useEffect( () => {
    if(coordiId === null) return;

    const observer = new IntersectionObserver(([entry]) => {
      if(entry.isIntersecting) {
        getComments(page);
      }
    });

    if(observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();

  }, [coordiId, page]);

  // 시간 출력
  const formatDate = (date: string) => {
    const now = new Date();
    const createdAt = new Date(date);

    const diff = now.getTime() - createdAt.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if(minutes < 60) {
    return `${minutes}분 전`;
    }

    if(hours < 24) {
    return `${hours}시간 전`;
    }

    return createdAt.toLocaleDateString();
  }

  // 새 댓글 작성
  const newComment = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(coordiId === null) return;

    const response = await api.post(`/coordi/${coordiId}/comment`, newContent, {
      headers: {
        "Content-type": "text/plain"
      }
    });

    const EditCommentCount = response.data.data;

    onCommentCreated(coordiId, EditCommentCount);

    setNewContent("");
    setsortOrder("LATEST");
    resetComment();
  }
  
  // 정렬
  const sort = (type: CoordiSort) => {
    setSortopen(false);
    setsortOrder(type);
    resetComment();
  }

  // 댓글 초기화
  const resetComment = () => {
    setPage(0);
    setComments([]);
    setHasNext(true);
  }

  return (
    <Modal open={coordiId !== null} onClose={() => {}}>
      <div className="comment-section">
        <div className="modal-header">
          <div>댓글 {commentCount}</div>
          <div className="sort-wrapper">
            <button className="sort-button" onClick={() => setSortopen(prev => !prev)}><MdSort /></button>
            {
              sortOpen && (
                <div className="sort-menu">
                  {
                    coordiSort.map((option) => (
                      <div key={option.value} onClick={() => sort(option.value)}>{option.label}</div>
                    ))
                  }
                </div>
              )
            }
            <button className="modal-close-button" onClick={onClose}><IoClose /></button>
          </div>
        </div>
        <div className="comment-list">
        {
          comments.map((comment) => (
            <div key={comment.commentId}>
              <div>
                <div>{comment.nickname}</div>
                <div>{formatDate(comment.createdAt)}</div>
              </div>
              <div>{comment.content}</div>
            </div>
          ))
        }
        <div ref={observerRef}></div>
        </div>
        <div className="comment-form">
          <form onSubmit={newComment}>
            <input type="text" value={newContent} onChange={(e) => setNewContent(e.target.value)}/>
            <button>등록</button>
          </form>
        </div>
      </div>
    </Modal>
  );
}

export default CommentModal;