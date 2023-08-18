'use client'
import { useState } from "react";
import Modal from "../Modal/Modal";
// import styles from ''
// import Modal from "../Modal/Modal";
// import styles from '../Modal';

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <h2>Implementing Modal in Next.js using createPortal</h2>
      <button onClick={() => setShowModal(true)} className="btn">
        Modal
      </button>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)} // Close modal when the user clicks "Close"
      >
        {/* Modal content goes here */}
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
      </Modal>
    </div>
  );
}
