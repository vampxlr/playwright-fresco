import { test, expect } from '@playwright/test';
import { PageCreator } from '../pageobjects/PageCreator';
import { MeetingPageContext } from '../types/types'


// otherwise the it opens 4 instances, need to figure out why


// context for john 
let john: MeetingPageContext;

// context for jane
let jane: MeetingPageContext;

test.describe.configure({ mode: 'serial' });




test.describe('tests for meeting pages', () => {


  test.beforeAll(async ({ browser }) => {
    const pageCreator = new PageCreator(browser);
    john = await pageCreator.createMeetingPageContext("John");
    jane = await pageCreator.createMeetingPageContext("Jane");

  })



  test('Avatar related tests', async ({ browser }) => {


    await test.step('is meeting page avatar loaded', async () => {
      const isMeetingPageLoaded = await john.meetingPage.isDragAbleAvatarVisible();
      expect(isMeetingPageLoaded).toEqual(true);
    });


    await test.step('drag action successful - avatar location changed after drag', async () => {
      const beforDragLocation = await john.meetingPage.currentAvatarLocation();
      await john.meetingPage.dragAvatar();
      const afterDragLocation = await john.meetingPage.currentAvatarLocation();

      expect(beforDragLocation.x).not.toEqual(afterDragLocation.x);
      expect(beforDragLocation.y).not.toEqual(afterDragLocation.y);
    });

    await test.step('Second instance avatar change position -  changes should reflect in first instance', async () => {
      let positionBefore = await john.meetingPage.positionOfAnotherAvatarFirst();

      await jane.meetingPage.dragAvatar("right", 500);
      await jane.meetingPage.dragAvatar("top", 200);

      let positionAfter = await john.meetingPage.positionOfAnotherAvatarFirst();
      expect(positionAfter?.x).not.toEqual(positionBefore?.x);
      expect(positionAfter?.y).not.toEqual(positionBefore?.y);
    });
  });

  test.describe('Meeting page button function related tests', async () => {

    test('Does window maximize', async () => {
      let beforeBoundingBox = (await jane.meetingPage.boundingBoxParticipantVideo());


      await jane.meetingPage.clickVideoExpandButton();
      let afterBoundingBox = (await jane.meetingPage.boundingBoxParticipantVideo());

      expect(beforeBoundingBox?.height).not.toEqual(afterBoundingBox?.height);
      expect(beforeBoundingBox?.width).not.toEqual(afterBoundingBox?.width);

    });

    test('Does window compress', async () => {
      let beforeBoundingBox = (await jane.meetingPage.boundingBoxParticipantVideo());


      await jane.meetingPage.clickVideoCompressButton();
      let afterBoundingBox = (await jane.meetingPage.boundingBoxParticipantVideo());

      expect(beforeBoundingBox?.height).not.toEqual(afterBoundingBox?.height);
      expect(beforeBoundingBox?.width).not.toEqual(afterBoundingBox?.width);
    });

  });

  test('Architect mode tests', async () => {

    await test.step('Clicking settings mode should turn on architect mode', async () => {
      // commented line is an example for direct locators
      // let isSidebarVisibleBefore = await jane.page.locator('.ant-layout-sider').first().isVisible();
      let isSidebarVisibleBefore = await jane.meetingPage.sideBar.first().isVisible();

      await jane.meetingPage.settingsButton.click();

      // let isSidebarVisibleAfter = await jane.page.locator('.ant-layout-sider').first().isVisible();
      let isSidebarVisibleAfter = await jane.meetingPage.sideBar.first().isVisible();

      expect(isSidebarVisibleBefore).toEqual(false);
      expect(isSidebarVisibleAfter).toEqual(true);
    });

    await test.step('select image from architect mode', async () => {
      // await jane.page.waitForTimeout(5000);

      (await jane.meetingPage.getArchButtonByText("Image")).first().click();
      const bool = await jane.meetingPage.lockButton.first().isVisible();
      if (bool) {
        (await jane.meetingPage.lockButton).first().click();
        // await jane.page.keyboard.press('L');
      }

    });

    await test.step('drag image object in architect mode', async () => {
      await jane.meetingPage.drag(".selection__item", 100, "top")

    });

    await test.step('resize selected image in architect mode', async () => {
      let resizeElement = await jane.meetingPage.wResizeButton;
      //  let position = await jane.meetingPage.getCenterOfElement(resizeElement.first());
      // await jane.page.waitForTimeout(5000);

      let selector = await jane.meetingPage.getClassFromLocator(resizeElement);
      await jane.meetingPage.drag(selector, 300, "left");
      await jane.page.waitForEvent('close');
    });
  });

});