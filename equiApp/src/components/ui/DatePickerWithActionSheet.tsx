/**
 * DatePickerWithActionSheet Component
 * Selector de fechas con react-native-calendars dentro de ActionSheet
 * Soporta temas light/dark y está completamente localizado en español
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextStyle, ViewStyle } from 'react-native';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { Colors, Spacing, BorderRadius } from '@/src/constants';
import { useColorScheme } from '@/src/hooks';
import AntDesignIcon from '@expo/vector-icons/AntDesign';
import { ThemedText } from './ThemedText';
import { ThemedActionSheet } from './ThemedActionSheet';
import { ThemedButton } from './ThemedButton';

// Tipo completo del tema del calendario (react-native-calendars)
export interface CalendarTheme {
  backgroundColor?: string;
  calendarBackground?: string;
  textSectionTitleColor?: string;
  textSectionTitleDisabledColor?: string;
  selectedDayBackgroundColor?: string;
  selectedDayTextColor?: string;
  todayTextColor?: string;
  dayTextColor?: string;
  textDisabledColor?: string;
  textInactiveColor?: string;
  dotColor?: string;
  selectedDotColor?: string;
  arrowColor?: string;
  disabledArrowColor?: string;
  monthTextColor?: string;
  indicatorColor?: string;
  textDayFontFamily?: TextStyle['fontFamily'];
  textMonthFontFamily?: TextStyle['fontFamily'];
  textDayHeaderFontFamily?: TextStyle['fontFamily'];
  textDayFontWeight?: TextStyle['fontWeight'];
  textMonthFontWeight?: TextStyle['fontWeight'];
  textDayHeaderFontWeight?: TextStyle['fontWeight'];
  textDayFontSize?: number;
  textMonthFontSize?: number;
  textDayHeaderFontSize?: number;
  todayBackgroundColor?: string;
  todayButtonTextColor?: string;
  todayDotColor?: string;
  arrowHeight?: number;
  arrowWidth?: number;
  weekVerticalMargin?: number;
  textDayStyle?: TextStyle;
  arrowStyle?: ViewStyle;
}

// Configurar locale en español
LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ],
  monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

interface Props {
  dateOfBirth: Date | null;
  onDateChange: (date: Date) => void;
}

export function DatePickerWithActionSheet({ dateOfBirth, onDateChange }: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    dateOfBirth?.toISOString().split('T')[0] || ''
  );

  const formatDate = (date: Date | null) => {
    if (!date) return 'Seleccionar fecha';
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  const handleConfirm = () => {
    if (selectedDate) {
      onDateChange(new Date(selectedDate));
      setShowDatePicker(false);
    }
  };

  // Configurar el tema completo del calendario según el modo (light/dark)
  const calendarTheme: CalendarTheme = {
    // Background colors
    backgroundColor: colors.background,
    calendarBackground: colors.card,
    
    // Text colors - Títulos y headers
    textSectionTitleColor: colors.textSecondary,
    textSectionTitleDisabledColor: colors.border,
    monthTextColor: colors.text,
    
    // Text colors - Días
    dayTextColor: colors.text,
    selectedDayTextColor: '#ffffff',
    todayTextColor: colors.accent,
    textDisabledColor: colors.border,
    textInactiveColor: colorScheme === 'dark' ? '#555' : '#d9e1e8',
    
    // Selected day styling
    selectedDayBackgroundColor: colors.primary,
    todayBackgroundColor: 'transparent',
    
    // Dots (marcadores)
    dotColor: colors.primary,
    selectedDotColor: '#ffffff',
    todayDotColor: colors.accent,
    
    // Arrows (navegación de meses)
    arrowColor: colors.primary,
    disabledArrowColor: colors.border,
    arrowHeight: 20,
    arrowWidth: 20,
    
    // Indicators
    indicatorColor: colors.primary,
    
    // Typography - Font weights
    textDayFontWeight: '400',
    textMonthFontWeight: '600',
    textDayHeaderFontWeight: '500',
    
    // Typography - Font sizes
    textDayFontSize: 16,
    textMonthFontSize: 18,
    textDayHeaderFontSize: 14,
    
    // Spacing
    weekVerticalMargin: 8,
  };

  const markedDates = selectedDate
    ? {
        [selectedDate]: {
          selected: true,
          selectedColor: colors.primary,
        },
      }
    : {};

  return (
    <>
      {/* Campo de fecha */}
      <View>
        <ThemedText type="defaultSemiBold" style={styles.label}>
          Fecha de Nacimiento
        </ThemedText>
        <TouchableOpacity
          style={[
            styles.dateButton,
            { backgroundColor: colors.card, borderColor: colors.border }
          ]}
          onPress={() => setShowDatePicker(true)}
        >
          <AntDesignIcon name="calendar" size={20} color={colors.text} />
          <ThemedText style={[styles.dateText, !dateOfBirth && styles.datePlaceholder]}>
            {formatDate(dateOfBirth)}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* ActionSheet con Calendar */}
      <ThemedActionSheet
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        title="Selecciona tu fecha de nacimiento"
        snapPoint="large"
      >
        <View style={styles.calendarContainer}>
          <Calendar
            current={selectedDate || new Date().toISOString().split('T')[0]}
            maxDate={new Date().toISOString().split('T')[0]} // No permitir fechas futuras
            onDayPress={handleDayPress}
            markedDates={markedDates}
            theme={calendarTheme}
            enableSwipeMonths={true}
            hideExtraDays={true}
            firstDay={1} // Lunes como primer día de la semana
            style={styles.calendar}
          />

          <ThemedButton
            label="Confirmar"
            onPress={handleConfirm}
            style={styles.confirmButton}
          />
        </View>
      </ThemedActionSheet>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: Spacing.sm,
    fontSize: 14,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  dateText: {
    flex: 1,
  },
  datePlaceholder: {
    opacity: 0.5,
  },
  calendarContainer: {
    paddingBottom: Spacing.md,
  },
  calendar: {
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  confirmButton: {
    marginTop: Spacing.md,
  },
});
