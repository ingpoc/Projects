// useDialog.js
import { useState } from 'react';

export function useDialog() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');

    function showDialog(message, title = 'Error') {
        setModalTitle(title);
        setModalMessage(message);
        setModalIsOpen(true);
    }

    function closeModal() {
        setModalIsOpen(false);
    }

    return {
        modalIsOpen,
        modalMessage,
        showDialog,
        closeModal,
        modalTitle
    };
}