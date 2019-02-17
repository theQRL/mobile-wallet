import wd from 'wd';
var TouchAction = wd.TouchAction;

import 'react-native';
import React from 'react';
import App from '../App';
import SignIn from '../screens/SignIn';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
jest.mock('react-native-camera', () => 'Camera');
jest.mock('@haskkor/react-native-pincode', () => 'PinCode');
// jest.mock('react-navigation', () => 'DrawerNavigator');
// jest.mock('react-native-camera', () => require.requireActual('../__mocks__/react-native-camera').default())

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
const PORT = 4723;
const config = {
	platformName: 'Android',
	deviceName: 'Pixel_2_API_27',
	automationName: "UiAutomator2",
	// appPackage: 'com.theqrl',
	// appActivity: 'MainActivity',
	app: '/Users/abilican/Documents/projects/perso/theqrl/RNapp/theQRL/android/app/build/outputs/apk/release/qrlwallet-1.0.7.apk'
};

const driver = wd.promiseChainRemote('localhost', PORT);

// for AWS Device Farm testing
// const driver = wd.promiseChainRemote('lhttp://localhost:4723/wd/hub');


beforeAll(async () => {
  	await driver.init(config);
  	await driver.sleep(2000); // wait for app to load
})

afterAll(async () => {
	try {
		await driver.quit();
	}
	catch(err) {
		console.error(err);
	}
});

test('appium renders', async () => {
	expect(await driver.hasElementByAccessibilityId('notthere')).toBe(false);
	// expect(await driver.hasElementByAccessibilityId('testview')).toBe(true);
});

test('has correct SignIn view', async () => {
	expect(await driver.hasElementByAccessibilityId('SignIn')).toBe(true);
	expect(await driver.hasElementByAccessibilityId('createDefaultWalletButton')).toBe(true);
	expect(await driver.hasElementByAccessibilityId('createAdvancedWalletButton')).toBe(true);
	expect(await driver.hasElementByAccessibilityId('openExistingWalletButton')).toBe(true);
});

test('opens default wallet configuration when button clicked', async () => {
	await driver.elementByAccessibilityId('createDefaultWalletButton').click();
	
});

test('has correct CompleteSetup view', async () => {
	// has all the buttons
	await driver.setImplicitWaitTimeout(5000);
	expect(await driver.hasElementByAccessibilityId('CompleteSetup')).toBe(true);
	expect(await driver.hasElementByAccessibilityId('create4digitPinButton')).toBe(true);
	expect(await driver.hasElementByAccessibilityId('cancelButtonBeforePin')).toBe(true);
});

test('enter correct PIN', async () => {
	await driver.setImplicitWaitTimeout(5000);
	// enter test PIN
	await driver.elementByAccessibilityId('create4digitPinButton').click();
	// expect(await driver.hasElementByXPath('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[7]')).toBe(true);

	// const element = await driver.hasElementByXPath('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[7]');

	let el1 = await driver.elementByXPath("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[7]");
	await el1.click();
	await el1.click();
	await el1.click();
	await el1.click();

});

test('enter the same password twice', async () => {
	await driver.setImplicitWaitTimeout(5000);
	let el2 = await driver.elementByXPath("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[7]");
	await el2.click();
	await el2.click();
	await el2.click();
	await el2.click();
	
});

test('show create wallet button after correct PIN', async () => {
	// let pageSource = await driver.source();
	// console.log(pageSource)
	await driver.setImplicitWaitTimeout(10000);
	expect(await driver.hasElementByAccessibilityId('createWalletButton')).toBe(true);
	expect(await driver.hasElementByAccessibilityId('cancelButtonAfterPin')).toBe(true);
});

test('should create a new wallet', async () => {
	// let pageSource = await driver.source();
	// console.log(pageSource)
	await driver.setImplicitWaitTimeout(5000);
	await driver.elementByAccessibilityId('createWalletButton').click();
});

test('should show balance', async () => {
	// let pageSource = await driver.source();
	// console.log(pageSource)
	await driver.setImplicitWaitTimeout(10000);
	expect(await driver.hasElementByAccessibilityId('TransactionsHistory')).toBe(true);
});

