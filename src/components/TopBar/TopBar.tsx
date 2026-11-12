import { useNavigate } from "react-router-dom";
import "./TopBar.css";
import { MdKeyboardDoubleArrowUp, MdEdit, MdHome, MdArrowBack, MdSort, MdLogout } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import api from "../../api/api";
import toast from "react-hot-toast";
import axios from "axios";

type SortOption<T extends string> = {
    label: string;
    value: T;
};

type TopBarProps<T extends string = string> = {
    writeButton?: boolean;
    upButton?: boolean;
    homeButton?: boolean;
    prevButton?: boolean;
    sortButton?: boolean;
    sortOptions?: readonly SortOption<T>[];
    onSortChange?: (value: T) => void;
    logoutButton?: boolean;
    title?: string;
};

const TopBar = <T extends string = string,>({ writeButton = false,
                    upButton = false,
                    homeButton = false,
                    prevButton = false,
                    sortButton = false,
                    sortOptions,
                    onSortChange,
                    logoutButton = false,
                    title ="코디로그" }: TopBarProps<T>) => {

    const navigate = useNavigate();

    const pageUp = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    const [sortOpen, setSortOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if(
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setSortOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const logout = async () => {
        try {
            await api.post("/users/logout",
                {},
            {
                withCredentials: true
            });

            navigate("/", {replace: true});

        } catch(error: unknown) {
        if(axios.isAxiosError(error)) {
            toast.error(error.response?.data.message);
        } else {
            toast.error("알 수 없는 오류가 발생하였습니다.");
        }
        }
    };

    return (
        <>
            <div className="topbar">
                <div className="topbar-left">
                    {
                        upButton && (
                            <button className="up-button" onClick={pageUp}><MdKeyboardDoubleArrowUp /></button>
                        )
                    }
                    {
                        // 홈 버튼
                        // location.pathname === "/coordi/new" 
                        homeButton && (
                            <button className="home-button" onClick={() => navigate("/coordi")}><MdHome /></button>
                        )
                    }
                    {
                        // 뒤로 버튼
                        // editMatch
                        prevButton && (
                            <button className="prev-button" onClick={() => navigate(-1)}><MdArrowBack /></button>
                        )
                    }
                </div>
                <div className="topbar-title">{title}</div>
                <div className="topbar-right">
                    {
                        // 쓰기 버튼
                        writeButton && (
                            <button className="write-button" onClick={() => navigate("/coordi/new")}><MdEdit /></button>
                        )
                    }
                    {
                        sortButton && (
                            <div className="top-sort-wrapper" ref={menuRef}>
                                <button className="top-sort-button" type="button" onClick={() => setSortOpen(prev => !prev)}><MdSort /></button>
                                {
                                    sortOpen && (
                                        <div className="top-sort-menu">
                                            {
                                                // 정렬 버튼
                                                sortOptions?.map((option) => (
                                                    <button key={option.value} type="button" onClick={() => {onSortChange?.(option.value); setSortOpen(false);}}>
                                                        {option.label}
                                                    </button>
                                                ))
                                            }
                                        </div>
                                    )
                                }
                            </div>
                        )
                    }
                    {
                        logoutButton && (
                            <button className="logout-button" onClick={logout}><MdLogout /></button>
                        )
                    }
                </div>
                
            </div>
        </>
    )
}

export default TopBar;