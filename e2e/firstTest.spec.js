describe('Example', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have welcome screen', async () => {
    await expect(element(by.id('SignIn'))).toBeVisible();
    await expect(element(by.id('createDefaultWalletButton'))).toBeVisible();
    await expect(element(by.id('createAdvancedWalletButton'))).toBeVisible();
    await expect(element(by.id('openExistingWalletButton'))).toBeVisible();
  });

  it('should open default wallet creation', async () => {
    element(by.id('createDefaultWalletButton')).tap();
    await expect(element(by.id('CompleteSetup'))).toBeVisible(); 
    await expect(element(by.id('create4digitPinButton'))).toBeVisible();
    await expect(element(by.id('cancelButtonBeforePin'))).toBeVisible();
  });

  it('should open PIN screen', async () => {
    element(by.id('create4digitPinButton')).tap();
    await expect(element(by.id('pinCodeView'))).toBeVisible(); 
  });

});