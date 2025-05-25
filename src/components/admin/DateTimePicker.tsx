import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./styles/DateTimePicker.module.css";
import {ItemSwitch} from "../common/ui/switch/ItemSwitch.tsx";

interface DateTimePickerProps {
    label: string;
    date: Date | null;
    onDateChange: (date: Date | null) => void;
    withTime: boolean;
    onToggleTime: () => void;
}

export const DateTimePicker = ({
                                   label,
                                   date,
                                   onDateChange,
                                   withTime,
                                   onToggleTime
                               }: DateTimePickerProps) => {
    return (
        <div className={styles.inputWrapper}>
            <div className={styles.datepicker_container}>
                <label className={styles.label}>{label}</label>
                <DatePicker
                    selected={date}
                    onChange={onDateChange}
                    showTimeSelect={withTime}
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat={withTime ? "dd.MM.yyyy HH:mm" : "dd.MM.yyyy"}
                    placeholderText={withTime ? "ДД.ММ.ГГ. ЧЧ:ММ" : "ДД.ММ.ГГ."}
                    className={styles.item_input_choose}
                />
            </div>
            <ItemSwitch checked={withTime} onChange={onToggleTime} label="Время" />
        </div>
    );
};
