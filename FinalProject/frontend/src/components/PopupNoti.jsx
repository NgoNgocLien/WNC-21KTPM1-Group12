import { BellAlertIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";


export default function PopupNoti() {
  const { notifications } = useSelector((state) => state.notification);

  return (
    <div className="fixed top-4 right-4">
      <div className="flex flex-col gap-y-2">
        {notifications.map((noti, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow-lg max-w-screen-sm">
            <div className="flex items-center justify-start gap-x-4">
              <BellAlertIcon className="text-red-800 h-6 w-6" />
              <div className="flex flex-col">
                <p className="font-semibold text-black text-sm">{noti.title}</p>
                <p className="text-gray-500 text-sm text-ellipsis line-clamp-1">{noti.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
