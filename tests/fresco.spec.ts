import { test, expect, ElementHandle} from '@playwright/test';
import { Locator, Page } from "@playwright/test/types/test";
import {MeetingPage} from "../pageobjects/MeetingPage";


test('Browser context playwright test', async ({browser}) => {
   
    const context =  await browser.newContext();
    context.grantPermissions(['microphone', 'camera']);

    const page : Page = await context.newPage();
    const meetingPage = new MeetingPage(page);
    meetingPage.goto();
    await meetingPage.setupLobby("Rocky");
    await meetingPage.loadAvatar();
    await meetingPage.dragAvatar();
    // await page.waitForEvent("close");
})


