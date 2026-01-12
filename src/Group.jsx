import { Link } from 'react-router-dom';
// Navigation Component

export const Group = ({ className }) => {
    return (
        <div className={`w-[920px] h-[54px] relative ${className}`}>
            {/* Background with more subtle white tint to blend with video */}
            <div className="absolute w-full h-full top-0 left-0 bg-white/[0.05] rounded-[50px] border-[2px] border-white/20 backdrop-blur-[15px] shadow-lg" />

            {/* Navigation Buttons */}
            <div className="absolute w-full h-full top-0 left-0 flex items-center justify-evenly px-16 z-10">
                {[
                    { name: "Home", path: "/" },
                    { name: "Services", path: "/services" },
                    { name: "Projects", path: "/projects" },
                    { name: "Contact", path: "/contact" }
                ].map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className="text-white text-[17px] font-medium tracking-widest hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer bg-transparent border-none outline-none shadow-none hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] no-underline"
                        style={{ fontFamily: '"Montserrat", sans-serif' }}
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
        </div>
    );
};
