import { ChangeEvent, useState } from "react"
import { PurchaseOrder } from "./Domain"

interface Props {
    onClose: () => void
    data: PurchaseOrder
    onSave: (updatedData: PurchaseOrder) => void
}

function EditModal({
    onClose,
    data,
    onSave
}: Props
) {
    const [formData, setFormData] = useState(data);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'purchasePrice' || name === 'purchaseQuantity' ? Number(value) : value,
        }))
    }

    const handleSubmit = () => { onSave(formData) };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <div
                style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    width: '300px'
                }}>
                <h2>Edit Details</h2>
                <label>Purchase Order Number
                    <input
                        type="text"
                        name="purchaseOrderNumber"
                        value={formData.purchaseOrderNumber}
                        onChange={handleChange} />
                </label>
                <br />
                <label>Item Number
                    <input
                        type="number"
                        name="itemNumber"
                        value={formData.itemNumber}
                        onChange={handleChange} />
                </label>
                <br />
                <label>Item Name
                    <input
                        type="text"
                        name="itemName"
                        value={formData.itemName}
                        onChange={handleChange} />
                </label>
                <br />
                <label>Item Description
                    <input
                        type="text"
                        name="itemDescription"
                        value={formData.itemDescription}
                        onChange={handleChange} />
                </label>
                <br />
                <label>Purchase Price
                    <input
                        type="number"
                        name="purchasePrice"
                        value={formData.purchasePrice}
                        onChange={handleChange} />
                </label>
                <br />
                <label>Purchase Quantity
                    <input
                        type="number"
                        name="purchaseQuantity"
                        value={formData.purchaseQuantity}
                        onChange={handleChange} />
                </label>
                <br />
                <button onClick={handleSubmit} style={{ marginTop: '10px' }}>Save</button>
                <button onClick={onClose} style={{ marginTop: '10px', marginLeft: '10px' }}>Cancel</button>
            </div>
        </div>
    )
}

export default EditModal;