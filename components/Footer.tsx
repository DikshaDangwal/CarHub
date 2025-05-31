import Link from "next/link"
import { footerLinks } from "../constants"
import Logo from "./Logo"

const Footer = () => (
  <footer className="flex flex-col text-black-100 mt-5 border-t border-gray-100 bg-white overflow-hidden">
    <div className="flex max-md:flex-col flex-wrap justify-between gap-5 px-6 py-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col justify-start items-start gap-6">
        {/* Logo */}
        <Logo />
        <p className="text-base text-gray-700 max-w-sm">
          CarHub 2025 <br />
          Your trusted partner for premium car rentals and automotive experiences.
          <br />
          All Rights Reserved &copy;
        </p>
      </div>

      <div className="footer__links">
        {footerLinks.map((item) => (
          <div key={item.title} className="footer__link">
            <h3 className="font-bold text-gray-900 mb-4">{item.title}</h3>
            <div className="flex flex-col gap-3">
              {item.links.map((link) => (
                <Link
                  key={link.title}
                  href={link.url}
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="flex flex-col sm:flex-row justify-between items-center flex-wrap mt-10 border-t border-gray-100 px-6 py-6 gap-4 max-w-7xl mx-auto w-full">
      <p className="text-center sm:text-left text-gray-600 text-sm">@2025 CarHub. All Rights Reserved</p>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
        <Link
          href="/privacy"
          className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-center sm:text-left text-sm"
        >
          Privacy & Policy
        </Link>
        <Link
          href="/terms"
          className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-center sm:text-left text-sm"
        >
          Terms & Condition
        </Link>
      </div>
    </div>
  </footer>
)

export default Footer
