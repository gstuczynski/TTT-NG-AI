import { TTTPage } from './app.po';

describe('ttt App', function() {
  let page: TTTPage;

  beforeEach(() => {
    page = new TTTPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
