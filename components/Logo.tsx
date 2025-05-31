import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  className?: string
}

const Logo = ({ className = "" }: LogoProps) => {
  return (
    <Link href="/" className={`flex items-center space-x-2 group ${className}`}>
      <div className="relative w-10 h-8 overflow-hidden">
        <Image
          src="/logo.png"
          alt="CarHub Logo"
          width={40}
          height={32}
          className="object-contain group-hover:scale-110 transition-transform duration-200"
        />
      </div>
      <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
        CarHub
      </span>
    </Link>
  )
}

export default Logo
