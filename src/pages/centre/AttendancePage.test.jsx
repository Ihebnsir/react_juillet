import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AttendancePage from './AttendancePage';
import { attendanceService } from '../../services/attendanceService';
import { sessionsService } from '../../services/sessionsService';
import { studentsService } from '../../services/studentsService';

jest.mock('../../services/attendanceService', () => ({ attendanceService: { bySession: jest.fn(), update: jest.fn(), create: jest.fn() } }));
jest.mock('../../services/sessionsService', () => ({ sessionsService: { list: jest.fn() } }));
jest.mock('../../services/studentsService', () => ({ studentsService: { list: jest.fn() } }));

describe('AttendancePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionsService.list.mockResolvedValue({ data: [{ id: 'session-1', title: 'Session 1', date: '2026-09-11' }] });
    studentsService.list.mockResolvedValue({ data: [] });
    attendanceService.bySession.mockResolvedValue({ data: [{ id: 'attendance-1', sessionId: 'session-1', learnerId: 'learner-1', learnerName: 'Ada Lovelace', formationId: 'formation-1', formationTitle: 'React', status: 'present' }] });
    attendanceService.update.mockResolvedValue({ id: 'attendance-1', sessionId: 'session-1', learnerId: 'learner-1', learnerName: 'Ada Lovelace', formationId: 'formation-1', formationTitle: 'React', status: 'late' });
  });

  it('loads a real session and persists an attendance update', async () => {
    render(<AttendancePage />);
    expect(await screen.findByText('Ada Lovelace')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('combobox', { name: 'Présence Ada Lovelace' }), { target: { value: 'late' } });
    await waitFor(() => expect(attendanceService.update).toHaveBeenCalledWith('attendance-1', expect.objectContaining({ session: 'session-1', learner: 'learner-1', status: 'late' })));
    expect(await screen.findByRole('status')).toHaveTextContent('mise à jour');
  });
});
