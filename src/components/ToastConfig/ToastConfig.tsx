import { Toaster } from "react-hot-toast";


const ToastConfig = () => {
    return (
        <Toaster position="bottom-center" containerStyle={{bottom: "100px"}}
        toastOptions={{duration: 2000, style: {borderRadius: "20px", fontSize: "14px"}}} />
    );
};

export default ToastConfig;