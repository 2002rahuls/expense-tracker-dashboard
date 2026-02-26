"use client";

export default function DeleteModal({ onConfirm, onCancel, itemDescription }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-box">
        <div className="modal-icon" aria-hidden="true">🗑️</div>
        <h2 className="modal-title" id="modal-title">Delete Expense?</h2>
        <p className="modal-desc">
          {itemDescription
            ? `This will permanently delete "${itemDescription}". This action cannot be undone.`
            : "This will permanently delete this expense. This action cannot be undone."}
        </p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} autoFocus>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
