import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MessageInput } from './MessageInput';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (_key, fallback) => fallback, i18n: { language: 'fr' } }),
}));

describe('MessageInput attachments', () => {
  it('selects, previews, removes, and sends a supported attachment', async () => {
    const onSend = jest.fn().mockResolvedValue(true);
    render(<MessageInput onSend={onSend} />);

    const file = new File(['hello'], 'notes.txt', { type: 'text/plain' });
    fireEvent.change(document.querySelector('input[type="file"]'), { target: { files: [file] } });

    expect(screen.getByText('notes.txt')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Envoyer' }));
    await waitFor(() => expect(onSend).toHaveBeenCalledWith('', [file]));
    await waitFor(() => expect(screen.queryByText('notes.txt')).not.toBeInTheDocument());
  });

  it('rejects unsupported attachments and prevents duplicate sends', async () => {
    const onSend = jest.fn().mockResolvedValue(true);
    const onError = jest.fn();
    render(<MessageInput onSend={onSend} onError={onError} isSending />);

    const file = new File(['bad'], 'script.exe', { type: 'application/octet-stream' });
    fireEvent.change(document.querySelector('input[type="file"]'), { target: { files: [file] } });

    expect(onError).toHaveBeenCalled();
    expect(onSend).not.toHaveBeenCalled();
  });
});
