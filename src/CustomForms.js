import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const FIELD_TYPES = {
  INPUT: 'Input',
  CHECKBOX: 'Checkbox',
  DATE: 'Date',
};

const DraggableField = ({ fieldType, addField }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FIELD',
    item: { fieldType },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, cursor: 'pointer' }} onClick={() => addField(fieldType)}>
      {fieldType}
    </div>
  );
};

const CustomForms = () => {
  const { control, handleSubmit } = useForm();
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [fieldProperties, setFieldProperties] = useState({});

  const addField = (fieldType) => {
    const newField = {
      id: Math.random(),
      fieldType,
      label: '',
      length: fieldType === FIELD_TYPES.INPUT ? 255 : undefined, // Example for Input length
    };
    setFields((prevFields) => [...prevFields, newField]);
  };

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'FIELD',
    drop: (item) => addField(item.fieldType),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  const handleFieldClick = (field) => {
    setSelectedField(field);
    setFieldProperties({
      label: field.label,
      length: field.length,
    });
  };

  const handleFieldPropertyChange = (e) => {
    const { name, value } = e.target;
    setFieldProperties((prevProps) => ({
      ...prevProps,
      [name]: value,
    }));

    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === selectedField.id ? { ...field, [name]: value } : field
      )
    );
  };

  const onSubmit = (data) => {
    alert(JSON.stringify(fields));
  };

  return (
    // <DndProvider backend={HTML5Backend}>
    <>
      <div style={{ display: 'flex', width: '100vw', height: '100vh', padding: '20px' }}>
        {/* Left Section */}
        <div style={{ width: '25%', padding: '10px', borderRight: '1px solid gray' }}>
          <h3>Fields</h3>
          <DraggableField fieldType={FIELD_TYPES.INPUT} addField={addField} />
          <DraggableField fieldType={FIELD_TYPES.CHECKBOX} addField={addField} />
          <DraggableField fieldType={FIELD_TYPES.DATE} addField={addField} />
        </div>

        {/* Center Section */}
        <div
          ref={drop}
          style={{
            width: '50%',
            padding: '10px',
            border: '1px solid gray',
            minHeight: '300px',
            backgroundColor: isOver ? '#f0f0f0' : 'white',
          }}
        >
          <h3>Form Section</h3>
          {fields.map((field) => (
            <div
              key={field.id}
              style={{
                padding: '10px',
                border: '1px solid lightgray',
                marginBottom: '5px',
                cursor: 'pointer',
              }}
              onClick={() => handleFieldClick(field)}
            >
              {field.fieldType} - {field.label || 'No Label'}
            </div>
          ))}
        </div>

        {/* Right Section */}
        <div style={{ width: '25%', padding: '10px', borderLeft: '1px solid gray' }}>
          <h3>Field Properties</h3>
          {selectedField ? (
            <>
              <label>Field Label:</label>
              <input
                type="text"
                name="label"
                value={fieldProperties.label || ''}
                onChange={handleFieldPropertyChange}
              />
              {selectedField.fieldType === FIELD_TYPES.INPUT && (
                <>
                  <label>Field Length:</label>
                  <input
                    type="number"
                    name="length"
                    value={fieldProperties.length || ''}
                    onChange={handleFieldPropertyChange}
                  />
                </>
              )}
            </>
          ) : (
            <p>Select a field to view its properties</p>
          )}
        </div>
      </div>
      <div style={{ padding: '10px', textAlign: 'right' }}>
        <button onClick={handleSubmit(onSubmit)}>Save</button>
      </div>
      </>
    // </DndProvider>
  );
};

export default CustomForms;
