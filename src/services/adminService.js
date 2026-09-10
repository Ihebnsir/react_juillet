import { usersService } from "./usersService";
import { centresService } from "./centresService";
import { formationsService } from "./formationsService";

const normalizeLegacyVerificationRequest = (centre) => ({
  id: centre.id || centre._id,
  centerName: centre.name || centre.nom || centre.email || 'Centre',
  email: centre.email || '',
  description: centre.description || '',
  city: centre.ville || centre.city || '',
  website: centre.siteWeb || centre.website || '',
  status: centre.statutVerification || centre.verifie === true ? 'verified' : 'pending',
});

export const adminService = {
  async getStatistics() {
    const [usersResult, formationsResult, centresResult] = await Promise.all([
      usersService.getAll(),
      formationsService.getAll(),
      centresService.getAll(),
    ]);

    const users = usersResult?.data || [];
    const formations = formationsResult || [];
    const centres = centresResult?.data || [];

    return {
      totalUsers: users.length,
      totalLearners: users.filter((user) => user?.role === 'apprenant' || user?.role === 'learner').length,
      totalCenters: users.filter((user) => user?.role === 'centre' || user?.role === 'center').length,
      verifiedCenters: centres.filter((centre) => centre?.verifie || centre?.statutVerification === 'VERIFIE').length,
      totalFormations: formations.length,
      averageFormationPrice: formations.length
        ? formations.reduce((sum, formation) => sum + Number(formation.price || 0), 0) / formations.length
        : 0,
    };
  },

  async getAllUsers() {
    const result = await usersService.getAll();
    return result?.data || [];
  },

  async getVerificationRequests() {
    const result = await centresService.getAll();
    const centres = result?.data || [];
    return centres
      .filter((centre) => !(centre?.verifie === true || centre?.statutVerification === 'VERIFIE'))
      .map(normalizeLegacyVerificationRequest);
  },

  async approveCenterVerification(centerId) {
    await centresService.verify(centerId);
    return { success: true, message: 'Centre vérifié avec succès' };
  },

  async rejectCenterVerification(centerId, reason) {
    await centresService.reject(centerId, reason);
    return { success: true, message: 'Demande rejetée' };
  },

  async suspendUser(userId, reason) {
    await usersService.update(userId, { statut: 'suspendu' });
    return { success: true, message: 'Utilisateur suspendu', reason };
  },

  async deleteUser(userId) {
    await usersService.remove(userId);
    return { success: true, message: 'Utilisateur supprimé' };
  },
};
