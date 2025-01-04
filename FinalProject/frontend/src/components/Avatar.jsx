

export default function Avatar({ size = 12, fullname }) {
  return (
    <div className={`rounded-full w-${size} h-${size} justify-center items-center flex bg-red-800 text-white text-2xl`}>
      {fullname.slice(0, 1).toUpperCase()}
    </div>
  )
}
