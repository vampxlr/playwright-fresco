import { test, expect, ElementHandle} from '@playwright/test';
import { BrowserContext, Page } from "@playwright/test/types/test";
import { PageCreator } from '../pageobjects/PageCreator';
import { MeetingPage } from '../pageobjects/MeetingPage';

let context: BrowserContext;
let johnsPageCreator: PageCreator;
let johnsPage : Page;
let johnsMeetingPage: MeetingPage


test.beforeAll(async({browser})=>{
 context =  await browser.newContext();
    context.grantPermissions(['microphone', 'camera']);
     johnsPage = await context.newPage();
     johnsPageCreator = new PageCreator(johnsPage);
     johnsMeetingPage = johnsPageCreator.createMeetingPage();
     johnsMeetingPage.visit();
     await johnsMeetingPage.setUsername("John");
})

test('Browser context playwright test', async () => {
    await johnsMeetingPage.setupLobby();
    await johnsMeetingPage.trackAvatar();
    await johnsMeetingPage.dragAvatar();
})


