import Image from "next/image"

const Logo = () => {
  return (
    <div className="flex items-center space-x-2 group">
      <div className="relative w-10 h-10">
        <Image
          src="/logo.png"
          alt="CarHub Logo"
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
        CarHub
      </span>
    </div>
  )
}

export default Logo
