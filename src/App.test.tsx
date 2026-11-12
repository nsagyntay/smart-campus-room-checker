import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import App from '@/App';

describe('App — Integration / UI behavior tests (F4, F5)', () => {
  beforeEach(() => {
    render(<App />);
  });

  afterEach(() => {
    cleanup();
  });

  // ── F4: Empty state when no rooms match filters ──

  it('F4-EMPTY: setting minCapacity above all rooms shows no-match message', () => {
    const capacityInput = screen.getByLabelText(/Minimum Capacity/i);
    fireEvent.change(capacityInput, { target: { value: '100' } });

    const messages = screen.getAllByText(/No rooms match your filters/i);
    expect(messages.length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByText(/Try lowering the minimum capacity or removing equipment requirements/i)
        .length
    ).toBeGreaterThanOrEqual(1);
  });

  it('F4-EMPTY-EQUIP: requiring equipment no room has shows no-match message', () => {
    const labBenchBtn = screen.getByRole('button', { name: /Lab Bench/i });
    fireEvent.click(labBenchBtn);
    const whiteboardBtn = screen.getByRole('button', { name: /Whiteboard/i });
    fireEvent.click(whiteboardBtn);

    const messages = screen.getAllByText(/No rooms match your filters/i);
    expect(messages.length).toBeGreaterThanOrEqual(1);
  });

  it('F4-CHECK-DISABLED: Check button is disabled when no rooms match', () => {
    const capacityInput = screen.getByLabelText(/Minimum Capacity/i);
    fireEvent.change(capacityInput, { target: { value: '999' } });

    const checkBtn = screen.getByRole('button', { name: /Check Availability/i });
    expect(checkBtn).toBeDisabled();
  });

  // ── F5: Changing selected room updates availability result ──

  it('F5-ROOM-CHANGE: checking availability for one room then switching shows correct room info', () => {
    const startInput = screen.getByLabelText(/Start Time/i);
    const endInput = screen.getByLabelText(/End Time/i);
    fireEvent.change(startInput, { target: { value: '700' } });
    fireEvent.change(endInput, { target: { value: '760' } });

    const checkBtn = screen.getByRole('button', { name: /Check Availability/i });
    fireEvent.click(checkBtn);

    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(screen.getByText(/Room A101 is available/i)).toBeInTheDocument();

    const roomSelect = screen.getByLabelText(/Select Room/i) as HTMLSelectElement;
    fireEvent.change(roomSelect, { target: { value: 'C305' } });

    expect(screen.queryByText('Available')).not.toBeInTheDocument();
    expect(screen.queryByText('Unavailable')).not.toBeInTheDocument();

    expect(screen.getByText('Room C305')).toBeInTheDocument();

    fireEvent.change(startInput, { target: { value: '700' } });
    fireEvent.change(endInput, { target: { value: '760' } });
    fireEvent.click(checkBtn);

    expect(screen.getByText('Unavailable')).toBeInTheDocument();
    expect(screen.getByText(/Overlaps with/i)).toBeInTheDocument();
  });

  it('F5-BOOKINGS-UPDATE: switching rooms shows the new room bookings list', () => {
    expect(screen.getAllByText('CS 201 — Algorithms').length).toBeGreaterThanOrEqual(1);

    const roomSelect = screen.getByLabelText(/Select Room/i) as HTMLSelectElement;
    fireEvent.change(roomSelect, { target: { value: 'D410' } });

    expect(screen.getAllByText('Guest Lecture — Marketing').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Case Study Workshop').length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText('CS 201 — Algorithms')).not.toBeInTheDocument();
  });

  it('F5-RESET-CLEARS: Reset button clears time inputs and result', () => {
    const startInput = screen.getByLabelText(/Start Time/i) as HTMLInputElement;
    const endInput = screen.getByLabelText(/End Time/i) as HTMLInputElement;

    fireEvent.change(startInput, { target: { value: '700' } });
    fireEvent.change(endInput, { target: { value: '760' } });
    fireEvent.click(screen.getByRole('button', { name: /Check Availability/i }));

    expect(screen.getByText('Available')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Reset/i }));

    expect(startInput.value).toBe('');
    expect(endInput.value).toBe('');
    expect(screen.queryByText('Available')).not.toBeInTheDocument();
  });
});
