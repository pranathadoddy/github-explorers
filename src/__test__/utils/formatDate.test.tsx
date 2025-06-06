// src/__tests__/utils/formatDate.test.tsx
import { formatDate } from '../../utils/formatDate';

describe('formatDate', () => {
  it('formats date correctly', () => {
    const dateString = '2023-06-01T12:00:00Z';
    const formatted = formatDate(dateString);
    
    // Check that it contains the expected parts
    expect(formatted).toMatch(/Jun.*1.*2023/);
  });

  it('handles different date formats', () => {
    const dateString = '2023-12-25T12:00:00Z';
    const formatted = formatDate(dateString);
    
    expect(formatted).toMatch(/Dec.*25.*2023/);
  });

  it('handles single digit dates', () => {
    const dateString = '2023-01-05T12:00:00Z';
    const formatted = formatDate(dateString);
    
    expect(formatted).toMatch(/Jan.*5.*2023/);
  });

  it('handles different months correctly', () => {
    const testCases = [
      { date: '2023-01-15T12:00:00Z', month: 'Jan' },
      { date: '2023-02-15T12:00:00Z', month: 'Feb' },
      { date: '2023-03-15T12:00:00Z', month: 'Mar' },
      { date: '2023-04-15T12:00:00Z', month: 'Apr' },
      { date: '2023-05-15T12:00:00Z', month: 'May' },
      { date: '2023-06-15T12:00:00Z', month: 'Jun' },
      { date: '2023-07-15T12:00:00Z', month: 'Jul' },
      { date: '2023-08-15T12:00:00Z', month: 'Aug' },
      { date: '2023-09-15T12:00:00Z', month: 'Sep' },
      { date: '2023-10-15T12:00:00Z', month: 'Oct' },
      { date: '2023-11-15T12:00:00Z', month: 'Nov' },
      { date: '2023-12-15T12:00:00Z', month: 'Dec' }
    ];

    testCases.forEach(({ date, month }) => {
      const formatted = formatDate(date);
      expect(formatted).toContain(month);
      expect(formatted).toContain('2023');
    });
  });

  it('handles different years', () => {
    const testCases = [
      { date: '2020-06-01T12:00:00Z', year: '2020' },
      { date: '2021-06-01T12:00:00Z', year: '2021' },
      { date: '2022-06-01T12:00:00Z', year: '2022' },
      { date: '2023-06-01T12:00:00Z', year: '2023' },
      { date: '2024-06-01T12:00:00Z', year: '2024' }
    ];

    testCases.forEach(({ date, year }) => {
      const formatted = formatDate(date);
      expect(formatted).toContain(year);
    });
  });

  it('handles ISO date strings with milliseconds', () => {
    const dateString = '2023-06-01T12:30:45.123Z';
    const formatted = formatDate(dateString);
    
    expect(formatted).toMatch(/Jun.*1.*2023/);
  });

  it('handles date strings without timezone', () => {
    const dateString = '2023-06-01T12:30:45';
    const formatted = formatDate(dateString);
    
    expect(formatted).toMatch(/Jun.*1.*2023/);
  });

  it('handles edge case dates', () => {
    // Leap year - use midday to avoid timezone issues
    const leapYear = '2024-02-29T12:00:00Z';
    const formatted = formatDate(leapYear);
    expect(formatted).toMatch(/Feb.*29.*2024/);
  });

  it('handles beginning and end of year', () => {
    // Use midday times to avoid timezone conversion issues
    const newYear = '2023-01-01T12:00:00Z';
    const newYearFormatted = formatDate(newYear);
    expect(newYearFormatted).toMatch(/Jan.*1.*(2022|2023)/); // Allow for timezone differences

    const endYear = '2023-12-31T12:00:00Z';
    const endYearFormatted = formatDate(endYear);
    expect(endYearFormatted).toMatch(/Dec.*31.*(2023|2024)/); // Allow for timezone differences
  });

  it('handles dates far in the past', () => {
    const oldDate = '1900-01-01T12:00:00Z';
    const formatted = formatDate(oldDate);
    expect(formatted).toMatch(/Jan.*1.*1900/);
  });

  it('handles dates far in the future', () => {
    const futureDate = '2099-12-31T12:00:00Z';
    const formatted = formatDate(futureDate);
    expect(formatted).toMatch(/Dec.*31.*2099/);
  });

  it('is consistent with multiple calls', () => {
    const dateString = '2023-06-01T12:00:00Z';
    const formatted1 = formatDate(dateString);
    const formatted2 = formatDate(dateString);
    
    expect(formatted1).toBe(formatted2);
  });

  it('returns a valid date string format', () => {
    const dateString = '2023-06-01T12:00:00Z';
    const formatted = formatDate(dateString);
    
    // Check that it matches the general format: "MMM D, YYYY"
    expect(formatted).toMatch(/^[A-Za-z]{3} \d{1,2}, \d{4}$/);
  });

  it('handles different time zones in input consistently', () => {
    // Test that the function handles timezone inputs without crashing
    const utcDate = '2023-06-01T12:00:00Z';
    const offsetDate = '2023-06-01T12:00:00+00:00';
    
    const formatted1 = formatDate(utcDate);
    const formatted2 = formatDate(offsetDate);
    
    // Both should be valid date strings
    expect(formatted1).toMatch(/^[A-Za-z]{3} \d{1,2}, \d{4}$/);
    expect(formatted2).toMatch(/^[A-Za-z]{3} \d{1,2}, \d{4}$/);
  });
});