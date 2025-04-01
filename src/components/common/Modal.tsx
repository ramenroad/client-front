import styled from '@emotion/styled'
import React from 'react'
import tw from 'twin.macro';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <Overlay onClick={onClose}>
            <Wrapper onClick={(e) => e.stopPropagation()}>
                <Title>Modal</Title>
                <CloseButton onClick={onClose}>X</CloseButton>
                {children}
            </Wrapper>
        </Overlay>
    )
}

const Overlay = tw.div`
    fixed top-0 left-0 right-0 bottom-0
    bg-black/40
    flex items-center justify-center
    z-100
`

const Wrapper = styled.div`
    bg-white
    p-20
    rounded-12
    min-w-96
    relative
    font-sans
    box-shadow: 0 4px 6px black/20;
`

const Title = styled.h1`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
    color: black;
`

const CloseButton = styled.button`
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: 24px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    color: gray-600;
    
    &:hover {
        color: black;
        opacity: 0.7;
    }
`