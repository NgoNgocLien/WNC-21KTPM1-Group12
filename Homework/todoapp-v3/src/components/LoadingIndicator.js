import { FadeLoader } from "react-spinners";

export const LoadingIndicator = () => {
    return (
        <div className="loading-indicator">
          <FadeLoader color="#36d7b7" loading={true} size={50}/>
        </div>
    );
};