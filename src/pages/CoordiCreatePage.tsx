import React, { useState } from "react";
import "./CoordiCreatePage.css";
import TopBar from "../components/TopBar/TopBar";
import { IoClose } from "react-icons/io5";
import { IoAdd } from "react-icons/io5";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CoordiCreatePage = () => {

    const [content, setContent] = useState("");
    const [images, setImages] = useState<File[]>([]);

    const navigation = useNavigate();

    const image_maxcount = 3;

    

    // 글쓰기
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
            formData.append("images", image);
        })

        try {
            await api.post("/coordi", formData);

            toast.success("게시글이 작성되었습니다.");

            navigation("/coordi");
        } catch(error) {
            toast.error("게시글을 작성하는데 실패하였습니다.");
        }

    };

    // 이미지 추가
    const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if(!file) {
            return;
        }

        setImages(prev => [...prev, file]);

        e.target.value = "";
    }

    // 이미지 삭제
    const removeImage = (index: number) => {
        
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
            <TopBar homeButton={true} />
            <div className="create-container">
                <form onSubmit={submit}>
                    <div className="form-div">
                        <div className="image-section">
                            <span>이미지를 선택해주세요.(최대 3개)</span>
                            <div className="image-list">
                                {
                                    images.map((image, index) => (
                                        <div key={index} className="image-item">
                                            <img src={URL.createObjectURL(image)} alt="이미지" />
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
                    <button type="submit">등록</button>
                </form>
            </div>
        </>
    )
}

export default CoordiCreatePage;