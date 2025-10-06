import React from 'react';
import { AnimatedModalButton } from './AnimatedModalButton';
import { GenericModalButton } from './GenericModalButton';
// FooterProps interface to define the props for the Footer component
interface FooterProps {
    appName?: string;
    githubUsername?: string;
    githubUserId?: string;
    linkedinUrl?: string;
    scopusUrl?: string;
    googleScholarUrl?: string;
}
// Footer component to display the application footer with social links
export const Footer: React.FC<FooterProps> = ({
    appName = 'Sinta Profile Scraper',
    githubUsername = 'yysofiyan',
    githubUserId = '34052001',
    linkedinUrl = 'https://linkedin.com/in/yysofiyan',
    scopusUrl = 'https://www.scopus.com/authid/detail.uri?authorId=57421449500',
    googleScholarUrl = 'https://scholar.google.com/citations?hl=en&user=OX1ogLQAAAAJ'
}) => {
    const currentYear = new Date().getFullYear();
    const githubAvatarUrl = `https://avatars.githubusercontent.com/u/${githubUserId}?v=4`;
    const githubProfileUrl = `https://github.com/${githubUsername}`;

    return (
        <footer className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="border-t border-slate-900/5 py-10">
                {/* Logo/Icon Section */}
                <div className="mx-auto h-8 w-auto text-slate-900 flex items-center justify-center mb-8">
                </div>

                {/* Social Media Links */}
                <div className="flex items-center justify-center space-x-6 mb-8">
                    {/* LinkedIn */}
                    <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-600 hover:text-blue-600 transition-colors"
                        aria-label="LinkedIn Profile"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                    </a>

                    {/* Scopus */}
                    <a
                        href={scopusUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-600 hover:text-orange-600 transition-colors"
                        aria-label="Scopus Profile"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 512 512">
                            <path d="M64 64v384h384V64Zm116.815 99.926c22.222 0 32.04 2.586 45.736 8.27l-1.292 20.411c-14.729-8.785-26.356-11.367-43.152-11.367c-19.379 0-29.2 14.727-29.2 28.163c0 18.088 17.313 24.807 33.592 34.626c20.93 12.403 42.636 23.514 42.636 48.062c0 32.299-27.65 48.577-54.006 48.577c-18.863 0-32.557-2.843-45.993-9.044l3.102-20.414c13.178 8.01 24.547 11.889 41.86 11.889c17.57 0 32.297-11.887 32.297-28.424c0-17.054-16.535-23.516-32.297-33.076c-21.189-12.92-44.444-24.29-44.444-50.646s19.379-47.027 51.161-47.027m161.705 0c26.097 0 37.725 3.102 51.937 9.82l-1.55 19.38c-15.504-8.527-31.783-11.886-52.971-11.886c-33.592 0-62.274 26.613-62.274 69.765c0 40.826 29.2 71.575 65.892 71.575c16.795 0 33.591-3.359 49.353-11.886l1.55 19.638c-13.953 6.977-31.523 9.82-52.71 9.82c-42.12 0-87.338-31.01-87.338-87.597c0-49.612 37.982-88.63 88.11-88.63" opacity=".999"/>
                        </svg>
                    </a>

                    {/* Google Scholar */}
                    <a
                        href={googleScholarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-600 hover:text-blue-700 transition-colors"
                        aria-label="Google Scholar Profile"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/>
                        </svg>
                    </a>

                    {/* GitHub */}
                    <a
                        href={githubProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-600 hover:text-gray-900 transition-colors"
                        aria-label="GitHub Profile"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                    </a>
                </div>

                {/* Developed By Section */}
                <div className="flex items-center justify-center mb-6">
                    <span className="text-sm text-slate-500 mr-3">
                        Made with
                        <span className="inline-block animate-pulse mx-1">❤️</span>
                        x
                        <span className="inline-block animate-bounce mx-1">☕</span>
                        by
                    </span>
                    <a
                        href={githubProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center group"
                    >
                        <img
                            src={githubAvatarUrl}
                            alt={`${githubUsername} developer photo`}
                            className="w-8 h-8 rounded-full border-2 border-slate-200 group-hover:border-slate-400 transition-colors"
                            loading="lazy"
                        />
                        <span className="ml-2 text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                            {/* @{githubUsername} */}
                        </span>
                    </a>
                </div>
                
                {/* Copyright */}
                <p className="text-center text-sm leading-6 text-slate-500 mb-6">
                    © {currentYear} {appName}. All rights reserved.
                </p>
                
                {/* Additional Links */}
                <div className="flex items-center justify-center space-x-4 text-sm font-semibold leading-6 text-slate-700">
                    <GenericModalButton
                        modalType="privacy"
                        className="hover:text-slate-900 transition-colors"
                    >
                        Privacy Policy
                    </GenericModalButton>
                    <div className="h-4 w-px bg-slate-500/20"></div>
                    <AnimatedModalButton
                        className="hover:text-slate-900 transition-colors"
                        ariaLabel="Open References Documentation"
                    >
                        Documentation
                    </AnimatedModalButton>
                </div>
            </div>
        </footer>
    );
};