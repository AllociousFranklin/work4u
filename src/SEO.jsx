import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({ title, description, keywords }) => {
    const location = useLocation();

    useEffect(() => {
        // Update Title
        document.title = title ? `${title} | Work4U` : "Work4U | Premium Digital Agency";

        // Update Description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description || "Work4U is an elite digital agency specializing in high-end web design, strategic media, and lead generation.");
        }

        // Update OG Title
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.setAttribute('content', title || "Work4U | Premium Digital Agency");
        }

        // Update OG URL
        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) {
            ogUrl.setAttribute('content', `https://wework4u.services${location.pathname}`);
        }

    }, [title, description, location]);

    return null;
};

export default SEO;
