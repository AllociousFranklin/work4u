import { Link } from 'react-router-dom';

export const Footer = () => {
    return (
        <footer className="w-full bg-[#020202] pt-12 pb-6 px-6 md:px-12 relative overflow-hidden z-20 -mt-20">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-start">

                {/* Column 1: Contact Info */}
                <div className="flex flex-col -mt-[30px]">
                    {/* Logo Wrapper */}
                    <div className="flex items-center gap-3 mb-4 relative z-10 pl-1">
                        <h3 className="text-white text-2xl font-normal" style={{ fontFamily: '"Satisfy", cursive' }}>Work4U</h3>
                    </div>

                    {/* Contact Text Wrapper */}
                    <div className="flex flex-col space-y-2 text-white/60 text-xs md:text-sm font-light leading-relaxed relative z-20" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                        <p>
                            No 2A, VNG Road, Moolachatram,<br />
                            MMC, Chennai - 600051
                        </p>
                        <a href="mailto:harish@work4u.services" className="hover:text-[#D4AF37] transition-colors relative inline-block w-fit group">
                            harish@work4u.services
                            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
                        </a>
                        <a href="tel:+918778030212" className="hover:text-[#D4AF37] transition-colors relative inline-block w-fit group">
                            +91 8778030212
                            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
                        </a>
                    </div>
                </div>

                {/* Column 2: Menu */}
                <div className="flex flex-col space-y-4 md:pl-20 -mt-[30px]">
                    <h4 className="text-white text-xs font-bold tracking-[0.2em] uppercase text-[#D4AF37] mt-2" style={{ fontFamily: '"Lexend Peta", sans-serif' }}>Menu</h4>
                    <nav className="flex flex-col space-y-2">
                        {[
                            { name: "Home", path: "/" },
                            { name: "Services", path: "/services" },
                            { name: "Projects", path: "/projects" },
                            { name: "Contact", path: "/contact" },
                        ].map(link => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-white/60 hover:text-white hover:translate-x-2 transition-all duration-300 text-xs font-light w-fit"
                                style={{ fontFamily: '"Montserrat", sans-serif' }}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Column 3: Services */}
                <div className="flex flex-col space-y-4 -mt-[30px]">
                    <h4 className="text-white text-xs font-bold tracking-[0.2em] uppercase text-[#D4AF37] mt-2" style={{ fontFamily: '"Lexend Peta", sans-serif' }}>Services</h4>
                    <nav className="flex flex-col space-y-2">
                        {[
                            "Web Design",
                            "Media Production",
                            "Editing & Post-Processing",
                            "Lead Generation"
                        ].map(service => (
                            <Link
                                key={service}
                                to="/services"
                                className="text-white/60 hover:text-white hover:translate-x-2 transition-all duration-300 text-xs font-light w-fit"
                                style={{ fontFamily: '"Montserrat", sans-serif' }}
                            >
                                {service}
                            </Link>
                        ))}
                    </nav>
                </div>

            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto mt-8 pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-white/20 text-[10px] gap-2">
                <p style={{ fontFamily: '"Montserrat", sans-serif' }}>© 2026 Work4U. All rights reserved.</p>
                <div className="flex space-x-6">
                    <span className="cursor-pointer hover:text-white transition-colors font-light">Privacy Policy</span>
                    <span className="cursor-pointer hover:text-white transition-colors font-light">Terms of Service</span>
                </div>
            </div>
        </footer>
    );
};
