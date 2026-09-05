import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NewSupportConversationModal } from '../../components/messaging/NewSupportConversationModal';
import { ToastMessage } from '../../components/UI/ToastMessage';
import { messagingService } from '../../services/messagingService';

export const SupportPage = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [isModalOpen, setIsModalOpen] = useState(true);
	const [error, setError] = useState('');

	const handleCreate = async ({ subject, message }) => {
		try {
			const conversation = await messagingService.createSupportConversation({ subject, initialMessage: message });
			setIsModalOpen(false);
			navigate(`/messagerie?conversation=${conversation.id}`);
		} catch (err) {
			setError(err?.message || t('messaging.error', 'Impossible de créer le ticket.'));
		}
	};

	return (
		<div className="min-h-[70vh] rounded-[32px] border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
			<ToastMessage message={error} type="error" onClose={() => setError('')} />
			<h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Support SkillBridge</h1>
			<p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Ouvrez une conversation avec l’équipe support.</p>
			<button onClick={() => setIsModalOpen(true)} className="mt-6 rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700">
				Nouvelle conversation
			</button>
			<NewSupportConversationModal isOpen={isModalOpen} onClose={() => navigate('/messagerie')} onSubmit={handleCreate} />
		</div>
	);
};
