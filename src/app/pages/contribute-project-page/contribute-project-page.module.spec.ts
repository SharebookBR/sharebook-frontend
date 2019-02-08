import { ContributeProjectPageModule } from './contribute-project-page.module';

describe('ContributeProjectPageModule', () => {
  let contributeProjectPageModule: ContributeProjectPageModule;

  beforeEach(() => {
    contributeProjectPageModule = new ContributeProjectPageModule();
  });

  it('should create an instance', () => {
    expect(contributeProjectPageModule).toBeTruthy();
  });
});
