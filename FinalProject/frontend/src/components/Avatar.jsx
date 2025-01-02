

export default function Avatar({ size = 12, fullname }) {
  return (
    <div className={`rounded-full bg-gray-50 size-${size} justify-center items-center flex bg-red-800 text-white text-2xl`}>
      {fullname.slice(0, 1).toUpperCase()}
    </div>
  )
}
