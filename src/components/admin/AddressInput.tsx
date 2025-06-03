import React, { useState } from "react";
import styles from "../../components/common/ui/input/ItemInput.module.css";

const DADATA_API_KEY = "c64433eaa6345e778dfe222fecc3294fde54044e";
const DADATA_URL = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";

interface AddressInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    onSelect: (suggestion: any) => void;  // добавляем onSelect
}

export const AddressInput = ({ label, value, onChange, onSelect }: AddressInputProps) => {
    const [suggestions, setSuggestions] = useState<any[]>([]);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        onChange(val);

        if (val.length < 3) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await fetch(DADATA_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Token ${DADATA_API_KEY}`,
                },
                body: JSON.stringify({ query: val, count: 5 }),
            });

            const result = await response.json();
            setSuggestions(result.suggestions);
        } catch (error) {
            console.error("Ошибка при получении подсказок:", error);
        }
    };

    const handleSelect = (suggestion: any) => {
        onChange(suggestion.value);
        onSelect(suggestion);
        setSuggestions([]);
    };

    return (
        <div className={styles.input_container}>
            <label className={styles.label}>{label}</label>
            <input
                className={styles.item_input}
                type="text"
                value={value}
                onChange={handleChange}
            />
            {suggestions.length > 0 && (
                <ul style={{
                    listStyle: "none",
                    margin: 0,
                    padding: "4px",
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    width: "100%",
                    borderRadius: "0 0 8px 8px",
                    zIndex: 10,
                    maxHeight: "200px",
                    overflowY: "auto"
                }}>
                    {suggestions.map((s, i) => (
                        <li
                            key={i}
                            onClick={() => handleSelect(s)}
                            style={{
                                padding: "8px",
                                cursor: "pointer",
                                borderBottom: "1px solid #eee",
                            }}
                        >
                            {s.value}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};