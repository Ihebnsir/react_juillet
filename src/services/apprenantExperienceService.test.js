import { getMesAvisForUser, getRecommandationsForUser } from './apprenantExperienceService';

describe('apprenantExperienceService', () => {
  it('returns recommendations with a reason for the current learner', () => {
    const recommendations = getRecommandationsForUser(1);

    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations[0]).toHaveProperty('raison');
    expect(recommendations[0].formation).toHaveProperty('title');
  });

  it('returns the learner reviews filtered by user id', () => {
    const avis = getMesAvisForUser(1);

    expect(avis.length).toBeGreaterThan(0);
    expect(avis[0].apprenantId).toBe(1);
  });
});
