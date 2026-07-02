import { Dropdown, Form } from "react-bootstrap";

interface MultiSelectDropdownProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export default function MultiSelectDropdown({
  options,
  selected,
  onChange,
  placeholder = "Select...",
}: MultiSelectDropdownProps) {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((o) => o !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const label = selected.length === 0 ? placeholder : selected.join(", ");

  return (
    <Dropdown autoClose="outside" className="w-100">
      <Dropdown.Toggle
        variant="light"
        className="w-100 text-start d-flex justify-content-between align-items-center border bg-white"
      >
        <span className="text-truncate">{label}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu className="w-100 p-2">
        {options.map((option) => (
          <Form.Check
            key={option}
            type="checkbox"
            id={`ms-${option}`}
            label={option}
            checked={selected.includes(option)}
            onChange={() => toggleOption(option)}
            className="py-1 px-2"
          />
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
