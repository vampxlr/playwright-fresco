import { test, expect } from '@playwright/test';
import { PageCreator } from '../pageobjects/PageCreator';
import { MeetingPageContext } from '../types/types'


// otherwise the it opens 4 instances, need to figure out why
test.describe.configure({ mode: 'serial' });

// context for john 
let john: MeetingPageContext

// context for jane
let jane: MeetingPageContext


test.describe('tests between two instances', () => {

  test.beforeAll(async ({ browser }) => {
    const pageCreator = new PageCreator(browser);
    john = await pageCreator.createMeetingPageContext("John");
    jane = await pageCreator.createMeetingPageContext("Jane");

  })


  test('is meeting page avatar loaded', async () => {
    const isMeetingPageLoaded = await john.meetingPage.isDragAbleAvatarVisible();
    expect(isMeetingPageLoaded).toEqual(true);
  })


  test('drag action successful - avatar location changed after drag', async () => {
    const beforDragLocation = await john.meetingPage.currentAvatarLocation();
    await john.meetingPage.dragAvatar();
    const afterDragLocation = await john.meetingPage.currentAvatarLocation();

    expect(beforDragLocation.x).not.toEqual(afterDragLocation.x);
    expect(beforDragLocation.y).not.toEqual(afterDragLocation.y);
  })

  test('Second instance avatar change position', async () => {
  await jane.meetingPage.dragAvatar("right", 500);
    await jane.meetingPage.dragAvatar("top", 200);
  })

  test('Does window maximize', async () => {
    await jane.meetingPage.clickVideoExpandButton();
 })

  test('Does window compress', async () => {
    await jane.meetingPage.clickVideoCompressButton();
  })
});
