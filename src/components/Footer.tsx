import React from 'react';

interface FooterProps {
    appName?: string;
    githubUsername?: string;
    githubUserId?: string;
}

export const Footer: React.FC<FooterProps> = ({
    appName = 'Sinta Profile Scraper',
    githubUsername = 'yysofiyan',
    githubUserId = '34052001'
}) => {
    const currentYear = new Date().getFullYear();
    const githubAvatarUrl = `https://avatars.githubusercontent.com/u/${githubUserId}?v=4`;
    const githubProfileUrl = `https://github.com/${githubUsername}`;

    return (
        <footer className="footer-brutal">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center">
                    <p className="text-center text-lg font-bold text-black mb-4">
                        {appName} © {currentYear}
                    </p>
                    <div className="flex items-center">
                        <span className="text-lg font-bold text-black mr-2">Dev By</span>
                        <a
                            href={githubProfileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-lg font-bold text-black hover:text-blue-700 transition-colors"
                        >
                            <img
                                src={githubAvatarUrl}
                                alt={githubUsername}
                                className="w-10 h-10 rounded-full mr-2 border-2 border-black"
                            />
                            {/* <span className="font-bold">{githubUsername}</span> */}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};