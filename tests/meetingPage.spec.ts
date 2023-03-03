import {test, expect, ElementHandle} from '@playwright/test';
import { BrowserContext, Page } from "@playwright/test/types/test";
import { PageCreator } from '../pageobjects/PageCreator';
import { MeetingPage } from '../pageobjects/MeetingPage';

// needs to be moved somewhere else
interface MeetingPageContext {
  meetingPage: MeetingPage
  context: BrowserContext
}


test.describe.configure({ mode: 'serial' });


// should be refactored to support all other page
async function createMeetingPage(browser, username): Promise<MeetingPageContext> {
    const context: BrowserContext = await browser.newContext();
    context.grantPermissions(['microphone', 'camera']);
    const page: Page = await context.newPage();
    const pageCreator = new PageCreator(page);
    const meetingPage = pageCreator.createMeetingPage();
    meetingPage.visit();
    await meetingPage.setUsername(username);

    return {meetingPage, context};
  }

// context for john 
let john: MeetingPageContext

// context for jane
let jane: MeetingPageContext


test.describe('two tests', () => {

  test.beforeAll(async({browser})=>{
    john = await createMeetingPage(browser, "john");
    jane = await createMeetingPage(browser, "Jane");  
  })

  test('john setup', async () => {
    await john.meetingPage.setupLobby();
    await john.meetingPage.dragAvatar();
    // john.context.waitForEvent('close');

})

test('jane setup', async () => {
    await jane.meetingPage.setupLobby();
    await jane.meetingPage.dragAvatar("right",100);
    await jane.meetingPage.dragAvatar("top",300);
    await jane.meetingPage.dragAvatar("right",600);
    await jane.meetingPage.dragAvatar("bottom",300);

    // jane.context.waitForEvent('close');
})
});
