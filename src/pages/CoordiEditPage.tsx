import React, { useEffect, useState } from "react";
import "./CoordiCreatePage.css";
import TopBar from "../components/TopBar/TopBar";
import { IoClose } from "react-icons/io5";
import { IoAdd } from "react-icons/io5";
import api from "../api/api";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { IMAGE_BASE_URL } from "../config";

const CoordiEditPage = () => {

    const [content, setContent] = useState("");

    type EditImage =
    | {
        type: "existing";
        value: string;
        }
    | {
        type: "new";
        value: File;
        };

    const [images, setImages] = useState<EditImage[]>([]);

    // 서버에서 삭제할 이미지
    const [deletedImages, setDeletedImages] = useState<string[]>([]);

    const navigation = useNavigate();

    const image_maxcount = 3;

    const { id } = useParams();

    // 기존 데이터
    useEffect(() => {
        const getEditCoordi = async () => {
            const response = await api.get(`/coordi/${id}`);

            const data = response.data.data;

            setContent(data.content);
            setImages(
                data.images.map((image: string) => ({
                    type: "existing",
                    value: image
                }))
            );
        }

        getEditCoordi();
    }, [id]);

    // 수정하기
    const submit = async(e:React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 캡션 최소 글자 확인
        if(content.length == 0) {
            alert("캡션 글자 수를 확인해 주세요.");
            return;
        }

        const formData = new FormData();

        formData.append("content", content);

        images.forEach((image) => {
            if(image.type === "new") {
                formData.append("images", image.value);
            }
        });

        deletedImages.forEach((image) => {
            formData.append("deletedImages", image);
        });

        try {
            await api.patch(`coordi/${id}`, formData);

            toast.success("게시글이 수정되었습니다.");

            navigation("/coordi");
        } catch(error) {
            toast.error("게시글 수정에 실패하였습니다.");
        }

    };

    // 이미지 추가
    const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if(!file) {
            return;
        }

        setImages(prev => [...prev, {type: "new", value: file}]);

        e.target.value = "";
    }

    // 이미지 삭제
    const removeImage = (index: number) => {
        const image = images[index];

        if(!image) {
            return;
        }

        if(image.type === "existing") {
            setDeletedImages(prev => [
                ...prev,
                image.value
            ]);
        }
        
        setImages(prev => prev.filter((_, i) => i !== index));
    }

    // 최대 글자 수 200자 제한
    const changeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;

        if (value.length <= 200) {
            setContent(value);
        }
    };

    return (
        <>
            <TopBar title="게시글 수정" prevButton={true} />
            <div className="create-container">
                <form onSubmit={submit}>
                    <div className="form-div">
                        <div className="image-section">
                            <span>이미지를 선택해주세요.(최대 3개)</span>
                            <div className="image-list">
                                {
                                    images.map((image, index) => (
                                        <div key={index} className="image-item">
                                            <img src={
                                                image.type === "existing" ? `${IMAGE_BASE_URL}${image.value}`
                                                :URL.createObjectURL(image.value)} alt="이미지" />
                                            <button className="image-remove" type="button" onClick={() => removeImage(index)}><IoClose size={18} /></button>
                                        </div>
                                    ))
                                }
                                {
                                    images.length < image_maxcount && (
                                        <label className="add-image"><IoAdd size={35} /><input type="file" accept="image/*" hidden onChange={addImage}></input></label>
                                    )
                                }
                            </div>
                        </div>
                        <div className="caption-section">
                            <span>캡션을 입력해주세요.</span>
                            <textarea name="content" value={content} onChange={changeContent} placeholder="(최소 1자 ~ 최대 200자)"></textarea>
                            <span className="caption-count">{content.length} / 200</span>
                        </div>
                    </div>
                    <button type="submit">수정</button>
                </form>
            </div>
        </>
    )
}

export default CoordiEditPage;