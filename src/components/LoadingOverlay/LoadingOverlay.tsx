import { useLoadingStore } from "../../store/loadingStore";
import "./LoadingOverlay.css";

const LoadingOverlay = () => {
    const isLoading = useLoadingStore(
        (state) => state.isLoading
    );

    if(!isLoading) return null;

    return (
        <div className="loading-overlay" role="status">
            <div className="loading-spinner"></div>
            <p>불러오는 중...</p>
        </div>
    );
};

export default LoadingOverlay;