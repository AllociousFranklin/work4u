import { Link } from 'react-router-dom';

export const ContactButton = ({ className = "w-[220px] h-[70px]" }) => {
    return (
        <Link to="/contact" className={`${className} block relative group cursor-pointer z-50`}>
            <div className="absolute w-full h-full top-0 left-0 bg-black/90 rounded-[50px] border-[2px] border-solid border-white flex items-center justify-center transition-all duration-300 group-hover:scale-105 active:scale-95 group-active:scale-95 backdrop-blur-sm group-hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] group-hover:border-white/100">
                <span
                    className="text-white text-[18px] font-normal tracking-wide"
                    style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                    Contact Us
                </span>
            </div>
        </Link>
    );
};
