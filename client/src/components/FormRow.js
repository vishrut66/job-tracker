import React from "react";

const FormRow = ({ type, name, value, handleChange, labeltext }) => {
    return (
        <div className="form-row">
            <label htmlFor={name} className="form-label">{labeltext || name}</label>

            <input type={type} value={value} name={name} onChange={handleChange} className='form-input' />
        </div>
    )
}

export default FormRow;