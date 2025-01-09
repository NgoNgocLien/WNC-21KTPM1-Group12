// notify.js
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Noti = ({ message, id_debt }) => {
  console.log(message)
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(`/customer/debt/${id_debt}`)} className="btn btn-link"> {message} </button>
  )
}

const notify = (message, id_debt = null) => {
  toast.success(
    <Noti message={message} id_debt={id_debt} />,
    {
      position: "top-right",
      autoClose: 8000,
      hideProgressBar: false,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    })
}

export default notify;