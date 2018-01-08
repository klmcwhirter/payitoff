import { AppPage } from './app.po';

describe('payitoff App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display title', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Pay It Off! ');
  });
});
