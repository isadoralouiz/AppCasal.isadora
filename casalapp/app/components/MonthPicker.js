// src/components/common/MonthPicker.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

/**
 * @description Componente de seleção de mês.
 * - requirements:
 *   - @react-native-picker/picker : npx expo install @react-native-picker/picker
 * @param {string} param0.selectedMonth - Mês selecionado.
 * @param {function} param0.onMonthChange - Função chamada ao mudar o mês.
 * @returns {JSX.Element} Componente de seleção de mês.
 * @example
 * <MonthPicker selectedMonth="06/2025" onMonthChange={(month) => console.log(month)} />
 */
const MonthPicker = ({ selectedMonth, onMonthChange }) => {
    return (
        <View style={styles.pickerContainer}>
            <Picker
                selectedValue={selectedMonth}
                onValueChange={onMonthChange}
                style={styles.picker}
            >
                <Picker.Item label="Janeiro/2025" value="01/2025" />
                <Picker.Item label="Fevereiro/2025" value="02/2025" />
                <Picker.Item label="Março/2025" value="03/2025" />
                <Picker.Item label="Abril/2025" value="04/2025" />
                <Picker.Item label="Maio/2025" value="05/2025" />
                <Picker.Item label="Junho/2025" value="06/2025" />
                {/* outros meses */}
            </Picker>
        </View>
    );
};

export default MonthPicker;

const styles = StyleSheet.create({
    pickerContainer: {
        backgroundColor: '#f1f1f1',
        borderRadius: 8,
        marginBottom: 24,
    },
    picker: {
        height: 50,
        width: '100%',
    },
});