import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
} from "lucide-react";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white text-sm">
            <div className="max-w-7xl mx-auto py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
                {/* Logo & Deskripsi */}
                <div className="">
                    <img
                        src="/logo/logo_kostfin_white.png"
                        alt="Logo KostFinder"
                        className="mb-4"
                    />
                    <p className="text-sm text-gray-400">
                        Solusi modern untuk menemukan dan mempromosikan kost dengan cepat, aman, dan terpercaya. KostFinder hadir untuk memenuhi kebutuhan hunian Anda.
                    </p>


                </div>

                {/* Company */}
                <div className="ml-20">
                    <h3 className="font-bold mb-3 text-white">COMPANY</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li>About Us</li>
                        <li>Legal Information</li>
                        <li>Contact Us</li>
                        <li>Blogs</li>
                    </ul>
                </div>

                {/* Help Center */}
                <div className="ml-20">
                    <h3 className="font-bold mb-3 text-white">HELP CENTER</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li>Cari Kost?</li>
                        <li>How To Host?</li>
                        <li>Why Us?</li>
                        <li>FAQs</li>
                        <li>Rental Guides</li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="ml-20">
                    <h3 className="font-bold mb-3 text-white">CONTACT INFO</h3>
                    <p className="text-gray-300">Phone: 08123456789</p>
                    <p className="text-gray-300">Email: kostfinderofc@gmail.com</p>
                    <p className="text-gray-300">Location: Surakarta</p>
                    <div className="flex gap-4 mt-4 text-gray-400">
                        <Facebook size={18} className="hover:text-white cursor-pointer" />
                        <Twitter size={18} className="hover:text-white cursor-pointer" />
                        <Instagram size={18} className="hover:text-white cursor-pointer" />
                        <Linkedin size={18} className="hover:text-white cursor-pointer" />
                    </div>
                </div>
            </div>

            {/* Bottom Line */}
            <div className="border-t border-gray-800 py-4 px-6 text-xs text-gray-400 flex flex-col md:flex-row justify-between items-center">
                <span>
                    © 2025 KostFinder Team{' '}
                    <Link href="/dashboard/admin">
                        |
                    </Link>{' '}
                    All rights reserved
                </span>
                <span>
                    Created with love by <span className="font-semibold text-white">KostFinder Team</span>
                </span>
            </div>
        </footer>
    );
};

export default Footer;
