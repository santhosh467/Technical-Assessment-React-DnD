import React, { useState, useRef, useEffect } from 'react';
import './FdCss.css';
import { useDrag, useDrop } from 'react-dnd';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function FormDesign() {
    const [dragField, setDragField] = useState([]);
    const [selectedField, setSelectedField] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [focusOn, setFocusOn] = useState(''); 

    
    const moveItem = (dragIndex, hoverIndex) => {
        const updatedFields = [...dragField];
        const [removed] = updatedFields.splice(dragIndex, 1);
        updatedFields.splice(hoverIndex, 0, removed);
        setDragField(updatedFields);
    };

    const moveField = (item) => {
        setDragField((prevItems) => [
            ...prevItems,
            { ...item, id: Date.now(), name: '', maxLength: '' } 
        ]);
    };

    const DragField = ({ type }) => {
        const [{ isDragging }, drag] = useDrag(() => ({
            type: "field",
            item: { type },
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        }));

        const handleClick = () => {
            moveField({ type });
        };

        return (
            <div ref={drag} onClick={handleClick} style={{ opacity: isDragging ? 0.5 : 1 }}>
                {type}
            </div>
        );
    };

    const DropField = () => {
        const [, drop] = useDrop(() => ({
            accept: "field",
            drop: (item) => moveField(item),
        }));

        return (
            <div ref={drop} className='dropSection'>
                {dragField.length > 0 ? (
                    dragField.map((item, index) => (
                        <DraggableField
                            key={item.id}
                            item={item}
                            index={index}
                            onSelect={() => setSelectedField(item)}
                            isSelected={selectedField === item}
                            moveItem={moveItem}
                        />
                    ))
                ) : (
                    <div>No fields added yet</div>
                )}
            </div>
        );
    };

    const DraggableField = ({ item, index, onSelect, isSelected, moveItem }) => {
        const ref = useRef(null);

        const [{ isDragging }, drag] = useDrag({
            type: "field-item",
            item: { index },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        });

        const [, drop] = useDrop({
            accept: "field-item",
            hover: (draggedItem) => {
                if (draggedItem.index !== index) {
                    moveItem(draggedItem.index, index);
                    draggedItem.index = index;
                }
            },
        });

        drag(drop(ref));

        return (
            <div
                ref={ref}
                onClick={onSelect}
                className={`draggable-field ${isSelected ? 'field-selected' : ''}`}
                style={{ opacity: isDragging ? 0.5 : 1 }}
            >
                {item.name || item.type}
            </div>
        );
    };

    const handlePropertyChange = (property, value) => {
        const updatedSelectedField = { ...selectedField, [property]: value };
        const updatedFields = dragField.map(field =>
            field === selectedField ? updatedSelectedField : field
        );

        setDragField(updatedFields);
        setSelectedField(updatedSelectedField);
    };

    const PropertiesField = () => {
        const labelRef = useRef(null);
        const maxLengthRef = useRef(null);

        useEffect(() => {
            if (selectedField && focusOn === 'name' && labelRef.current) {
                labelRef.current.focus();
            } else if (selectedField && focusOn === 'maxLength' && maxLengthRef.current) {
                maxLengthRef.current.focus();
            }
        }, [selectedField, focusOn]);

        if (!selectedField) return <div>Select a field to set properties</div>;

        const getFieldProperties = () => {
            switch (selectedField.type) {
                case "Input":
                    return (
                        <>
                            <div className='form-group'>
                                <label>Field Label</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={selectedField?.name || ''}
                                    onChange={(e) => handlePropertyChange('name', e.target.value)}
                                    ref={labelRef}
                                    onFocus={() => setFocusOn('name')}
                                />
                            </div>
                            <div className='form-group'>
                                <label>Field Max Length</label>
                                <input
                                    type='number'
                                    className='form-control'
                                    value={selectedField?.maxLength || ''}
                                    onChange={(e) => handlePropertyChange('maxLength', e.target.value)}
                                    ref={maxLengthRef}
                                    onFocus={() => setFocusOn('maxLength')}
                                />
                            </div>
                        </>
                    );
                case "Date":
                    return (
                        <div className='form-group'>
                            <label>Field Label</label>
                            <input
                                type='text'
                                className='form-control'
                                value={selectedField?.name || ''}
                                onChange={(e) => handlePropertyChange('name', e.target.value)}
                                ref={labelRef}
                                onFocus={() => setFocusOn('name')}
                            />
                        </div>
                    );
                case "Checkbox":
                    return (
                        <div className='form-group'>
                            <label>Field Label</label>
                            <input
                                type='text'
                                className='form-control'
                                value={selectedField?.name || ''}
                                onChange={(e) => handlePropertyChange('name', e.target.value)}
                                ref={labelRef}
                                onFocus={() => setFocusOn('name')}
                            />
                        </div>
                    );
                default:
                    return null;
            }
        };

        return getFieldProperties();
    };

    const validateField = (field) => {
        if (!field.name.trim()) {
            return false;
        }
        if (field.type === 'Input' && field.maxLength && (isNaN(field.maxLength) || field.maxLength <= 0 )) {
            return false;
        }
        return true;
    };
    const handleSave = () => {
        const valid = dragField.every(field => field.name);
        if (!valid) {
            alert("All fields must have a name.");
            return;
        }
        const fieldNames = dragField.map(field => field.name.trim());
        const hasDuplicates = new Set(fieldNames).size !== fieldNames.length;
        if (hasDuplicates) {
            alert("Field names must be unique.");
            return;
        }
        const validProp = dragField.every(validateField);
    if (!validProp) {
        alert("Please ensure all fields have valid properties.");
        return;
    }
        setShowPreview(true); 
    };

    const handleClear = () => {
        setDragField([]);
        setSelectedField(null);
    };

    const FieldPreview = () => {
        
        return (
            <>
                {dragField.map((field, index) => {
                    switch (field.type) {
                        case "Input":
                            return (
                                <div key={index} className="form-group preview-field">
                                    <label>{field.name || 'Input Field'}</label>
                                    <input type="text" maxLength={field.maxLength} className='form-control' />
                                </div>
                            );
                        case "Checkbox":
                            return (
                                <div key={index} className="form-group preview-field d-flex">
                                    <input type="checkbox" className='custom-checkbox mr-2' />
                                    <label className='mb-0'>{field.name || 'Checkbox Field'}</label>
                                </div>
                            );
                        case "Date":
                            return (
                                <div key={index} className="form-group preview-field">
                                    <label>{field.name || 'Date Field'}</label>
                                    <input type="date" className='form-control' />
                                </div>
                            );
                        default:
                            return null;
                    }
                })}
            </>
        );
    };

    return (
        <div className='container-fluid'>
            <form className='row pt-2'>
                <div className='col-sm-8 col-9 text-left'>
                    <h3>Custom Forms</h3>
                </div>
                <div className='col-sm-4 col-3 text-right'>
                    <button className='btn btn-save' type='button' onClick={handleSave}><i className='fa fa-save'></i> <span className='d-md-inline d-sm-none d-none pl-1'>Save</span></button>
                    <button className='btn btn-clear ml-1' type='button' onClick={handleClear}><i className='fa fa-times'></i> <span className='d-md-inline d-sm-none d-none pl-1'>Clear</span></button>
                </div>
                <div className='col-md-3'>
                    <div className='card height-adjust'>
                        <h3>Select Field Type</h3>
                        <div className='listDesign'>
                            <DragField type="Input" />
                            <DragField type="Checkbox" />
                            <DragField type="Date" />
                        </div>
                    </div>
                </div>
                <div className='col-md-6'>
                    <h3>Add / Edit Field</h3>
                    <div className='card height-adjust-middle'>
                        <DropField />
                    </div>
                </div>
                <div className='col-md-3'>
                    <div className='card card-lavender height-adjust'>
                        <h3>Field Properties</h3>
                        <PropertiesField />
                    </div>
                </div>
            </form>

           
            <Modal
                isOpen={showPreview}
                onRequestClose={() => setShowPreview(false)}
                contentLabel="Form Preview"
                className="Modal"
                overlayClassName="Overlay"
            >
                <h2>Form Preview</h2>
                <div>
                    <FieldPreview />
                </div>
                <div className='text-right'>
                    <button className="btn btn-close" onClick={() => setShowPreview(false)}><i className='fa fa-times pr-1'></i> Close</button>
                </div>
            </Modal>
        </div>
    );
}

export default FormDesign;
