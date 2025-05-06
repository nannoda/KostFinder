import Link from "next/link";

const Header = () => {
    return (
        <header className="flex justify-between items-center p-4 bg-white shadow-md">
            <div className="text-xl font-bold">LOGO</div>
            <div className="flex items-center space-x-4">
                <button className="bg-black text-white px-4 py-2 rounded">Jadi Pemilik Kost</button>
                <Link href="/login">
                    <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">
                        Login
                    </button>
                </Link>
            </div>
        </header>
    );
};

export default Header;