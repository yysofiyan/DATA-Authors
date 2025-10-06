import React, { useState } from 'react';
import { X, FileText, Shield } from 'lucide-react';
import References from '../pages/Dokumentasi';
import Privacy from '../pages/Privacy';
import '../styles/animations.css';

interface GenericModalButtonProps {
    children: React.ReactNode;
    className?: string;
    ariaLabel?: string;
    modalType: 'documentation' | 'privacy';
}

export const GenericModalButton: React.FC<GenericModalButtonProps> = ({
    children,
    className = "",
    ariaLabel,
    modalType
}) => {
    // Set default ariaLabel based on modalType if not provided
    const defaultAriaLabel = ariaLabel || (modalType === 'privacy' ? "Open Privacy Policy" : "Open Documentation");
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => {
        setIsOpen(true);
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsOpen(false);
        // Restore body scroll when modal is closed
        document.body.style.overflow = 'unset';
    };

    // Close modal when clicking outside
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    // Close modal on Escape key
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                closeModal();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    // Determine modal content based on type
    const getModalContent = () => {
        switch (modalType) {
            case 'documentation':
                return <References />;
            case 'privacy':
                return <Privacy />;
            default:
                return <References />;
        }
    };

    // Determine modal title based on type
    const getModalTitle = () => {
        switch (modalType) {
            case 'documentation':
                return 'Referensi & Dokumentasi';
            case 'privacy':
                return 'Kebijakan Privasi';
            default:
                return 'Dokumentasi';
        }
    };

    // Determine modal subtitle based on type
    const getModalSubtitle = () => {
        switch (modalType) {
            case 'documentation':
                return 'Teknologi dan library yang digunakan';
            case 'privacy':
                return 'Portal Penelitian Sinta Profile Scraper';
            default:
                return 'Dokumentasi sistem';
        }
    };

    // Determine icon based on type
    const getIcon = () => {
        switch (modalType) {
            case 'documentation':
                return <FileText className="w-5 h-5" />;
            case 'privacy':
                return <Shield className="w-5 h-5" />;
            default:
                return <FileText className="w-5 h-5" />;
        }
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={openModal}
                className={`
          group relative inline-flex items-center gap-2 
          px-4 py-2 text-sm font-semibold
          transition-all duration-300 ease-in-out
          hover:scale-105 active:scale-95
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${className}
        `}
                aria-label={defaultAriaLabel}
            >
                {/* Button Content */}
                <span className="relative z-10 flex items-center gap-2">
                    {modalType === 'documentation' ? (
                        <FileText className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                    ) : (
                        <Shield className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                    )}
                    {children}
                </span>

                {/* Animated Background */}
                <div className="
          absolute inset-0 rounded-md
          bg-gradient-to-r from-blue-500 to-purple-600
          opacity-0 group-hover:opacity-10
          transition-opacity duration-300
        " />

                {/* Animated Border */}
                <div className="
          absolute inset-0 rounded-md border-2 border-transparent
          bg-gradient-to-r from-blue-500 to-purple-600
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          -z-10
        " style={{
                        background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude'
                    }} />
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div
                    className="
            fixed inset-0 z-50 flex items-center justify-center
            bg-black bg-opacity-50 backdrop-blur-sm
            opacity-0 animate-pulse
          "
                    style={{
                        animation: 'fadeIn 0.3s ease-out forwards'
                    }}
                    onClick={handleBackdropClick}
                >
                    {/* Modal Container */}
                    <div className="
            relative w-full max-w-7xl max-h-[90vh] mx-4
            bg-white rounded-lg shadow-2xl
            overflow-hidden
          " style={{
                            animation: 'slideUp 0.3s ease-out forwards'
                        }}>
                        {/* Modal Header */}
                        <div className="
              sticky top-0 z-10
              flex items-center justify-between
              px-6 py-4 bg-white border-b border-gray-200
              shadow-sm
            ">
                            <div className="flex items-center gap-3">
                                <div className="
                  p-2 rounded-full
                  bg-gradient-to-r from-blue-500 to-purple-600
                  text-white
                ">
                                    {getIcon()}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {getModalTitle()}
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        {getModalSubtitle()}
                                    </p>
                                </div>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={closeModal}
                                className="
                  p-2 rounded-full
                  text-gray-400 hover:text-gray-600 hover:bg-gray-100
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                "
                                aria-label="Close modal"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar">
                            <div className="p-4 pb-8">
                                {getModalContent()}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="
              sticky bottom-0
              px-6 py-4 bg-white border-t border-gray-200
              shadow-sm
            ">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-500">
                                    {modalType === 'documentation'
                                        ? 'Dokumentasi SINTA Scraper'
                                        : 'Kebijakan privasi Portal Penelitian'}
                                </p>
                                <button
                                    onClick={closeModal}
                                    className="
                    px-4 py-2 text-sm font-medium
                    text-gray-700 bg-gray-100 hover:bg-gray-200
                    rounded-md transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  "
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default GenericModalButton;