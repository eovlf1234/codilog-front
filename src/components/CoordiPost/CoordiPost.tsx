import { useEffect, useRef, useState } from "react";
import type { Coordi } from "../../types/Coordi";
import { IMAGE_BASE_URL } from "../../config";
import "../CoordiPost/CoordiPost.css";
import { IoChevronBack, IoChevronForward, IoHeart, IoHeartOutline } from "react-icons/io5";
import { MdMoreVert } from "react-icons/md";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

type Props = {
    coordi: Coordi;
    setCommentCoordiId: React.Dispatch<React.SetStateAction<number | null>>;
    ManagerButton?: boolean;
}

const CoordiPost = ({ coordi, setCommentCoordiId, ManagerButton = false } : Props) => {

    // 이미지 수
    const [currentImage, setCurrentImage] = useState(0);

    // 이미지 ref
    const imageContainerRef = useRef<HTMLDivElement>(null);

    const [liked, setLiked] = useState(coordi.liked);
    const [likeCount, setLikeCount] = useState(coordi.likeCount);

    // 매니저 버튼
    const [showMenu, setShowMenu] = useState(false);

    // 매니저 버튼 ref
    const menuRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    const formatDate = (date: string) => {
        const now = new Date();
        const createdAt = new Date(date);

        const diff = Math.max(0, now.getTime() - createdAt.getTime());

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);

        if(minutes < 60) {
        return `${minutes}분 전`;
        }

        if(hours < 24) {
        return `${hours}시간 전`;
        }

        return createdAt.toLocaleDateString().replace(/\.$/, "");
    }

    // 이미지 이동
    const moveImage = (index: number) => {
        if(!imageContainerRef.current) return;

        imageContainerRef.current.scrollTo({
            left: index * imageContainerRef.current.clientWidth,
            behavior: "smooth"
        });

    }

    // 좋아요
    const clickLike = async () => {
        const response = await api.post(`/coordi/${coordi.id}/like`);

        const data = response.data.data;

        setLikeCount(data.likeCount);
        setLiked(data.liked);
    }

    // 매니저 버튼
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if(
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setShowMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const coordiDelete = async () => {

        try{
            await api.delete(`/coordi/${coordi.id}`);

            toast.success("게시글이 삭제되었습니다.");

            window.location.reload();
        } catch(error) {
            toast.error("게시글 삭제에 실패하였습니다.");
        }
        
    }

    return (
        <>
            <div className="coordi-post">
                <div className="post-header">
                    <div>{coordi.nickName}</div>
                    <div className="post-header-right">
                        {
                            
                        }
                        <div className="post-meta">
                            {formatDate(coordi.createdAt)}
                            {coordi.updatedAt != null && <span> (수정됨)</span>}
                        </div>
                        <div className="post-menu-wrapper" ref={menuRef}>
                            {
                                ManagerButton && (
                                    <button type="button" className="post-menu-button" onClick={() => setShowMenu(prev => !prev)}><MdMoreVert /></button>
                                )
                            }
                            {
                                showMenu && (
                                    <div className="post-menu">
                                        <button type="button" onClick={() => navigate(`/coordi/${coordi.id}/edit`)}>수정</button>
                                        <button type="button" onClick={coordiDelete}>삭제</button>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className="post-body" >
                    {
                        coordi.images.length > 0 && (
                                <div className="post-image-wrapper" onClick={(e) => e.stopPropagation()}>
                            <div className="post-image-container" ref={imageContainerRef} onScroll={(e) => {
                                const index = Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth);
                                
                                setCurrentImage(index);
                                }}
                            >
                                {
                                    // 이미지 출력
                                    coordi.images.map((image) => (
                                        <div className="post-image" key={image}>
                                            <img src={`${IMAGE_BASE_URL}${image}`}></img>
                                        </div>
                                ))
                                }
                            </div>
                            {
                                // 이미지 카운트
                                coordi.images.length > 1 && (
                                    <>
                                        {
                                            currentImage > 0 && (
                                                <button className="image-prev" onClick={() => {
                                                    moveImage(currentImage - 1);
                                                }}><IoChevronBack /></button>
                                            )
                                        }
                                        {
                                            currentImage < coordi.images.length - 1 && (
                                                <button className="image-next" onClick={() => {
                                                    moveImage(currentImage + 1);
                                                }}><IoChevronForward /></button>
                                            )
                                        }
                                        <div className="image-count">
                                            {currentImage + 1} / {coordi.images.length}
                                        </div>
                                    </>
                                )
                            }
                        </div>
                        )
                    }
                    <div className="post-content">
                        {coordi.content}
                    </div>
                </div>
                <div className="post-footer">
                    <div className="like-button" onClick={clickLike}>{liked ? <IoHeart /> : <IoHeartOutline />} 좋아요 {likeCount}</div>
                    <div className="comment-button" onClick={() => setCommentCoordiId(coordi.id)}>💬 댓글 {coordi.commentCount}</div>
                </div>
            </div>
        </>
    )
};

export default CoordiPost;
