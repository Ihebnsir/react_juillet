import { formationsService } from './formationsService';

describe('formationsService', () => {
  it('enriches formations with centre details and stage information', async () => {
    const formations = await formationsService.getAll();
    const formation = formations.find((item) => item.id === 'form1');

    expect(formation).toBeDefined();
    expect(formation.centre).toBeDefined();
    expect(formation.centre.name).toBe('Tech Academy Tunis');
    expect(formation.offreStage).toBe(true);
    expect(formation.entreprisesPartenaires).toContain('Orange');
  });
});
