import React, { useEffect } from 'react'
import tw from 'twin.macro';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    useEffect(() => {
        if (isOpen) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        } else {
            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = '0';
        }
        return () => {
            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = '0';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <Overlay onClick={onClose}>
            <Wrapper onClick={(e) => e.stopPropagation()}>
                {children}
            </Wrapper>
        </Overlay>
    )
}

const Overlay = tw.div`
    fixed inset-0
    bg-black/40
    flex items-center justify-center
    z-100
`

const Wrapper = tw.div`
    flex flex-col
    bg-white
    rounded-12
    shadow-lg
`