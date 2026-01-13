import videoBg from "./assets/moneyy.mp4";

export const Box = ({ className = "fixed top-[21px] left-[291px]" }) => {
    return (
        <div className={`${className} w-[1305px] h-[738px]`}>
            <svg width="1305" height="738" viewBox="0 0 1305 738" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                    <clipPath id="video-mask">
                        <path d="M1021 0C1048.61 0 1071 22.3858 1071 50V64C1071 91.6142 1093.39 114 1121 114H1255C1282.61 114 1305 136.386 1305 164V688C1305 715.614 1282.61 738 1255 738H372.5C346.266 738 325 716.734 325 690.5C325 664.266 303.734 643 277.5 643H50C22.3858 643 0 620.614 0 593V50C0 22.3858 22.3858 0 50 0H1021Z" />
                    </clipPath>
                </defs>
                <foreignObject x="0" y="0" width="1305" height="738" clipPath="url(#video-mask)">
                    <video
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                        src={videoBg}
                    />
                </foreignObject>
            </svg>
        </div>
    );
};
