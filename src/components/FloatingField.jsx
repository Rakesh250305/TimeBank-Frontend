import React from "react";

export default function FloatingField({
  label,
  name,
  value,
  onChange,
  type = "text",
  textarea = false,
  required = false,
  bg = "bg-gray-800",
}) {
  return (
    <div className="relative w-full mb-1">
      {textarea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={label}
          required={required}
          rows={4}
          className={`peer w-full p-3 rounded-lg ${bg} text-white border border-white focus:outline-none focus:ring-2 focus:ring-gray-700 placeholder-transparent resize-none transition-all duration-200`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={label}
          required={required}
          className={`peer w-full p-3 rounded-lg ${bg} text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 placeholder-transparent transition-all duration-200`}
        />
      )}
      <label
        htmlFor={name}
        className={`absolute left-3 px-1 ${bg} transition-all duration-200
          ${
            value
              ? "-top-2 text-sm text-blue-500"
              : "top-3 text-base text-gray-400 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-500"
          }`}
      >
        {label}
      </label>
    </div>
  );
}
