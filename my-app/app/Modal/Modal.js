'use client'

import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./Modals.module.css";

export default function Modal({ show, onClose, children }) {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
    console.log('modal-root:', document.getElementById('modal-root'));
  }, []);

  const handleClose = () => {
    onClose();
  };

  const modalContent = show ? (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <a href="#" onClick={handleClose}>
            <button className="btn">Close</button>
          </a>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root")
    )
  } else {
    console.log('INDISDE NULLLLLL,LL')
    return null;
  }
}
