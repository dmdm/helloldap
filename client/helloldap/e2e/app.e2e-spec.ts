import { HelloldapPage } from './app.po';

describe('helloldap App', function() {
  let page: HelloldapPage;

  beforeEach(() => {
    page = new HelloldapPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
