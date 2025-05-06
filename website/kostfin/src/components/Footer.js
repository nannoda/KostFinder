const Footer = () => {
    return (
        <footer className="p-8 bg-gray-900 text-white">
            <div className="grid md:grid-cols-4 gap-8 text-sm">
                <div>
                    <div className="text-lg font-bold mb-2">LOGO</div>
                    <p>Solusi cari kost dan pasang kost mudah & terpercaya.</p>
                </div>
                <div>
                    <div className="font-bold mb-2">COMPANY</div>
                    <ul>
                        <li>About Us</li>
                        <li>Legal Information</li>
                        <li>Contact Us</li>
                        <li>Blogs</li>
                    </ul>
                </div>
                <div>
                    <div className="font-bold mb-2">HELP CENTER</div>
                    <ul>
                        <li>Cari Kost?</li>
                        <li>How to Host?</li>
                        <li>FAQs</li>
                        <li>Rental Guide</li>
                    </ul>
                </div>
                <div>
                    <div className="font-bold mb-2">CONTACT INFO</div>
                    <p>Phone: 123456789</p>
                    <p>support@email.com</p>
                    <p>Location: Surakarta</p>
                    <div className="flex gap-2 mt-2">
                        <span>FB</span>
                        <span>IG</span>
                        <span>TW</span>
                    </div>
                </div>
            </div>
            <div className="mt-8 text-center text-gray-400 text-xs">
                © 2025 Brother Kost Team | All rights reserved
            </div>
        </footer>
    );
};

export default Footer;
